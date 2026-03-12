// --- JSON:API envelope types (matching kontrol-api patterns) ---

export interface JsonApiResource<T> {
  id: string;
  type: string;
  attributes: T;
}

export interface JsonApiResponse<T> {
  data: JsonApiResource<T>;
}

export interface JsonApiListResponse<T> {
  data: JsonApiResource<T>[];
  meta?: Record<string, unknown>;
}

// --- Promo Code (aligned with V1 product spec) ---

export interface PromoCodeAttributes {
  code: string;
  name: string;
  category: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  status: "active" | "inactive";
  property_ids: string[];
  valid_from: string | null;
  valid_until: string | null;
  max_uses: number | null;
  max_uses_per_guest: number | null;
  current_uses: number;
  min_booking_amount: number | null;
  min_nights: number | null;
  max_nights: number | null;
  created_at: string;
  updated_at: string;
}

/** Flattened promo code for component convenience */
export interface PromoCode extends PromoCodeAttributes {
  id: string;
}

// --- Validation ---

export interface ValidateRequest {
  code: string;
  property_id: string;
  rate_plan_id?: string;
  booking_amount: number;
  guest_id?: string;
  check_in_date?: string; // YYYY-MM-DD
  check_out_date?: string; // YYYY-MM-DD
}

export interface ValidateResponse {
  valid: boolean;
  discount_type?: string;
  discount_value?: number;
  calculated_discount?: number;
  name?: string;
  message?: string;
}

// --- Reference data (properties, rate plans) ---

export interface Property {
  id: string;
  name: string;
}

export interface RatePlan {
  id: string;
  code: string;
  name: string;
  description: string;
  cancellation_policy: string;
  market_segment: string;
  booking_type: string;
}

// --- Rate Plan Policy (V1 product spec stacking model) ---

export interface RatePlanPromoPolicyAttributes {
  rate_plan_id: string;
  promo_code_policy: "all" | "none" | "allowlist" | "blocklist";
  promo_code_ids: string[]; // promo code UUIDs for allowlist/blocklist
}

export interface RatePlanPromoPolicy extends RatePlanPromoPolicyAttributes {
  id: string;
}
