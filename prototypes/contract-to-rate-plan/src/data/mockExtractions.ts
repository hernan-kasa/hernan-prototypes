import type { ContractExtraction, ExtractionResponse } from "../types";

const MOCK_CORPORATE_SEASONAL: ContractExtraction = {
  contract_type: "corporate",
  rate_type: "fixed_seasonal",
  client_name: "Acme Corporation",
  client_contact: { name: "James Rivera", phone: "(212) 555-0142", email: "j.rivera@acmecorp.com" },
  property_contact: { name: "Sarah Chen", phone: "(212) 555-0199", email: "s.chen@kasaliving.com" },
  valid_dates: { start: "2026-01-01", end: "2026-12-31" },
  seasonal_rates: [
    { date_range: { start: "2026-01-01", end: "2026-03-31" }, room_type: "Studio (Kitchenette)", rate: 199.0 },
    { date_range: { start: "2026-04-01", end: "2026-06-30" }, room_type: "Studio (Kitchenette)", rate: 229.0 },
    { date_range: { start: "2026-07-01", end: "2026-09-30" }, room_type: "Studio (Kitchenette)", rate: 249.0 },
    { date_range: { start: "2026-10-01", end: "2026-12-31" }, room_type: "Studio (Kitchenette)", rate: 219.0 },
    { date_range: { start: "2026-01-01", end: "2026-03-31" }, room_type: "Junior One Bedroom Apartment", rate: 279.0 },
    { date_range: { start: "2026-04-01", end: "2026-06-30" }, room_type: "Junior One Bedroom Apartment", rate: 319.0 },
    { date_range: { start: "2026-07-01", end: "2026-09-30" }, room_type: "Junior One Bedroom Apartment", rate: 349.0 },
    { date_range: { start: "2026-10-01", end: "2026-12-31" }, room_type: "Junior One Bedroom Apartment", rate: 299.0 },
    { date_range: { start: "2026-01-01", end: "2026-03-31" }, room_type: "One Bedroom Suite", rate: 349.0 },
    { date_range: { start: "2026-04-01", end: "2026-06-30" }, room_type: "One Bedroom Suite", rate: 399.0 },
    { date_range: { start: "2026-07-01", end: "2026-09-30" }, room_type: "One Bedroom Suite", rate: 429.0 },
    { date_range: { start: "2026-10-01", end: "2026-12-31" }, room_type: "One Bedroom Suite", rate: 379.0 },
  ],
  bar_discount: null,
  room_block: null,
  total_room_nights: null,
  total_anticipated_revenue: null,
  blackout_dates: [
    { event_name: "Independence Day Week", date_range: { start: "2026-07-01", end: "2026-07-07" } },
    { event_name: "Thanksgiving Week", date_range: { start: "2026-11-23", end: "2026-11-29" } },
    { event_name: "Holiday / New Year's", date_range: { start: "2026-12-23", end: "2027-01-02" } },
  ],
  last_room_availability: true,
  cut_off_date: null,
  cancellation: { type: "standard_24hr" },
  commission: { commissionable: false },
  deposit_schedule: null,
  concessions: [
    { description: "Complimentary high-speed Wi-Fi", maps_to_waiver: null },
    { description: "Complimentary parking (1 vehicle)", maps_to_waiver: "waiveParkingFee" },
    { description: "Complimentary early check-in (subject to availability)", maps_to_waiver: "waiveEarlyCheckIn" },
    { description: "10% discount at Blue Park Kitchen restaurant", maps_to_waiver: null },
  ],
  room_night_commitment: null,
  confidence: {
    contract_type: "high",
    rate_type: "high",
    client_name: "high",
    client_contact: "high",
    property_contact: "high",
    valid_dates: "high",
    seasonal_rates: "high",
    blackout_dates: "high",
    last_room_availability: "medium",
    cancellation: "high",
    commission: "high",
    concessions: "medium",
  },
};

