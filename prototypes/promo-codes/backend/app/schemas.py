"""
Pydantic schemas — aligned with V1 product spec.

Discount types: "percentage" | "fixed_amount"
Status: "active" | "inactive"
Stacking policy: "all" | "none" | "allowlist" | "blocklist"
"""

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, field_validator


# --- Promo Code Schemas ---


class PromoCodeCreate(BaseModel):
    code: str
    name: str
    category: str = "general"
    discount_type: Literal["percentage", "fixed_amount"]
    discount_value: float
    property_ids: list[str] = []
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    max_uses: Optional[int] = None
    max_uses_per_guest: Optional[int] = None
    min_booking_amount: Optional[float] = None
    min_nights: Optional[int] = None
    max_nights: Optional[int] = None

    @field_validator("code")
    @classmethod
    def uppercase_code(cls, v: str) -> str:
        return v.strip().upper()


class PromoCodeUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    category: Optional[str] = None
    discount_type: Optional[Literal["percentage", "fixed_amount"]] = None
    discount_value: Optional[float] = None
    property_ids: Optional[list[str]] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    max_uses: Optional[int] = None
    max_uses_per_guest: Optional[int] = None
    min_booking_amount: Optional[float] = None
    min_nights: Optional[int] = None
    max_nights: Optional[int] = None

    @field_validator("code")
    @classmethod
    def uppercase_code(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return v.strip().upper()
        return v


class PromoCodeAttributes(BaseModel):
    """JSON:API attributes for a promo code."""

    model_config = ConfigDict(from_attributes=True)

    code: str
    name: str
    category: str
    discount_type: str
    discount_value: float
    status: str
    property_ids: list[str]
    valid_from: Optional[datetime]
    valid_until: Optional[datetime]
    max_uses: Optional[int]
    max_uses_per_guest: Optional[int]
    current_uses: int
    min_booking_amount: Optional[float]
    min_nights: Optional[int]
    max_nights: Optional[int]
    created_at: datetime
    updated_at: datetime

    @field_validator("property_ids", mode="before")
    @classmethod
    def parse_property_ids(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            import json

            return json.loads(v)
        return v


class PromoCodeResource(BaseModel):
    """JSON:API single resource envelope."""

    id: str
    type: str = "promo-code"
    attributes: PromoCodeAttributes


class PromoCodeResponse(BaseModel):
    """JSON:API single resource response."""

    data: PromoCodeResource


class PromoCodeListResponse(BaseModel):
    """JSON:API list response."""

    data: list[PromoCodeResource]
    meta: dict = {}


class StatusUpdate(BaseModel):
    status: Literal["active", "inactive"]


# --- Validation Schemas ---


class ValidateRequest(BaseModel):
    code: str
    property_id: str
    rate_plan_id: Optional[str] = None
    booking_amount: float
    guest_id: Optional[str] = None
    check_in_date: Optional[str] = None  # YYYY-MM-DD
    check_out_date: Optional[str] = None  # YYYY-MM-DD


class ValidateResponse(BaseModel):
    valid: bool
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    calculated_discount: Optional[float] = None  # actual dollar amount of discount
    name: Optional[str] = None
    message: Optional[str] = None


# --- Rate Plan Policy Schemas ---


class RatePlanPromoPolicyUpdate(BaseModel):
    """
    V1 product spec stacking model:
        promo_code_policy: all | none | allowlist | blocklist
        promo_code_ids: string[] (promo code IDs for allowlist/blocklist)
    """

    promo_code_policy: Literal["all", "none", "allowlist", "blocklist"] = "all"
    promo_code_ids: list[str] = []


class RatePlanPromoPolicyAttributes(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rate_plan_id: str
    promo_code_policy: str
    promo_code_ids: list[str]

    @field_validator("promo_code_ids", mode="before")
    @classmethod
    def parse_ids(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            import json

            return json.loads(v)
        return v


class RatePlanPromoPolicyResource(BaseModel):
    id: str
    type: str = "rate-plan-promo-policy"
    attributes: RatePlanPromoPolicyAttributes


class RatePlanPromoPolicyResponse(BaseModel):
    data: RatePlanPromoPolicyResource


# --- Usage Schemas ---


class RecordUsageRequest(BaseModel):
    code: str
    reservation_id: Optional[str] = None
    guest_id: Optional[str] = None
    applied_discount: float


class PromoCodeUsageAttributes(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    promo_code_id: str
    reservation_id: Optional[str]
    guest_id: Optional[str]
    applied_discount: float
    applied_at: datetime


class PromoCodeUsageResource(BaseModel):
    id: str
    type: str = "promo-code-usage"
    attributes: PromoCodeUsageAttributes


class PromoCodeUsageResponse(BaseModel):
    data: PromoCodeUsageResource
