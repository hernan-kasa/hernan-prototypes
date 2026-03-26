import os
import asyncio
import random

from fastapi import APIRouter, UploadFile, File, HTTPException

from ..schemas import ExtractionResponse, ContractExtraction

router = APIRouter(prefix="/api", tags=["extraction"])


# -- Demo mock extractions based on real Mint House 70 Pine contracts --

MOCK_CORPORATE_SEASONAL = ContractExtraction(
    contract_type="corporate",
    rate_type="fixed_seasonal",
    client_name="Acme Corporation",
    client_contact={"name": "James Rivera", "phone": "(212) 555-0142", "email": "j.rivera@acmecorp.com"},
    property_contact={"name": "Sarah Chen", "phone": "(212) 555-0199", "email": "s.chen@kasaliving.com"},
    valid_dates={"start": "2026-01-01", "end": "2026-12-31"},
    seasonal_rates=[
        {"date_range": {"start": "2026-01-01", "end": "2026-03-31"}, "room_type": "Studio (Kitchenette)", "rate": 199.00},
        {"date_range": {"start": "2026-04-01", "end": "2026-06-30"}, "room_type": "Studio (Kitchenette)", "rate": 229.00},
        {"date_range": {"start": "2026-07-01", "end": "2026-09-30"}, "room_type": "Studio (Kitchenette)", "rate": 249.00},
        {"date_range": {"start": "2026-10-01", "end": "2026-12-31"}, "room_type": "Studio (Kitchenette)", "rate": 219.00},
        {"date_range": {"start": "2026-01-01", "end": "2026-03-31"}, "room_type": "Junior One Bedroom Apartment", "rate": 279.00},
        {"date_range": {"start": "2026-04-01", "end": "2026-06-30"}, "room_type": "Junior One Bedroom Apartment", "rate": 319.00},
        {"date_range": {"start": "2026-07-01", "end": "2026-09-30"}, "room_type": "Junior One Bedroom Apartment", "rate": 349.00},
        {"date_range": {"start": "2026-10-01", "end": "2026-12-31"}, "room_type": "Junior One Bedroom Apartment", "rate": 299.00},
        {"date_range": {"start": "2026-01-01", "end": "2026-03-31"}, "room_type": "One Bedroom Suite", "rate": 349.00},
        {"date_range": {"start": "2026-04-01", "end": "2026-06-30"}, "room_type": "One Bedroom Suite", "rate": 399.00},
        {"date_range": {"start": "2026-07-01", "end": "2026-09-30"}, "room_type": "One Bedroom Suite", "rate": 429.00},
        {"date_range": {"start": "2026-10-01", "end": "2026-12-31"}, "room_type": "One Bedroom Suite", "rate": 379.00},
    ],
    bar_discount=None,
    room_block=None,
    total_room_nights=None,
    total_anticipated_revenue=None,
    blackout_dates=[
        {"event_name": "Independence Day Week", "date_range": {"start": "2026-07-01", "end": "2026-07-07"}},
        {"event_name": "Thanksgiving Week", "date_range": {"start": "2026-11-23", "end": "2026-11-29"}},
        {"event_name": "Holiday / New Year's", "date_range": {"start": "2026-12-23", "end": "2027-01-02"}},
    ],
    last_room_availability=True,
    cut_off_date=None,
    cancellation={"type": "standard_24hr", "tiers": None},
    commission={"commissionable": False, "pct": None},
    deposit_schedule=None,
    concessions=[
        {"description": "Complimentary high-speed Wi-Fi", "maps_to_waiver": None},
        {"description": "Complimentary parking (1 vehicle)", "maps_to_waiver": "waiveParkingFee"},
        {"description": "Complimentary early check-in (subject to availability)", "maps_to_waiver": "waiveEarlyCheckIn"},
        {"description": "10% discount at Blue Park Kitchen restaurant", "maps_to_waiver": None},
    ],
    room_night_commitment=None,
    confidence={
        "contract_type": "high",
        "rate_type": "high",
        "client_name": "high",
        "client_contact": "high",
        "property_contact": "high",
        "valid_dates": "high",
        "seasonal_rates": "high",
        "blackout_dates": "high",
        "last_room_availability": "medium",
        "cancellation": "high",
        "commission": "high",
        "concessions": "medium",
    },
)

