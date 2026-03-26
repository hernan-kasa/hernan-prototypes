from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["lookups"])

# Mock data based on real Kasa properties and policies.
# In production these would come from existing Kontrol APIs.

PROPERTIES = [
    {
        "id": "prop-70pine",
        "name": "Mint House at 70 Pine",
        "room_types": [
            {"id": "6437a1b2c3d4e5f6a7b8c9d0", "name": "Studio", "code": "STD"},
            {"id": "6437a1b2c3d4e5f6a7b8c9d1", "name": "Premium Studio", "code": "PSTD"},
            {"id": "6437a1b2c3d4e5f6a7b8c9d2", "name": "Superior Studio", "code": "SSTD"},
            {"id": "6437a1b2c3d4e5f6a7b8c9d3", "name": "One Bedroom", "code": "1BR"},
            {"id": "6437a1b2c3d4e5f6a7b8c9d4", "name": "Junior One Bedroom", "code": "J1BR"},
            {"id": "6437a1b2c3d4e5f6a7b8c9d5", "name": "Two Bedroom", "code": "2BR"},
        ],
    },
    {
        "id": "prop-downtown",
        "name": "Kasa Downtown Austin",
        "room_types": [
            {"id": "6437b1b2c3d4e5f6a7b8c9d0", "name": "Studio", "code": "STD"},
            {"id": "6437b1b2c3d4e5f6a7b8c9d1", "name": "One Bedroom", "code": "1BR"},
            {"id": "6437b1b2c3d4e5f6a7b8c9d2", "name": "Two Bedroom", "code": "2BR"},
        ],
    },
    {
        "id": "prop-nashville",
        "name": "Kasa The Gulch Nashville",
        "room_types": [
            {"id": "6437c1b2c3d4e5f6a7b8c9d0", "name": "Studio", "code": "STD"},
            {"id": "6437c1b2c3d4e5f6a7b8c9d1", "name": "Premium Studio", "code": "PSTD"},
            {"id": "6437c1b2c3d4e5f6a7b8c9d2", "name": "One Bedroom", "code": "1BR"},
        ],
    },
]

CANCELLATION_POLICIES = [
    {"id": "cp-strict", "name": "Strict (24hr / 3PM EST)", "code": "STRICT"},
    {"id": "cp-moderate", "name": "Moderate (48hr)", "code": "MODERATE"},
    {"id": "cp-flex", "name": "Flexible (72hr)", "code": "FLEX"},
    {"id": "cp-nonrefundable", "name": "Non-Refundable", "code": "NRF"},
    {"id": "cp-group-standard", "name": "Group Standard (tiered)", "code": "GRP-STD"},
]

BOOKING_BEHAVIOR_PROFILES = [
    {
        "id": "bbp-pay-booking",
        "name": "Pay at Booking",
        "description": "Full payment collected at time of booking. Standard for corporate direct-bill.",
    },
    {
        "id": "bbp-pay-checkin",
        "name": "Pay at Check-in",
        "description": "Payment collected at check-in. Used for individual-pays corporate contracts.",
    },
    {
        "id": "bbp-bill-company",
        "name": "Bill to Company (Direct Bill)",
        "description": "Invoiced to company master account. Used for corporate negotiated with direct billing.",
    },
    {
        "id": "bbp-group-deposit",
        "name": "Group Deposit Schedule",
        "description": "Tiered deposit schedule per contract terms. Used for group agreements.",
    },
]

