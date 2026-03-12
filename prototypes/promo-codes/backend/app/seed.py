"""Seed script: creates tables and inserts demo data. Run with: python -m app.seed"""

import json
from datetime import datetime

from app.database import Base, SessionLocal, engine
from app.models import PromoCode, PromoCodeUsage, RatePlanPromoPolicy

# Mock reference data (served via API, not stored in DB)
SAMPLE_PROPERTIES = [
    {"id": "prop-001", "name": "Kasa Downtown LA"},
    {"id": "prop-002", "name": "Kasa San Francisco Marina"},
    {"id": "prop-003", "name": "Kasa Austin South Congress"},
    {"id": "prop-004", "name": "Kasa Denver Union Station"},
    {"id": "prop-005", "name": "Kasa Nashville Midtown"},
]

SAMPLE_RATE_PLANS = [
    {
        "id": "rp-001",
        "code": "BAR",
        "name": "Best Available Rate",
        "description": "Standard flexible rate with full cancellation policy",
        "cancellation_policy": "Flexible",
        "market_segment": "Transient",
        "booking_type": "Direct",
    },
    {
        "id": "rp-002",
        "code": "NRF",
        "name": "Non-Refundable Rate",
        "description": "Discounted rate with no cancellation or modification allowed",
        "cancellation_policy": "Non-Refundable",
        "market_segment": "Transient",
        "booking_type": "Direct",
    },
    {
        "id": "rp-004",
        "code": "CORP",
        "name": "Corporate Rate",
        "description": "Negotiated rate for corporate partners with flexible terms",
        "cancellation_policy": "Flexible",
        "market_segment": "Corporate",
        "booking_type": "Direct",
    },
    {
        "id": "rp-007",
        "code": "GROUP",
        "name": "Group Rate",
        "description": "Special pricing for group bookings of 5+ rooms",
        "cancellation_policy": "Strict",
        "market_segment": "Group",
        "booking_type": "Direct",
    },
]

SAMPLE_PROMO_CODES = [
    {
        "id": "pc-001",
        "code": "SUMMER25",
        "name": "Summer 2026 - 25% Off",
        "category": "seasonal",
        "discount_type": "percentage",
        "discount_value": 25.0,
        "status": "active",
        "property_ids": ["prop-001", "prop-002", "prop-003"],
        "valid_from": datetime(2026, 1, 1),
        "valid_until": datetime(2026, 9, 30, 23, 59, 59),
        "max_uses": 100,
        "max_uses_per_guest": 2,
        "current_uses": 42,
        "min_booking_amount": 200.0,
        "min_nights": 2,
        "max_nights": None,
    },
    {
        "id": "pc-002",
        "code": "WELCOME50",
        "name": "New Guest $50 Off",
        "category": "acquisition",
        "discount_type": "fixed_amount",
        "discount_value": 50.0,
        "status": "active",
        "property_ids": [],  # all properties
        "valid_from": datetime(2025, 1, 1),
        "valid_until": datetime(2026, 12, 31, 23, 59, 59),
        "max_uses": None,
        "max_uses_per_guest": 1,
        "current_uses": 215,
        "min_booking_amount": 150.0,
        "min_nights": None,
        "max_nights": None,
    },
    {
        "id": "pc-003",
        "code": "FLASHSALE",
        "name": "Flash Sale 15% Off",
        "category": "campaign",
        "discount_type": "percentage",
        "discount_value": 15.0,
        "status": "active",
        "property_ids": ["prop-001"],
        "valid_from": datetime(2026, 2, 10),
        "valid_until": datetime(2026, 4, 30, 23, 59, 59),
        "max_uses": 50,
        "max_uses_per_guest": None,
        "current_uses": 48,
        "min_booking_amount": None,
        "min_nights": None,
        "max_nights": 7,
    },
    {
        "id": "pc-004",
        "code": "EXPIRED10",
        "name": "Old Promo - Expired",
        "category": "general",
        "discount_type": "percentage",
        "discount_value": 10.0,
        "status": "active",
        "property_ids": [],
        "valid_from": datetime(2024, 1, 1),
        "valid_until": datetime(2024, 6, 30, 23, 59, 59),
        "max_uses": 500,
        "max_uses_per_guest": None,
        "current_uses": 312,
        "min_booking_amount": None,
        "min_nights": None,
        "max_nights": None,
    },
    {
        "id": "pc-005",
        "code": "DISABLED20",
        "name": "Deactivated Promo",
        "category": "general",
        "discount_type": "fixed_amount",
        "discount_value": 20.0,
        "status": "inactive",
        "property_ids": [],
        "valid_from": datetime(2025, 1, 1),
        "valid_until": datetime(2026, 12, 31, 23, 59, 59),
        "max_uses": None,
        "max_uses_per_guest": None,
        "current_uses": 0,
        "min_booking_amount": None,
        "min_nights": None,
        "max_nights": None,
    },
    {
        "id": "pc-006",
        "code": "LAUNCH500",
        "name": "Nashville Launch $500 Off",
        "category": "launch",
        "discount_type": "fixed_amount",
        "discount_value": 500.0,
        "status": "active",
        "property_ids": ["prop-005"],
        "valid_from": datetime(2026, 3, 1),
        "valid_until": datetime(2026, 6, 30, 23, 59, 59),
        "max_uses": 10,
        "max_uses_per_guest": 1,
        "current_uses": 2,
        "min_booking_amount": None,
        "min_nights": None,
        "max_nights": None,
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if data already exists
        if db.query(PromoCode).count() > 0:
            print("Database already seeded. Skipping.")
            return

        # Insert promo codes
        for data in SAMPLE_PROMO_CODES:
            promo = PromoCode(
                id=data["id"],
                code=data["code"],
                name=data["name"],
                category=data["category"],
                discount_type=data["discount_type"],
                discount_value=data["discount_value"],
                status=data["status"],
                property_ids=json.dumps(data["property_ids"]),
                valid_from=data["valid_from"],
                valid_until=data["valid_until"],
                max_uses=data["max_uses"],
                max_uses_per_guest=data["max_uses_per_guest"],
                current_uses=data["current_uses"],
                min_booking_amount=data.get("min_booking_amount"),
                min_nights=data.get("min_nights"),
                max_nights=data.get("max_nights"),
            )
            db.add(promo)

        db.flush()

        # Rate plan policies (V1 spec: all/none/allowlist/blocklist)
        # Corporate rate: blocklist — blocks SUMMER25 and FLASHSALE
        db.add(RatePlanPromoPolicy(
            rate_plan_id="rp-004",
            promo_code_policy="blocklist",
            promo_code_ids=json.dumps(["pc-001", "pc-003"]),  # SUMMER25, FLASHSALE
        ))
        # Group rate: none — no promo codes allowed
        db.add(RatePlanPromoPolicy(
            rate_plan_id="rp-007",
            promo_code_policy="none",
            promo_code_ids=json.dumps([]),
        ))

        # Sample usage records
        db.add(PromoCodeUsage(
            promo_code_id="pc-002",
            reservation_id="res-demo-001",
            guest_id="guest@example.com",
            applied_discount=50.0,
        ))

        db.commit()
        print("Database seeded successfully!")
        print(f"  - {len(SAMPLE_PROMO_CODES)} promo codes")
        print(f"  - 2 rate plan policies")
        print(f"  - 1 sample usage record")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
