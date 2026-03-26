import os
import json
import base64
import anthropic
from ..schemas import ContractExtraction

EXTRACTION_TOOL = {
    "name": "extract_contract_fields",
    "description": "Extract structured rate plan fields from a hospitality contract PDF.",
    "input_schema": {
        "type": "object",
        "required": [
            "contract_type", "rate_type", "client_name", "valid_dates",
            "cancellation", "commission", "confidence",
        ],
        "properties": {
            "contract_type": {
                "type": "string",
                "enum": ["corporate", "group"],
                "description": "Detected from header line on page 1: 'Corporate Rate Agreement' → corporate, 'Group Agreement' → group.",
            },
            "rate_type": {
                "type": "string",
                "enum": ["fixed_seasonal", "bar_discount", "group_block"],
                "description": "Corporate: if contract has a date-range × room-type rate table → fixed_seasonal; if single % off BAR → bar_discount. Group always → group_block.",
            },
            "client_name": {
                "type": "string",
                "description": "Organization or client name from the contract.",
            },
            "client_contact": {
                "type": ["object", "null"],
                "properties": {
                    "name": {"type": "string"},
                    "phone": {"type": ["string", "null"]},
                    "email": {"type": ["string", "null"]},
                },
                "required": ["name"],
            },
            "property_contact": {
                "type": ["object", "null"],
                "properties": {
                    "name": {"type": "string"},
                    "phone": {"type": ["string", "null"]},
                    "email": {"type": ["string", "null"]},
                },
                "required": ["name"],
            },
            "valid_dates": {
                "type": "object",
                "properties": {
                    "start": {"type": "string", "description": "ISO date YYYY-MM-DD"},
                    "end": {"type": "string", "description": "ISO date YYYY-MM-DD"},
                },
                "required": ["start", "end"],
            },
            "seasonal_rates": {
                "type": ["array", "null"],
                "description": "For fixed_seasonal corporate contracts. Each entry is one cell in the season × room-type grid.",
                "items": {
                    "type": "object",
                    "properties": {
                        "date_range": {
                            "type": "object",
                            "properties": {
                                "start": {"type": "string"},
                                "end": {"type": "string"},
                            },
                            "required": ["start", "end"],
                        },
                        "room_type": {"type": "string", "description": "Raw room type name as it appears in the contract."},
                        "rate": {"type": "number", "description": "Nightly rate in dollars."},
                    },
                    "required": ["date_range", "room_type", "rate"],
                },
            },
            "bar_discount": {
                "type": ["object", "null"],
                "description": "For bar_discount corporate contracts.",
                "properties": {
                    "pct": {"type": "number", "description": "Discount percentage as a decimal (e.g. 0.20 for 20%)."},
                    "period": {
                        "type": "object",
                        "properties": {
                            "start": {"type": "string"},
                            "end": {"type": "string"},
                        },
                        "required": ["start", "end"],
                    },
                },
                "required": ["pct", "period"],
            },
            "room_block": {
                "type": ["array", "null"],
                "description": "For group contracts. Each entry is one row in the room block table.",
                "items": {
                    "type": "object",
                    "properties": {
                        "room_type": {"type": "string"},
                        "date": {"type": "string", "description": "ISO date YYYY-MM-DD"},
                        "count": {"type": "integer"},
                        "rate": {"type": "number"},
                    },
                    "required": ["room_type", "date", "count", "rate"],
                },
            },
            "total_room_nights": {"type": ["integer", "null"]},
            "total_anticipated_revenue": {"type": ["number", "null"]},
            "blackout_dates": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "event_name": {"type": "string"},
                        "date_range": {
                            "type": "object",
                            "properties": {
                                "start": {"type": "string"},
                                "end": {"type": "string"},
                            },
                            "required": ["start", "end"],
                        },
                    },
                    "required": ["event_name", "date_range"],
                },
            },
            "last_room_availability": {
                "type": ["boolean", "null"],
                "description": "Corporate only. true if 'Last Room Availability' is offered, false if explicitly denied, null if not mentioned.",
            },
            "cut_off_date": {
                "type": ["string", "null"],
                "description": "Group only. The cut-off date as ISO date or descriptive string.",
            },
            "cancellation": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["standard_24hr", "tiered_scale"],
                    },
                    "tiers": {
                        "type": ["array", "null"],
                        "items": {
                            "type": "object",
                            "properties": {
                                "days_range": {"type": "string", "description": "e.g. '61+ days', '60-31 days'"},
                                "pct_of_revenue": {"type": "number", "description": "Percentage as decimal (0.25 for 25%)"},
                            },
                            "required": ["days_range", "pct_of_revenue"],
                        },
                    },
                },
                "required": ["type"],
            },
            "commission": {
                "type": "object",
                "properties": {
                    "commissionable": {"type": "boolean"},
                    "pct": {"type": ["number", "null"]},
                },
                "required": ["commissionable"],
            },
            "deposit_schedule": {
                "type": ["array", "null"],
                "description": "Group deposit tiers.",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {"type": "string"},
                        "due_date_description": {"type": "string"},
                        "amount_or_pct": {"type": "string"},
                    },
                    "required": ["type", "due_date_description", "amount_or_pct"],
                },
            },
            "concessions": {
                "type": "array",
                "description": "Extracted perks/concessions. For each one, indicate if it maps to a known waiver flag.",
                "items": {
                    "type": "object",
                    "properties": {
                        "description": {"type": "string"},
                        "maps_to_waiver": {
                            "type": ["string", "null"],
                            "enum": [
                                "waiveEarlyCheckIn", "waiveLateCheckOut",
                                "waiveParkingFee", "waiveCleaningFee",
                                "waiveResortFee", None,
                            ],
                        },
                    },
                    "required": ["description"],
                },
            },
            "room_night_commitment": {
                "type": ["object", "null"],
                "properties": {
                    "count": {"type": "integer"},
                    "type": {"type": "string", "enum": ["estimate", "minimum"]},
                    "pct_of_block": {"type": ["number", "null"]},
                },
                "required": ["count", "type"],
            },
            "confidence": {
                "type": "object",
                "description": "Per-field confidence. Keys are field names from this schema. Values are 'high', 'medium', or 'low'.",
                "additionalProperties": {
                    "type": "string",
                    "enum": ["high", "medium", "low"],
                },
            },
        },
    },
}

