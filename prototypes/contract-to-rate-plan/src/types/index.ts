// --- Lookup types ---

export interface RoomType {
  id: string;
  name: string;
  code: string;
}

export interface Property {
  id: string;
  name: string;
  room_types: RoomType[];
}

export interface CancellationPolicy {
  id: string;
  name: string;
  code: string;
}

export interface BookingBehaviorProfile {
  id: string;
  name: string;
  description: string;
}

// --- Extraction types (from Claude API) ---

export interface DateRange {
  start: string;
  end: string;
}

export interface ContactInfo {
  name: string;
  phone: string | null;
  email: string | null;
}

export interface SeasonalRate {
  date_range: DateRange;
  room_type: string; // raw name from contract
  rate: number;
}

export interface RoomBlock {
  room_type: string;
  date: string;
  count: number;
  rate: number;
}

export interface BarDiscount {
  pct: number;
  period: DateRange;
}

export interface BlackoutDate {
  event_name: string;
  date_range: DateRange;
}

export interface CancellationTier {
  days_range: string;
  pct_of_revenue: number;
}

export interface CancellationExtracted {
  type: "standard_24hr" | "tiered_scale";
  tiers?: CancellationTier[];
}

export interface CommissionExtracted {
  commissionable: boolean;
  pct?: number;
}

export interface DepositTier {
  type: string;
  due_date_description: string;
  amount_or_pct: string;
}

export interface Concession {
  description: string;
  maps_to_waiver: string | null;
}

export interface RoomNightCommitment {
  count: number;
  type: "estimate" | "minimum";
  pct_of_block?: number;
}

export type Confidence = "high" | "medium" | "low";

export interface ContractExtraction {
  contract_type: "corporate" | "group";
  rate_type: "fixed_seasonal" | "bar_discount" | "group_block";
  client_name: string;
  client_contact: ContactInfo | null;
  property_contact: ContactInfo | null;
  valid_dates: DateRange;
  seasonal_rates: SeasonalRate[] | null;
  bar_discount: BarDiscount | null;
  room_block: RoomBlock[] | null;
  total_room_nights: number | null;
  total_anticipated_revenue: number | null;
  blackout_dates: BlackoutDate[];
  last_room_availability: boolean | null;
  cut_off_date: string | null;
  cancellation: CancellationExtracted;
  commission: CommissionExtracted;
  deposit_schedule: DepositTier[] | null;
  concessions: Concession[];
  room_night_commitment: RoomNightCommitment | null;
  confidence: Record<string, Confidence>;
}

export interface ExtractionResponse {
  extraction: ContractExtraction;
  warnings: string[];
}

// --- Rate plan form types (maps to POST /api/rate-plans) ---

export interface RoomTypeMapping {
  contractName: string; // raw name from contract
  internalId: string | null; // mapped internal room type ID
  internalName: string | null; // mapped internal room type name
  confidence: Confidence;
}

export interface RateModifierSet {
  type: "set";
  amountInCents: number;
}

export interface RateModifierPercentage {
  type: "percentage";
  percentageAmount: number;
  modification: "decrease" | "increase";
}

export interface RateModifierNone {
  type: "none";
}

export type RateModifier = RateModifierSet | RateModifierPercentage | RateModifierNone;

export interface SeasonDefinition {
  dateRange: DateRange;
  amountInCents: number;
}

export interface RoomTypeGroupForm {
  roomTypes: string[]; // internal room type IDs
  roomTypeMappings: RoomTypeMapping[];
  rateModifierLevel: "universal" | "dayOfWeek" | "monthly" | "periodic";
  rateModifier: RateModifier;
  seasons?: SeasonDefinition[];
  waiveEarlyCheckIn: boolean;
  waiveLateCheckOut: boolean;
  waiveParkingFee: boolean;
  waiveCleaningFee: boolean;
  waiveResortFee: boolean;
  taxExempt: boolean;
  compedAddOns: string[];
}

export interface MarketSegmentation {
  category: string;
  segment: string;
  subSegment: string;
}

export interface EventCode {
  code: string;
  accountName: string;
  salesManager: string;
}

export interface LabeledDateRange extends DateRange {
  label?: string;
}

export interface RatePlanForm {
  // General Info
  name: string;
  description: string;
  code: string;
  rateCode: string;
  planType: "Corporate Negotiated" | "Group Negotiated";
  category: "negotiated";
  source: "internal";
  cancellationPolicyId: string;
  bookingBehaviorProfileId: string;
  reservationSource: string[];
  marketSegmentation: MarketSegmentation;
  eventCode: EventCode;

  // Price Modifiers (room type groups)
  appliesToAllCurrentAndFutureRoomTypes: boolean;
  roomTypeGroups: RoomTypeGroupForm[];

  // Availability
  effectiveDateRange: DateRange | null;
  applicableDateRange: DateRange | null;
  blockedDateRanges: LabeledDateRange[];
  blockedDaysOfWeek: string[];
  minimumNights: number | null;
  maximumNights: number | null;
  minimumLeadTimeHours: number | null;
  maximumLeadTimeHours: number | null;
}

// --- Diff types (for amendment mode) ---

export interface FieldDiff {
  field: string;
  label: string;
  oldValue: unknown;
  newValue: unknown;
  accepted: boolean;
}

// --- Existing rate plan (from GET /api/rate-plans) ---

export interface ExistingRatePlan {
  id: string;
  planId: string;
  name: string;
  code: string;
  rateCode: string;
  planType: string;
  category: string;
  propertyId: string;
  description: string;
  cancellationPolicy: string;
  bookingBehaviorProfileId: string;
  marketSegmentation: MarketSegmentation;
  applicabilityConfiguration: {
    effectiveDateRange: DateRange | null;
    applicableDateRange: DateRange | null;
    reservationSource: string[];
    appliesToAllCurrentAndFutureRoomTypes: boolean;
    blockedDateRanges: LabeledDateRange[];
    blockedDaysOfWeek: string[];
    minimumNights?: number;
    maximumNights?: number;
  };
  roomTypeGroups: {
    roomTypes: string[];
    roomTypeNames: string[];
    actions: Record<string, unknown>;
  }[];
  eventCode: EventCode;
}
