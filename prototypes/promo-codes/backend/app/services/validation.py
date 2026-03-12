"""
Waterfall validation engine for promo codes.

Aligned with V1 product spec section 5.1 FR6:
  1. Code exists?
  2. Code active?
  3. Date range? (valid_from / valid_until)
  4. Property match?
  5. Min nights? (retained from hackathon — pending spec update)
  6. Max nights? (retained from hackathon — pending spec update)
  7. Rate plan stacking? (all / none / allowlist / blocklist)
  8. Global usage limit? (max_uses)
  9. Per-guest usage limit? (max_uses_per_guest)
  10. Min booking amount?
  11. Success — return discount details with calculated amount
"""

import json
from datetime import datetime
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import PromoCode, PromoCodeUsage, RatePlanPromoPolicy
from app.schemas import ValidateRequest, ValidateResponse


def _calculate_nights(check_in: str, check_out: str) -> Optional[int]:
    """Calculate number of nights from YYYY-MM-DD date strings."""
    try:
        ci = datetime.strptime(check_in, "%Y-%m-%d")
        co = datetime.strptime(check_out, "%Y-%m-%d")
        delta = (co - ci).days
        return delta if delta > 0 else None
    except (ValueError, TypeError):
        return None


def _calculate_discount(promo: PromoCode, booking_amount: float) -> float:
    """Calculate the actual discount amount, capping fixed_amount at booking total."""
    if promo.discount_type == "percentage":
        return booking_amount * (promo.discount_value / 100)
    else:  # fixed_amount
        return min(promo.discount_value, booking_amount)


def validate_promo_code(request: ValidateRequest, db: Session) -> ValidateResponse:
    """
    Waterfall validation. Returns on first failure.

    Steps 1-10 per product spec + retained min/max nights from hackathon.
    """

    # Step 1: Code exists?
    promo = db.query(PromoCode).filter(
        func.upper(PromoCode.code) == request.code.strip().upper()
    ).first()
    if not promo:
        return ValidateResponse(valid=False, message="Invalid promo code")

    # Step 2: Code active?
    if promo.status != "active":
        return ValidateResponse(valid=False, message="This promo code is no longer active")

    # Step 3: Date range valid? (valid_from / valid_until)
    now = datetime.utcnow()
    if promo.valid_until and now > promo.valid_until:
        return ValidateResponse(valid=False, message="This promo code has expired")
    if promo.valid_from and now < promo.valid_from:
        return ValidateResponse(valid=False, message="This promo code is not yet valid")

    # Step 4: Property match?
    prop_ids = json.loads(promo.property_ids) if promo.property_ids else []
    if prop_ids and request.property_id not in prop_ids:
        return ValidateResponse(valid=False, message="This promo code is not valid for this property")

    # Step 5: Min nights? (retained from hackathon)
    if promo.min_nights is not None and request.check_in_date and request.check_out_date:
        nights = _calculate_nights(request.check_in_date, request.check_out_date)
        if nights is not None and nights < promo.min_nights:
            return ValidateResponse(
                valid=False,
                message=f"Minimum stay of {promo.min_nights} night{'s' if promo.min_nights > 1 else ''} required",
            )

    # Step 6: Max nights? (retained from hackathon)
    if promo.max_nights is not None and request.check_in_date and request.check_out_date:
        nights = _calculate_nights(request.check_in_date, request.check_out_date)
        if nights is not None and nights > promo.max_nights:
            return ValidateResponse(
                valid=False,
                message=f"Maximum stay of {promo.max_nights} night{'s' if promo.max_nights > 1 else ''} allowed",
            )

    # Step 7: Rate plan stacking? (all / none / allowlist / blocklist)
    if request.rate_plan_id:
        policy = db.query(RatePlanPromoPolicy).filter(
            RatePlanPromoPolicy.rate_plan_id == request.rate_plan_id
        ).first()
        if policy:
            if policy.promo_code_policy == "none":
                return ValidateResponse(
                    valid=False,
                    message="This promo code is not valid with your selected rate",
                )
            elif policy.promo_code_policy == "allowlist":
                allowed_ids = json.loads(policy.promo_code_ids) if policy.promo_code_ids else []
                if promo.id not in allowed_ids:
                    return ValidateResponse(
                        valid=False,
                        message="This promo code is not valid with your selected rate",
                    )
            elif policy.promo_code_policy == "blocklist":
                blocked_ids = json.loads(policy.promo_code_ids) if policy.promo_code_ids else []
                if promo.id in blocked_ids:
                    return ValidateResponse(
                        valid=False,
                        message="This promo code is not valid with your selected rate",
                    )
            # policy == "all" → allow everything, no check needed

    # Step 8: Global usage limit?
    if promo.max_uses is not None and promo.current_uses >= promo.max_uses:
        return ValidateResponse(valid=False, message="This promo code has reached its usage limit")

    # Step 9: Per-guest usage limit?
    if promo.max_uses_per_guest is not None and request.guest_id:
        guest_usage_count = db.query(PromoCodeUsage).filter(
            PromoCodeUsage.promo_code_id == promo.id,
            PromoCodeUsage.guest_id == request.guest_id,
        ).count()
        if guest_usage_count >= promo.max_uses_per_guest:
            return ValidateResponse(
                valid=False,
                message="You've already used this code the maximum number of times",
            )

    # Step 10: Min booking amount?
    if promo.min_booking_amount is not None and request.booking_amount < promo.min_booking_amount:
        return ValidateResponse(
            valid=False,
            message=f"Minimum booking of ${promo.min_booking_amount:.0f} required",
        )

    # Step 11: Success — return discount details
    calculated = _calculate_discount(promo, request.booking_amount)
    return ValidateResponse(
        valid=True,
        discount_type=promo.discount_type,
        discount_value=promo.discount_value,
        calculated_discount=round(calculated, 2),
        name=promo.name,
        message="Promo code applied successfully",
    )
