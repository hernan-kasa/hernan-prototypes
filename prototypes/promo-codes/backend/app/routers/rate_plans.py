"""
Rate plan promo policy endpoints.

V1 product spec stacking model:
  promo_code_policy: all | none | allowlist | blocklist
  promo_code_ids: string[] (promo code IDs, used for allowlist/blocklist)

Responses follow JSON:API format (kontrol-api pattern).
"""

import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import RatePlanPromoPolicy
from app.schemas import (
    RatePlanPromoPolicyAttributes,
    RatePlanPromoPolicyResource,
    RatePlanPromoPolicyResponse,
    RatePlanPromoPolicyUpdate,
)

router = APIRouter(prefix="/rate-plans", tags=["rate-plans"])


def _to_resource(policy: RatePlanPromoPolicy) -> RatePlanPromoPolicyResource:
    """Map ORM model to JSON:API resource."""
    return RatePlanPromoPolicyResource(
        id=policy.rate_plan_id,
        type="rate-plan-promo-policy",
        attributes=RatePlanPromoPolicyAttributes.model_validate(policy),
    )


def _default_resource(rate_plan_id: str) -> RatePlanPromoPolicyResource:
    """Default policy: all promo codes allowed (spec FR3 default)."""
    return RatePlanPromoPolicyResource(
        id=rate_plan_id,
        type="rate-plan-promo-policy",
        attributes=RatePlanPromoPolicyAttributes(
            rate_plan_id=rate_plan_id,
            promo_code_policy="all",
            promo_code_ids=[],
        ),
    )


@router.get("/{rate_plan_id}/promo-policy", response_model=RatePlanPromoPolicyResponse)
def get_promo_policy(rate_plan_id: str, db: Session = Depends(get_db)):
    policy = db.query(RatePlanPromoPolicy).filter(
        RatePlanPromoPolicy.rate_plan_id == rate_plan_id
    ).first()

    if not policy:
        return RatePlanPromoPolicyResponse(data=_default_resource(rate_plan_id))

    return RatePlanPromoPolicyResponse(data=_to_resource(policy))


@router.put("/{rate_plan_id}/promo-policy", response_model=RatePlanPromoPolicyResponse)
def set_promo_policy(
    rate_plan_id: str,
    data: RatePlanPromoPolicyUpdate,
    db: Session = Depends(get_db),
):
    policy = db.query(RatePlanPromoPolicy).filter(
        RatePlanPromoPolicy.rate_plan_id == rate_plan_id
    ).first()

    # Clear code list when policy is "all" or "none"
    code_ids = [] if data.promo_code_policy in ("all", "none") else data.promo_code_ids

    if policy:
        policy.promo_code_policy = data.promo_code_policy
        policy.promo_code_ids = json.dumps(code_ids)
    else:
        policy = RatePlanPromoPolicy(
            rate_plan_id=rate_plan_id,
            promo_code_policy=data.promo_code_policy,
            promo_code_ids=json.dumps(code_ids),
        )
        db.add(policy)

    db.commit()
    db.refresh(policy)
    return RatePlanPromoPolicyResponse(data=_to_resource(policy))
