import json
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text

from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class PromoCode(Base):
    """
    Promo code model — aligned with V1 product spec.

    Fields per spec section 7 (Data Model):
        id, code, name, category, discount_type, discount_value, status,
        property_ids, valid_from, valid_until, max_uses, max_uses_per_guest,
        current_uses, min_booking_amount, created_at, updated_at

    Additional fields retained from hackathon (pending spec update):
        min_nights, max_nights
    """

    __tablename__ = "promo_codes"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, default="general")
    discount_type = Column(String(20), nullable=False)  # "percentage" or "fixed_amount"
    discount_value = Column(Float, nullable=False)
    status = Column(String(20), nullable=False, default="active")  # "active" or "inactive"
    property_ids = Column(Text, nullable=False, default="[]")  # JSON array of property ID strings
    valid_from = Column(DateTime, nullable=True)  # null = always valid
    valid_until = Column(DateTime, nullable=True)  # null = no expiration
    max_uses = Column(Integer, nullable=True)  # null = unlimited (global cap)
    max_uses_per_guest = Column(Integer, nullable=True)  # null = unlimited per guest
    current_uses = Column(Integer, nullable=False, default=0)
    min_booking_amount = Column(Float, nullable=True)
    min_nights = Column(Integer, nullable=True)  # retained from hackathon — pending spec update
    max_nights = Column(Integer, nullable=True)  # retained from hackathon — pending spec update
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def property_ids_list(self) -> list[str]:
        return json.loads(self.property_ids) if self.property_ids else []


class RatePlanPromoPolicy(Base):
    """
    Rate plan promo code stacking policy — aligned with V1 product spec.

    Spec section 5.1 FR3:
        promo_code_policy: all | none | allowlist | blocklist
        promo_code_ids: UUID[] (used when policy is allowlist or blocklist)
        Default policy for new rate plans = "all"
    """

    __tablename__ = "rate_plan_promo_policies"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    rate_plan_id = Column(String(50), unique=True, index=True, nullable=False)
    promo_code_policy = Column(String(20), nullable=False, default="all")  # all | none | allowlist | blocklist
    promo_code_ids = Column(Text, nullable=False, default="[]")  # JSON array of promo code IDs

    @property
    def promo_code_ids_list(self) -> list[str]:
        return json.loads(self.promo_code_ids) if self.promo_code_ids else []


class PromoCodeUsage(Base):
    """
    Promo code usage tracking — aligned with V1 product spec.

    Spec section 5.1 FR4:
        id, promo_code_id, reservation_id, guest_id,
        applied_discount, applied_at
    """

    __tablename__ = "promo_code_usages"

    id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    promo_code_id = Column(String(36), nullable=False, index=True)
    reservation_id = Column(String(100), nullable=True)  # FK to reservation (nullable for demo)
    guest_id = Column(String(200), nullable=True)  # email, profile ID, or Kontrol customer ID
    applied_discount = Column(Float, nullable=False)  # actual discount amount applied
    applied_at = Column(DateTime, nullable=False, default=datetime.utcnow)