SYSTEM_PROMPT = """You are a contract extraction specialist for Kasa, a hospitality company. Your job is to read signed hospitality contracts (Corporate Rate Agreements or Group Agreements) and extract structured fields for rate plan creation.

## Detection Rules

1. **Contract type**: The header on page 1 reliably says "Corporate Rate Agreement" or "Group Agreement" (or similar variants like "Group Contract", "Corporate Rate Contract").

2. **Rate structure** (corporate only):
   - If the contract contains a tabular grid with date ranges as rows/columns and room types with dollar amounts → `fixed_seasonal`
   - If the contract states a single percentage discount off Best Available Rate (BAR) → `bar_discount`
   - Group contracts always use `group_block`

## Extraction Guidelines

- Extract ALL dates as ISO format (YYYY-MM-DD)
- Extract rates as dollar amounts (numbers, not strings)
- Extract percentages as decimals (20% → 0.20)
- Room type names: extract EXACTLY as written in the contract — do not normalize or standardize
- If a field is not present or cannot be confidently determined, use null
- For blackout dates, extract the event name and date range for each

## Confidence Scoring

Rate each extracted field:
- **high**: Field is clearly present, unambiguous, in a structured format (tables, labeled fields)
- **medium**: Field is present but requires interpretation (buried in prose, ambiguous labeling, pattern matching needed)
- **low**: Field is inferred, partially present, or the contract format makes extraction uncertain

Always include confidence for at least: contract_type, rate_type, client_name, valid_dates, cancellation, commission, and any rate structure fields.

## Concession Mapping

Map known concessions to waiver flags:
- Complimentary/free/waived early check-in → waiveEarlyCheckIn
- Complimentary/free/waived late check-out → waiveLateCheckOut
- Complimentary/free/waived parking → waiveParkingFee
- Complimentary/free/waived cleaning fee → waiveCleaningFee
- Complimentary/free/waived resort fee → waiveResortFee
- Everything else (gift bags, restaurant discounts, etc.) → maps_to_waiver: null

## Important

- If this appears to be a scanned/image-based PDF, still extract what you can but set confidence to 'low' for any field you're uncertain about
- Do NOT guess or hallucinate values — use null for anything you cannot confidently extract
- Corporate cancellation is almost always standard 24hr / 3PM EST boilerplate → type: "standard_24hr"
- Group cancellation varies — extract the tiered scale if present"""


async def extract_contract(pdf_bytes: bytes) -> tuple[ContractExtraction, list[str]]:
    """Extract rate plan fields from a contract PDF using Claude API."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable is not set")

    client = anthropic.Anthropic(api_key=api_key)
    pdf_b64 = base64.standard_b64encode(pdf_bytes).decode("utf-8")

    response = client.messages.create(
        model="claude-sonnet-4-6-20250514",
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        tools=[EXTRACTION_TOOL],
        tool_choice={"type": "tool", "name": "extract_contract_fields"},
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": "Extract all rate plan fields from this signed hospitality contract. Use the extract_contract_fields tool to return the structured data.",
                    },
                ],
            }
        ],
    )

    warnings: list[str] = []
    extraction_data = None

    for block in response.content:
        if block.type == "tool_use" and block.name == "extract_contract_fields":
            extraction_data = block.input
            break

    if extraction_data is None:
        raise ValueError("Claude did not return structured extraction data")

    # Check for scanned PDF warning
    confidence = extraction_data.get("confidence", {})
    low_count = sum(1 for v in confidence.values() if v == "low")
    if low_count > len(confidence) * 0.5:
        warnings.append(
            "This appears to be a scanned document — please verify all extracted fields carefully."
        )

    extraction = ContractExtraction(**extraction_data)
    return extraction, warnings