# Mock existing rate plans for amendment mode
EXISTING_RATE_PLANS = [
    {
        "id": "rp-001",
        "planId": "rp-001",
        "name": "Corporate - Acme Corp 2026",
        "code": "CORP-ACME26",
        "rateCode": "ACME26",
        "planType": "Corporate Negotiated",
        "category": "negotiated",
        "propertyId": "prop-70pine",
        "description": "Negotiated corporate rate for Acme Corporation, valid Jan–Dec 2026.",
        "cancellationPolicy": "cp-strict",
        "bookingBehaviorProfileId": "bbp-bill-company",
        "marketSegmentation": {
            "category": "Contract",
            "segment": "Corporate",
            "subSegment": "Negotiated",
        },
        "applicabilityConfiguration": {
            "effectiveDateRange": {"start": "2026-01-01", "end": "2026-12-31"},
            "applicableDateRange": {"start": "2026-01-01", "end": "2026-12-31"},
            "reservationSource": ["direct"],
            "appliesToAllCurrentAndFutureRoomTypes": False,
            "blockedDateRanges": [
                {"start": "2026-07-01", "end": "2026-07-07", "label": "Independence Day Week"},
                {"start": "2026-12-23", "end": "2026-12-31", "label": "Holiday Week"},
            ],
            "blockedDaysOfWeek": [],
        },
        "roomTypeGroups": [
            {
                "roomTypes": ["6437a1b2c3d4e5f6a7b8c9d0"],
                "roomTypeNames": ["Studio"],
                "actions": {
                    "rateModifierLevel": "periodic",
                    "rateModifier": {
                        "type": "set",
                        "seasons": [
                            {"dateRange": {"start": "2026-01-01", "end": "2026-03-31"}, "amountInCents": 19900},
                            {"dateRange": {"start": "2026-04-01", "end": "2026-06-30"}, "amountInCents": 22900},
                            {"dateRange": {"start": "2026-07-01", "end": "2026-09-30"}, "amountInCents": 24900},
                            {"dateRange": {"start": "2026-10-01", "end": "2026-12-31"}, "amountInCents": 21900},
                        ],
                    },
                    "waiveEarlyCheckIn": False,
                    "waiveLateCheckOut": False,
                    "waiveParkingFee": True,
                    "waiveCleaningFee": False,
                    "waiveResortFee": False,
                    "taxExempt": False,
                },
            },
            {
                "roomTypes": ["6437a1b2c3d4e5f6a7b8c9d3"],
                "roomTypeNames": ["One Bedroom"],
                "actions": {
                    "rateModifierLevel": "periodic",
                    "rateModifier": {
                        "type": "set",
                        "seasons": [
                            {"dateRange": {"start": "2026-01-01", "end": "2026-03-31"}, "amountInCents": 27900},
                            {"dateRange": {"start": "2026-04-01", "end": "2026-06-30"}, "amountInCents": 31900},
                            {"dateRange": {"start": "2026-07-01", "end": "2026-09-30"}, "amountInCents": 34900},
                            {"dateRange": {"start": "2026-10-01", "end": "2026-12-31"}, "amountInCents": 29900},
                        ],
                    },
                    "waiveEarlyCheckIn": False,
                    "waiveLateCheckOut": False,
                    "waiveParkingFee": True,
                    "waiveCleaningFee": False,
                    "waiveResortFee": False,
                    "taxExempt": False,
                },
            },
        ],
        "eventCode": {
            "code": "ACME-2026",
            "accountName": "Acme Corporation",
            "salesManager": "Sarah Chen",
        },
    },
    {
        "id": "rp-002",
        "planId": "rp-002",
        "name": "Group - Guttmacher Board 2026",
        "code": "GRP-GUTT26",
        "rateCode": "GUTT26",
        "planType": "Group Negotiated",
        "category": "negotiated",
        "propertyId": "prop-70pine",
        "description": "Group negotiated rate for Guttmacher Institute board meeting, Sep 2026.",
        "cancellationPolicy": "cp-group-standard",
        "bookingBehaviorProfileId": "bbp-group-deposit",
        "marketSegmentation": {
            "category": "Group",
            "segment": "Association/Convention",
            "subSegment": "Negotiated",
        },
        "applicabilityConfiguration": {
            "effectiveDateRange": {"start": "2026-09-10", "end": "2026-09-15"},
            "applicableDateRange": {"start": "2026-09-07", "end": "2026-09-18"},
            "reservationSource": ["direct"],
            "appliesToAllCurrentAndFutureRoomTypes": False,
            "blockedDateRanges": [],
            "blockedDaysOfWeek": [],
        },
        "roomTypeGroups": [
            {
                "roomTypes": ["6437a1b2c3d4e5f6a7b8c9d0"],
                "roomTypeNames": ["Studio"],
                "actions": {
                    "rateModifierLevel": "universal",
                    "rateModifier": {"type": "set", "amountInCents": 22500},
                    "waiveEarlyCheckIn": False,
                    "waiveLateCheckOut": True,
                    "waiveParkingFee": True,
                    "waiveCleaningFee": False,
                    "waiveResortFee": False,
                    "taxExempt": False,
                },
            },
        ],
        "eventCode": {
            "code": "GUTT-SEP26",
            "accountName": "Guttmacher Institute",
            "salesManager": "Sarah Chen",
        },
    },
]


@router.get("/properties")
async def get_properties():
    return {"data": PROPERTIES}


@router.get("/cancellation-policies")
async def get_cancellation_policies():
    return {"data": CANCELLATION_POLICIES}


@router.get("/booking-behavior-profiles")
async def get_booking_behavior_profiles():
    return {"data": BOOKING_BEHAVIOR_PROFILES}


@router.get("/rate-plans")
async def get_existing_rate_plans():
    return {"data": EXISTING_RATE_PLANS}


@router.get("/rate-plans/{plan_id}")
async def get_rate_plan(plan_id: str):
    for rp in EXISTING_RATE_PLANS:
        if rp["id"] == plan_id:
            return {"data": rp}
    return {"error": "Rate plan not found"}, 404
