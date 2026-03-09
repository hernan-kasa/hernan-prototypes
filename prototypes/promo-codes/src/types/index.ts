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

// --- Promo Code (aligned with price-api Coupon schema) ---

export interface PromoCodeAttributes {
  code: string;
  name: string;
  discount_type: "PERCENTAGE" | "FIXED"; // price-api CouponType enum
  discount_value: number;
  is_active: boolean; // price-api: isActive
  property_ids: string[];
  valid_after: string | null; // price-api: validAfter
  valid_before: string | null; // price-api: validBefore
  max_uses: number | null;
  current_uses: number;
  min_booking_amount: number | null;
  min_nights: number | null; // price-api: minNights
  max_nights: number | null; // price-api: maxNights
  channel: string;
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
  check_in_date?: string; // YYYY-MM-DD
  check_out_date?: string; // YYYY-MM-DD
}

export interface ValidateResponse {
  valid: boolean;
  discount_type?: string;
  discount_value?: number;
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

// --- Rate Plan Policy (aligned with price-api/rate-service) ---

export interface RatePlanPromoPolicyAttributes {
  rate_plan_id: string;
  disallow_all_promo_codes: boolean; // price-api: disallowAllPromoCodes
  promo_codes_to_disallow: string[]; // price-api: promoCodesToDisallow (code strings)
}

export interface RatePlanPromoPolicy extends RatePlanPromoPolicyAttributes {
  id: string;
}
