from pydantic import BaseModel
from typing import Optional


class DateRange(BaseModel):
    start: str
    end: str


class ContactInfo(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None


class SeasonalRate(BaseModel):
    date_range: DateRange
    room_type: str
    rate: float


class RoomBlock(BaseModel):
    room_type: str
    date: str
    count: int
    rate: float


class BarDiscount(BaseModel):
    pct: float
    period: DateRange


class BlackoutDate(BaseModel):
    event_name: str
    date_range: DateRange


class CancellationTier(BaseModel):
    days_range: str
    pct_of_revenue: float


class Cancellation(BaseModel):
    type: str  # "standard_24hr" | "tiered_scale"
    tiers: Optional[list[CancellationTier]] = None


class Commission(BaseModel):
    commissionable: bool
    pct: Optional[float] = None


class DepositTier(BaseModel):
    type: str
    due_date_description: str
    amount_or_pct: str


class RoomNightCommitment(BaseModel):
    count: int
    type: str  # "estimate" | "minimum"
    pct_of_block: Optional[float] = None


class Concession(BaseModel):
    description: str
    maps_to_waiver: Optional[str] = None  # e.g. "waiveEarlyCheckIn", "waiveParkingFee"


class ContractExtraction(BaseModel):
    # Detection
    contract_type: str  # "corporate" | "group"
    rate_type: str  # "fixed_seasonal" | "bar_discount" | "group_block"

    # Metadata
    client_name: str
    client_contact: Optional[ContactInfo] = None
    property_contact: Optional[ContactInfo] = None
    valid_dates: DateRange

    # Rate structure (polymorphic)
    seasonal_rates: Optional[list[SeasonalRate]] = None
    bar_discount: Optional[BarDiscount] = None
    room_block: Optional[list[RoomBlock]] = None
    total_room_nights: Optional[int] = None
    total_anticipated_revenue: Optional[float] = None

    # Restrictions
    blackout_dates: list[BlackoutDate] = []
    last_room_availability: Optional[bool] = None
    cut_off_date: Optional[str] = None

    # Cancellation
    cancellation: Cancellation

    # Payment
    commission: Commission
    deposit_schedule: Optional[list[DepositTier]] = None

    # Extras
    concessions: list[Concession] = []
    room_night_commitment: Optional[RoomNightCommitment] = None

    # Per-field confidence
    confidence: dict[str, str] = {}


class ExtractionResponse(BaseModel):
    extraction: ContractExtraction
    warnings: list[str] = []


class Property(BaseModel):
    id: str
    name: str
    room_types: list[dict]


class CancellationPolicy(BaseModel):
    id: str
    name: str
    code: str


class BookingBehaviorProfile(BaseModel):
    id: str
    name: str
    description: str