MOCK_GROUP = ContractExtraction(
    contract_type="group",
    rate_type="group_block",
    client_name="Guttmacher Institute — Board of Directors Meeting",
    client_contact={"name": "Patricia Morales", "phone": "(202) 555-0178", "email": "p.morales@guttmacher.org"},
    property_contact={"name": "Sarah Chen", "phone": "(212) 555-0199", "email": "s.chen@kasaliving.com"},
    valid_dates={"start": "2026-09-10", "end": "2026-09-15"},
    seasonal_rates=None,
    bar_discount=None,
    room_block=[
        {"room_type": "Studio Plus", "date": "2026-09-10", "count": 8, "rate": 225.00},
        {"room_type": "Studio Plus", "date": "2026-09-11", "count": 10, "rate": 225.00},
        {"room_type": "Studio Plus", "date": "2026-09-12", "count": 10, "rate": 225.00},
        {"room_type": "Studio Plus", "date": "2026-09-13", "count": 10, "rate": 225.00},
        {"room_type": "Studio Plus", "date": "2026-09-14", "count": 6, "rate": 225.00},
        {"room_type": "One Bedroom", "date": "2026-09-10", "count": 4, "rate": 295.00},
        {"room_type": "One Bedroom", "date": "2026-09-11", "count": 5, "rate": 295.00},
        {"room_type": "One Bedroom", "date": "2026-09-12", "count": 5, "rate": 295.00},
        {"room_type": "One Bedroom", "date": "2026-09-13", "count": 5, "rate": 295.00},
        {"room_type": "One Bedroom", "date": "2026-09-14", "count": 3, "rate": 295.00},
    ],
    total_room_nights=66,
    total_anticipated_revenue=16830.00,
    blackout_dates=[],
    last_room_availability=None,
    cut_off_date="2026-08-10",
    cancellation={
        "type": "tiered_scale",
        "tiers": [
            {"days_range": "61+ days before arrival", "pct_of_revenue": 0.25},
            {"days_range": "60–31 days before arrival", "pct_of_revenue": 0.70},
            {"days_range": "30–0 days before arrival", "pct_of_revenue": 1.00},
        ],
    },
    commission={"commissionable": True, "pct": 0.10},
    deposit_schedule=[
        {"type": "Initial deposit", "due_date_description": "Upon signing", "amount_or_pct": "25% of anticipated revenue"},
        {"type": "Second deposit", "due_date_description": "60 days prior to arrival", "amount_or_pct": "50% of anticipated revenue"},
        {"type": "Final payment", "due_date_description": "Upon departure / within 30 days", "amount_or_pct": "Remaining balance"},
    ],
    concessions=[
        {"description": "Complimentary Wi-Fi for all guests", "maps_to_waiver": None},
        {"description": "Complimentary late check-out until 2:00 PM", "maps_to_waiver": "waiveLateCheckOut"},
        {"description": "Complimentary parking for up to 10 vehicles", "maps_to_waiver": "waiveParkingFee"},
        {"description": "Private meeting room (Pine Room) — Sep 11–13, 8AM–5PM", "maps_to_waiver": None},
        {"description": "Welcome gift bags at front desk for all attendees", "maps_to_waiver": None},
    ],
    room_night_commitment={"count": 66, "type": "minimum", "pct_of_block": 0.80},
    confidence={
        "contract_type": "high",
        "rate_type": "high",
        "client_name": "high",
        "client_contact": "high",
        "property_contact": "high",
        "valid_dates": "high",
        "room_block": "high",
        "total_room_nights": "high",
        "total_anticipated_revenue": "medium",
        "cut_off_date": "medium",
        "cancellation": "medium",
        "commission": "high",
        "deposit_schedule": "medium",
        "concessions": "medium",
        "room_night_commitment": "high",
    },
)


@router.post("/extract", response_model=ExtractionResponse)
async def extract_contract_endpoint(file: UploadFile = File(...)):
    if not file.content_type or "pdf" not in file.content_type:
        raise HTTPException(status_code=400, detail="File must be a PDF")

    pdf_bytes = await file.read()
    if len(pdf_bytes) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 20MB)")

    api_key = os.environ.get("ANTHROPIC_API_KEY")

    if api_key:
        # Real extraction via Claude API
        from ..services.contract_extractor import extract_contract

        try:
            extraction, warnings = await extract_contract(pdf_bytes)
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Extraction failed: {str(e)}. Please try again or use the manual wizard.",
            )
        return ExtractionResponse(extraction=extraction, warnings=warnings)

    # Demo mode — simulate extraction delay, return mock data
    await asyncio.sleep(random.uniform(3.0, 5.0))

    # Alternate between corporate and group based on file size as a simple toggle
    if len(pdf_bytes) % 2 == 0:
        extraction = MOCK_CORPORATE_SEASONAL
        warnings = ["Demo mode: returning mock Corporate Rate Agreement extraction. Set ANTHROPIC_API_KEY for real extraction."]
    else:
        extraction = MOCK_GROUP
        warnings = ["Demo mode: returning mock Group Agreement extraction. Set ANTHROPIC_API_KEY for real extraction."]

    return ExtractionResponse(extraction=extraction, warnings=warnings)
