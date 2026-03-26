import type { Property, CancellationPolicy, BookingBehaviorProfile, ExistingRatePlan } from "../types";

export const PROPERTIES: Property[] = [
  {
    id: "prop-70pine",
    name: "Mint House at 70 Pine",
    room_types: [
      { id: "6437a1b2c3d4e5f6a7b8c9d0", name: "Studio", code: "STD" },
      { id: "6437a1b2c3d4e5f6a7b8c9d1", name: "Premium Studio", code: "PSTD" },
      { id: "6437a1b2c3d4e5f6a7b8c9d2", name: "Superior Studio", code: "SSTD" },
      { id: "6437a1b2c3d4e5f6a7b8c9d3", name: "One Bedroom", code: "1BR" },
      { id: "6437a1b2c3d4e5f6a7b8c9d4", name: "Junior One Bedroom", code: "J1BR" },
      { id: "6437a1b2c3d4e5f6a7b8c9d5", name: "Two Bedroom", code: "2BR" },
    ],
  },
  {
    id: "prop-downtown",
    name: "Kasa Downtown Austin",
    room_types: [
      { id: "6437b1b2c3d4e5f6a7b8c9d0", name: "Studio", code: "STD" },
      { id: "6437b1b2c3d4e5f6a7b8c9d1", name: "One Bedroom", code: "1BR" },
      { id: "6437b1b2c3d4e5f6a7b8c9d2", name: "Two Bedroom", code: "2BR" },
    ],
  },
  {
    id: "prop-nashville",
    name: "Kasa The Gulch Nashville",
    room_types: [
      { id: "6437c1b2c3d4e5f6a7b8c9d0", name: "Studio", code: "STD" },
      { id: "6437c1b2c3d4e5f6a7b8c9d1", name: "Premium Studio", code: "PSTD" },
      { id: "6437c1b2c3d4e5f6a7b8c9d2", name: "One Bedroom", code: "1BR" },
    ],
  },
];

export const CANCELLATION_POLICIES: CancellationPolicy[] = [
  { id: "cp-strict", name: "Strict (24hr / 3PM EST)", code: "STRICT" },
  { id: "cp-moderate", name: "Moderate (48hr)", code: "MODERATE" },
  { id: "cp-flex", name: "Flexible (72hr)", code: "FLEX" },
  { id: "cp-nonrefundable", name: "Non-Refundable", code: "NRF" },
  { id: "cp-group-standard", name: "Group Standard (tiered)", code: "GRP-STD" },
];

export const BOOKING_BEHAVIOR_PROFILES: BookingBehaviorProfile[] = [
  { id: "bbp-pay-booking", name: "Pay at Booking", description: "Full payment collected at time of booking." },
  { id: "bbp-pay-checkin", name: "Pay at Check-in", description: "Payment collected at check-in." },
  { id: "bbp-bill-company", name: "Bill to Company (Direct Bill)", description: "Invoiced to company master account." },
  { id: "bbp-group-deposit", name: "Group Deposit Schedule", description: "Tiered deposit schedule per contract terms." },
];

export const EXISTING_RATE_PLANS: ExistingRatePlan[] = [
  {
    id: "rp-001", planId: "rp-001", name: "Corporate - Acme Corp 2026", code: "CORP-ACME26", rateCode: "ACME26",
    planType: "Corporate Negotiated", category: "negotiated", propertyId: "prop-70pine",
    description: "Negotiated corporate rate for Acme Corporation, valid Jan–Dec 2026.",
    cancellationPolicy: "cp-strict", bookingBehaviorProfileId: "bbp-bill-company",
    marketSegmentation: { category: "Contract", segment: "Corporate", subSegment: "Negotiated" },
    applicabilityConfiguration: {
      effectiveDateRange: { start: "2026-01-01", end: "2026-12-31" },
      applicableDateRange: { start: "2026-01-01", end: "2026-12-31" },
      reservationSource: ["direct"], appliesToAllCurrentAndFutureRoomTypes: false,
      blockedDateRanges: [
        { start: "2026-07-01", end: "2026-07-07", label: "Independence Day Week" },
        { start: "2026-12-23", end: "2026-12-31", label: "Holiday Week" },
      ],
      blockedDaysOfWeek: [],
    },
    roomTypeGroups: [
      { roomTypes: ["6437a1b2c3d4e5f6a7b8c9d0"], roomTypeNames: ["Studio"], actions: { rateModifierLevel: "periodic", rateModifier: { type: "set" }, waiveParkingFee: true } },
      { roomTypes: ["6437a1b2c3d4e5f6a7b8c9d3"], roomTypeNames: ["One Bedroom"], actions: { rateModifierLevel: "periodic", rateModifier: { type: "set" }, waiveParkingFee: true } },
    ],
    eventCode: { code: "ACME-2026", accountName: "Acme Corporation", salesManager: "Sarah Chen" },
  },
  {
    id: "rp-002", planId: "rp-002", name: "Group - Guttmacher Board 2026", code: "GRP-GUTT26", rateCode: "GUTT26",
    planType: "Group Negotiated", category: "negotiated", propertyId: "prop-70pine",
    description: "Group negotiated rate for Guttmacher Institute board meeting, Sep 2026.",
    cancellationPolicy: "cp-group-standard", bookingBehaviorProfileId: "bbp-group-deposit",
    marketSegmentation: { category: "Group", segment: "Association/Convention", subSegment: "Negotiated" },
    applicabilityConfiguration: {
      effectiveDateRange: { start: "2026-09-10", end: "2026-09-15" },
      applicableDateRange: { start: "2026-09-07", end: "2026-09-18" },
      reservationSource: ["direct"], appliesToAllCurrentAndFutureRoomTypes: false,
      blockedDateRanges: [], blockedDaysOfWeek: [],
    },
    roomTypeGroups: [
      { roomTypes: ["6437a1b2c3d4e5f6a7b8c9d0"], roomTypeNames: ["Studio"], actions: { rateModifierLevel: "universal", rateModifier: { type: "set", amountInCents: 22500 }, waiveLateCheckOut: true, waiveParkingFee: true } },
    ],
    eventCode: { code: "GUTT-SEP26", accountName: "Guttmacher Institute", salesManager: "Sarah Chen" },
  },
];
