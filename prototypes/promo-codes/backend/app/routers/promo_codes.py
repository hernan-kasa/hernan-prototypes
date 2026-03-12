"""
Promo code CRUD, validation, and usage endpoints.

Responses follow JSON:API format (matching kontrol-api patterns):
  { data: { id, type, attributes } }
"""

import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import PromoCode, PromoCodeUsage
from app.schemas import (
    PromoCodeAttributes,
    PromoCodeCreate,
    PromoCodeListResponse,
    PromoCodeResource,
    PromoCodeResponse,
    PromoCodeUpdate,
    PromoCodeUsageAttributes,
    PromoCodeUsageResource,
    PromoCodeUsageResponse,
    RecordUsageRequest,
    StatusUpdate,
    ValidateRequest,
    ValidateResponse,
)
from app.services.validation import validate_promo_code

router = APIRouter(prefix="/promo-codes", tags=["promo-codes"])


def _to_resource(promo: PromoCode) -> PromoCodeResource:
    """Map ORM model to JSON:API resource (kontrol-api mapper pattern)."""
    return PromoCodeResource(
        id=str(promo.id),
        type="promo-code",
        attributes=PromoCodeAttributes.model_validate(promo),
    )


# --- Static routes MUST come before /{id} ---


@router.post("/validate", response_model=ValidateResponse)
def validate_code(request: ValidateRequest, db: Session = Depends(get_db)):
    return validate_promo_code(request, db)


@router.post("/record-usage", response_model=PromoCodeUsageResponse, status_code=201)
def record_usage(request: RecordUsageRequest, db: Session = Depends(get_db)):
    """Record a promo code usage after booking confirmation (atomic increment)."""
    promo = db.query(PromoCode).filter(
        func.upper(PromoCode.code) == request.code.strip().upper()
    ).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")

    # Atomic increment of current_uses
    db.query(PromoCode).filter(
        PromoCode.id == promo.id
    ).update(
        {PromoCode.current_uses: PromoCode.current_uses + 1},
        synchronize_session="fetch",
    )

    usage = PromoCodeUsage(
        promo_code_id=promo.id,
        reservation_id=request.reservation_id,
        guest_id=request.guest_id,
        applied_discount=request.applied_discount,
    )
    db.add(usage)
    db.commit()
    db.refresh(usage)

    return PromoCodeUsageResponse(
        data=PromoCodeUsageResource(
            id=str(usage.id),
            type="promo-code-usage",
            attributes=PromoCodeUsageAttributes.model_validate(usage),
        )
    )


@router.get("/property/{property_id}", response_model=PromoCodeListResponse)
def list_codes_for_property(property_id: str, db: Session = Depends(get_db)):
    """List active promo codes valid for a given property."""
    codes = db.query(PromoCode).filter(
        PromoCode.status == "active",
        or_(
            PromoCode.property_ids == "[]",  # empty = all properties
            PromoCode.property_ids.like(f'%"{property_id}"%'),
        ),
    ).all()
    return PromoCodeListResponse(
        data=[_to_resource(c) for c in codes],
        meta={"total": len(codes)},
    )


# --- Parameterized routes ---


@router.get("", response_model=PromoCodeListResponse)
def list_promo_codes(
    status: Optional[str] = Query(None, description="Filter by status: active or inactive"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by code or name"),
    db: Session = Depends(get_db),
):
    query = db.query(PromoCode)
    if status:
        query = query.filter(PromoCode.status == status)
    if category:
        query = query.filter(PromoCode.category == category)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                PromoCode.code.ilike(search_term),
                PromoCode.name.ilike(search_term),
            )
        )
    codes = query.order_by(PromoCode.created_at.desc()).all()
    return PromoCodeListResponse(
        data=[_to_resource(c) for c in codes],
        meta={"total": len(codes)},
    )


@router.get("/{promo_id}", response_model=PromoCodeResponse)
def get_promo_code(promo_id: str, db: Session = Depends(get_db)):
    promo = db.query(PromoCode).filter(PromoCode.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")
    return PromoCodeResponse(data=_to_resource(promo))


@router.post("", response_model=PromoCodeResponse, status_code=201)
def create_promo_code(data: PromoCodeCreate, db: Session = Depends(get_db)):
    # Check uniqueness
    existing = db.query(PromoCode).filter(
        func.upper(PromoCode.code) == data.code.upper()
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="A promo code with this code already exists")

    promo = PromoCode(
        code=data.code,
        name=data.name,
        category=data.category,
        discount_type=data.discount_type,
        discount_value=data.discount_value,
        property_ids=json.dumps(data.property_ids),
        valid_from=data.valid_from,
        valid_until=data.valid_until,
        max_uses=data.max_uses,
        max_uses_per_guest=data.max_uses_per_guest,
        min_booking_amount=data.min_booking_amount,
        min_nights=data.min_nights,
        max_nights=data.max_nights,
    )
    db.add(promo)
    db.commit()
    db.refresh(promo)
    return PromoCodeResponse(data=_to_resource(promo))


@router.put("/{promo_id}", response_model=PromoCodeResponse)
def update_promo_code(promo_id: str, data: PromoCodeUpdate, db: Session = Depends(get_db)):
    promo = db.query(PromoCode).filter(PromoCode.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")

    update_data = data.model_dump(exclude_unset=True)

    # If code is being changed, check uniqueness
    if "code" in update_data:
        existing = db.query(PromoCode).filter(
            func.upper(PromoCode.code) == update_data["code"].upper(),
            PromoCode.id != promo_id,
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="A promo code with this code already exists")

    # Serialize property_ids to JSON
    if "property_ids" in update_data:
        update_data["property_ids"] = json.dumps(update_data["property_ids"])

    for field, value in update_data.items():
        setattr(promo, field, value)

    promo.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(promo)
    return PromoCodeResponse(data=_to_resource(promo))


@router.patch("/{promo_id}/status", response_model=PromoCodeResponse)
def toggle_status(promo_id: str, data: StatusUpdate, db: Session = Depends(get_db)):
    promo = db.query(PromoCode).filter(PromoCode.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")

    promo.status = data.status
    promo.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(promo)
    return PromoCodeResponse(data=_to_resource(promo))