const MOCK_GROUP: ContractExtraction = {
  contract_type: "group",
  rate_type: "group_block",
  client_name: "Guttmacher Institute — Board of Directors Meeting",
  client_contact: { name: "Patricia Morales", phone: "(202) 555-0178", email: "p.morales@guttmacher.org" },
  property_contact: { name: "Sarah Chen", phone: "(212) 555-0199", email: "s.chen@kasaliving.com" },
  valid_dates: { start: "2026-09-10", end: "2026-09-15" },
  seasonal_rates: null,
  bar_discount: null,
  room_block: [
    { room_type: "Studio Plus", date: "2026-09-10", count: 8, rate: 225.0 },
    { room_type: "Studio Plus", date: "2026-09-11", count: 10, rate: 225.0 },
    { room_type: "Studio Plus", date: "2026-09-12", count: 10, rate: 225.0 },
    { room_type: "Studio Plus", date: "2026-09-13", count: 10, rate: 225.0 },
    { room_type: "Studio Plus", date: "2026-09-14", count: 6, rate: 225.0 },
    { room_type: "One Bedroom", date: "2026-09-10", count: 4, rate: 295.0 },
    { room_type: "One Bedroom", date: "2026-09-11", count: 5, rate: 295.0 },
    { room_type: "One Bedroom", date: "2026-09-12", count: 5, rate: 295.0 },
    { room_type: "One Bedroom", date: "2026-09-13", count: 5, rate: 295.0 },
    { room_type: "One Bedroom", date: "2026-09-14", count: 3, rate: 295.0 },
  ],
  total_room_nights: 66,
  total_anticipated_revenue: 16830.0,
  blackout_dates: [],
  last_room_availability: null,
  cut_off_date: "2026-08-10",
  cancellation: {
    type: "tiered_scale",
    tiers: [
      { days_range: "61+ days before arrival", pct_of_revenue: 0.25 },
      { days_range: "60–31 days before arrival", pct_of_revenue: 0.7 },
      { days_range: "30–0 days before arrival", pct_of_revenue: 1.0 },
    ],
  },
  commission: { commissionable: true, pct: 0.1 },
  deposit_schedule: [
    { type: "Initial deposit", due_date_description: "Upon signing", amount_or_pct: "25% of anticipated revenue" },
    { type: "Second deposit", due_date_description: "60 days prior to arrival", amount_or_pct: "50% of anticipated revenue" },
    { type: "Final payment", due_date_description: "Upon departure / within 30 days", amount_or_pct: "Remaining balance" },
  ],
  concessions: [
    { description: "Complimentary Wi-Fi for all guests", maps_to_waiver: null },
    { description: "Complimentary late check-out until 2:00 PM", maps_to_waiver: "waiveLateCheckOut" },
    { description: "Complimentary parking for up to 10 vehicles", maps_to_waiver: "waiveParkingFee" },
    { description: "Private meeting room (Pine Room) — Sep 11–13, 8AM–5PM", maps_to_waiver: null },
    { description: "Welcome gift bags at front desk for all attendees", maps_to_waiver: null },
  ],
  room_night_commitment: { count: 66, type: "minimum", pct_of_block: 0.8 },
  confidence: {
    contract_type: "high",
    rate_type: "high",
    client_name: "high",
    client_contact: "high",
    property_contact: "high",
    valid_dates: "high",
    room_block: "high",
    total_room_nights: "high",
    total_anticipated_revenue: "medium",
    cut_off_date: "medium",
    cancellation: "medium",
    commission: "high",
    deposit_schedule: "medium",
    concessions: "medium",
    room_night_commitment: "high",
  },
};

let callCount = 0;

/**
 * Simulate AI extraction — alternates between corporate and group mock data.
 * In production, this would call the backend which calls Claude API.
 */
export async function simulateExtraction(_file: File): Promise<ExtractionResponse> {
  // Simulate 3–5 second extraction delay
  await new Promise((r) => setTimeout(r, 3000 + Math.random() * 2000));

  callCount++;
  if (callCount % 2 === 1) {
    return {
      extraction: MOCK_CORPORATE_SEASONAL,
      warnings: ["Demo mode: showing a mock Corporate Rate Agreement extraction. Connect a backend with ANTHROPIC_API_KEY for real extraction."],
    };
  }
  return {
    extraction: MOCK_GROUP,
    warnings: ["Demo mode: showing a mock Group Agreement extraction. Connect a backend with ANTHROPIC_API_KEY for real extraction."],
  };
}
