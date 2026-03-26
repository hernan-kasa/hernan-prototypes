import axios from "axios";
import { simulateExtraction } from "../data/mockExtractions";
import { PROPERTIES, CANCELLATION_POLICIES, BOOKING_BEHAVIOR_PROFILES, EXISTING_RATE_PLANS } from "../data/lookups";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : `${import.meta.env.BASE_URL}api`,
  headers: { "Content-Type": "application/json" },
});

export default api;

export async function uploadContractPdf(file: File) {
  // Try backend first; fall back to client-side mock
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/extract", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });
    return response.data;
  } catch {
    // Backend unavailable — use client-side demo extraction
    return simulateExtraction(file);
  }
}

export async function fetchProperties() {
  try {
    const response = await api.get("/properties");
    return response.data.data;
  } catch {
    return PROPERTIES;
  }
}

export async function fetchCancellationPolicies() {
  try {
    const response = await api.get("/cancellation-policies");
    return response.data.data;
  } catch {
    return CANCELLATION_POLICIES;
  }
}

export async function fetchBookingBehaviorProfiles() {
  try {
    const response = await api.get("/booking-behavior-profiles");
    return response.data.data;
  } catch {
    return BOOKING_BEHAVIOR_PROFILES;
  }
}

export async function fetchExistingRatePlans() {
  try {
    const response = await api.get("/rate-plans");
    return response.data.data;
  } catch {
    return EXISTING_RATE_PLANS;
  }
}

export async function fetchRatePlan(planId: string) {
  try {
    const response = await api.get(`/rate-plans/${planId}`);
    return response.data.data;
  } catch {
    return EXISTING_RATE_PLANS.find((rp) => rp.id === planId) ?? null;
  }
}
