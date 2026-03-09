import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import type {
  JsonApiListResponse,
  JsonApiResource,
  PromoCode,
  PromoCodeAttributes,
  Property,
  RatePlan,
  RatePlanPromoPolicy,
  RatePlanPromoPolicyAttributes,
  ValidateRequest,
  ValidateResponse,
} from "../types";

/** Unwrap a JSON:API resource into a flat object with id */
function unwrapPromoCode(
  resource: JsonApiResource<PromoCodeAttributes>
): PromoCode {
  return { id: resource.id, ...resource.attributes };
}

function unwrapPolicy(
  resource: JsonApiResource<RatePlanPromoPolicyAttributes>
): RatePlanPromoPolicy {
  return { id: resource.id, ...resource.attributes };
}

export function usePromoCodes(statusFilter?: string) {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    const res = await api.get<JsonApiListResponse<PromoCodeAttributes>>(
      "/promo-codes",
      { params }
    );
    setCodes(res.data.data.map(unwrapPromoCode));
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { codes, loading, refetch: fetch };
}

export function usePromoCode(id: string | null) {
  const [code, setCode] = useState<PromoCode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === null) return;
    setLoading(true);
    api
      .get<{ data: JsonApiResource<PromoCodeAttributes> }>(
        `/promo-codes/${id}`
      )
      .then((res) => {
        setCode(unwrapPromoCode(res.data.data));
        setLoading(false);
      });
  }, [id]);

  return { code, loading };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    api.get("/properties").then((res) => {
      // JSON:API format: unwrap { data: [{ id, type, attributes }] }
      const items = res.data.data.map(
        (r: JsonApiResource<{ name: string }>) => ({
          id: r.id,
          name: r.attributes.name,
        })
      );
      setProperties(items);
    });
  }, []);

  return properties;
}

export function useRatePlans() {
  const [ratePlans, setRatePlans] = useState<RatePlan[]>([]);

  useEffect(() => {
    api.get("/rate-plans").then((res) => {
      const items = res.data.data.map(
        (r: JsonApiResource<RatePlan>) => ({
          ...r.attributes,
          id: r.id,
        })
      );
      setRatePlans(items);
    });
  }, []);

  return ratePlans;
}

export function useRatePlanPolicy(ratePlanId: string | null) {
  const [policy, setPolicy] = useState<RatePlanPromoPolicy | null>(null);

  const fetch = useCallback(async () => {
    if (!ratePlanId) return;
    const res = await api.get<{
      data: JsonApiResource<RatePlanPromoPolicyAttributes>;
    }>(`/rate-plans/${ratePlanId}/promo-policy`);
    setPolicy(unwrapPolicy(res.data.data));
  }, [ratePlanId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { policy, refetch: fetch };
}

export function useValidatePromoCode() {
  const [result, setResult] = useState<ValidateResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = async (request: ValidateRequest) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/promo-codes/validate", request);
      setResult(res.data);
    } catch {
      setResult({ valid: false, message: "Failed to validate promo code" });
    }
    setLoading(false);
  };

  const clear = () => setResult(null);

  return { result, loading, validate, clear };
}
