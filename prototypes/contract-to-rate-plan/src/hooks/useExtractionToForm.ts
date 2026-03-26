import type {
  ContractExtraction,
  RatePlanForm,
  RoomTypeGroupForm,
  RoomTypeMapping,
  SeasonDefinition,
  Property,
  CancellationPolicy,
  BookingBehaviorProfile,
  Confidence,
  LabeledDateRange,
} from "../types";

/**
 * Convert a ContractExtraction response into a pre-populated RatePlanForm.
 * This is the core mapping layer — extraction schema → API creation DTO shape.
 */
export function extractionToForm(
  extraction: ContractExtraction,
  property: Property,
  cancellationPolicies: CancellationPolicy[],
  bookingBehaviorProfiles: BookingBehaviorProfile[]
): { form: RatePlanForm; roomTypeMappings: RoomTypeMapping[] } {
  const isCorporate = extraction.contract_type === "corporate";
  const isBarDiscount = extraction.rate_type === "bar_discount";

  // --- General Info ---
  const planType = isCorporate ? "Corporate Negotiated" as const : "Group Negotiated" as const;
  const name = isCorporate
    ? `Corporate - ${extraction.client_name}`
    : `Group - ${extraction.client_name}`;

  // Map cancellation
  const cancellationPolicyId = mapCancellationPolicy(
    extraction.cancellation,
    cancellationPolicies,
    isCorporate
  );

  // Map booking behavior
  const bookingBehaviorProfileId = mapBookingBehavior(
    extraction,
    bookingBehaviorProfiles,
    isCorporate
  );

  // Market segmentation
  const marketSegmentation = isCorporate
    ? { category: "Contract", segment: "Corporate", subSegment: "Negotiated" }
    : { category: "Group", segment: guessGroupSegment(extraction.client_name), subSegment: "Negotiated" };

  // --- Room Type Groups ---
  const { roomTypeGroups, roomTypeMappings } = buildRoomTypeGroups(
    extraction,
    property,
    isBarDiscount
  );

  // --- Availability ---
  const blockedDateRanges: LabeledDateRange[] = extraction.blackout_dates.map((bd) => ({
    start: bd.date_range.start,
    end: bd.date_range.end,
    label: bd.event_name,
  }));

  // For group contracts with room blocks, extend applicable date range ±3 days
  let applicableDateRange = { ...extraction.valid_dates };
  if (!isCorporate && extraction.room_block?.length) {
    const dates = extraction.room_block.map((rb) => rb.date);
    const minDate = dates.sort()[0];
    const maxDate = dates.sort().reverse()[0];
    applicableDateRange = {
      start: shiftDate(minDate, -3),
      end: shiftDate(maxDate, 3),
    };
  }

  const form: RatePlanForm = {
    name,
    description: generateDescription(extraction),
    code: "", // Must be entered manually (FR: rate code not in contracts)
    rateCode: "", // Must be entered manually
    planType,
    category: "negotiated",
    source: "internal",
    cancellationPolicyId,
    bookingBehaviorProfileId,
    reservationSource: ["direct"],
    marketSegmentation,
    eventCode: {
      code: "", // Must be entered manually
      accountName: extraction.client_name,
      salesManager: extraction.property_contact?.name ?? "",
    },
    appliesToAllCurrentAndFutureRoomTypes: isBarDiscount,
    roomTypeGroups,
    effectiveDateRange: extraction.valid_dates,
    applicableDateRange,
    blockedDateRanges,
    blockedDaysOfWeek: [],
    minimumNights: null,
    maximumNights: null,
    minimumLeadTimeHours: null,
    maximumLeadTimeHours: null,
  };

  return { form, roomTypeMappings };
}

function buildRoomTypeGroups(
  extraction: ContractExtraction,
  property: Property,
  isBarDiscount: boolean
): { roomTypeGroups: RoomTypeGroupForm[]; roomTypeMappings: RoomTypeMapping[] } {
  const roomTypeMappings: RoomTypeMapping[] = [];

  // Collect waivers from concessions
  const waivers = {
    waiveEarlyCheckIn: false,
    waiveLateCheckOut: false,
    waiveParkingFee: false,
    waiveCleaningFee: false,
    waiveResortFee: false,
  };
  for (const c of extraction.concessions) {
    if (c.maps_to_waiver && c.maps_to_waiver in waivers) {
      (waivers as Record<string, boolean>)[c.maps_to_waiver] = true;
    }
  }

  if (isBarDiscount && extraction.bar_discount) {
    // Single group, all room types, percentage decrease
    return {
      roomTypeGroups: [
        {
          roomTypes: [],
          roomTypeMappings: [],
          rateModifierLevel: "universal",
          rateModifier: {
            type: "percentage",
            percentageAmount: extraction.bar_discount.pct,
            modification: "decrease",
          },
          ...waivers,
          taxExempt: false,
          compedAddOns: [],
        },
      ],
      roomTypeMappings: [],
    };
  }

  if (extraction.rate_type === "fixed_seasonal" && extraction.seasonal_rates) {
    // Group by unique room type name
    const byRoomType = new Map<string, { rate: number; dateRange: { start: string; end: string } }[]>();
    for (const sr of extraction.seasonal_rates) {
      const existing = byRoomType.get(sr.room_type) || [];
      existing.push({ rate: sr.rate, dateRange: sr.date_range });
      byRoomType.set(sr.room_type, existing);
    }

    const groups: RoomTypeGroupForm[] = [];
    for (const [contractName, seasons] of byRoomType) {
      const mapping = fuzzyMatchRoomType(contractName, property);
      roomTypeMappings.push(mapping);

      const seasonDefs: SeasonDefinition[] = seasons.map((s) => ({
        dateRange: s.dateRange,
        amountInCents: Math.round(s.rate * 100),
      }));

      groups.push({
        roomTypes: mapping.internalId ? [mapping.internalId] : [],
        roomTypeMappings: [mapping],
        rateModifierLevel: "periodic",
        rateModifier: { type: "set", amountInCents: seasonDefs[0]?.amountInCents ?? 0 },
        seasons: seasonDefs,
        ...waivers,
        taxExempt: false,
        compedAddOns: [],
      });
    }
    return { roomTypeGroups: groups, roomTypeMappings };
  }

  if (extraction.rate_type === "group_block" && extraction.room_block) {
    // Group by unique room type name, take average rate
    const byRoomType = new Map<string, number[]>();
    for (const rb of extraction.room_block) {
      const existing = byRoomType.get(rb.room_type) || [];
      existing.push(rb.rate);
      byRoomType.set(rb.room_type, existing);
    }

    const groups: RoomTypeGroupForm[] = [];
    for (const [contractName, rates] of byRoomType) {
      const mapping = fuzzyMatchRoomType(contractName, property);
      roomTypeMappings.push(mapping);

      const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
      groups.push({
        roomTypes: mapping.internalId ? [mapping.internalId] : [],
        roomTypeMappings: [mapping],
        rateModifierLevel: "universal",
        rateModifier: { type: "set", amountInCents: Math.round(avgRate * 100) },
        ...waivers,
        taxExempt: false,
        compedAddOns: [],
      });
    }
    return { roomTypeGroups: groups, roomTypeMappings };
  }

  // Fallback: empty group
  return {
    roomTypeGroups: [
      {
        roomTypes: [],
        roomTypeMappings: [],
        rateModifierLevel: "universal",
        rateModifier: { type: "none" },
        ...waivers,
        taxExempt: false,
        compedAddOns: [],
      },
    ],
    roomTypeMappings: [],
  };
}

function fuzzyMatchRoomType(contractName: string, property: Property): RoomTypeMapping {
  const normalized = contractName.toLowerCase().replace(/[^a-z0-9]/g, "");
  let bestMatch: { id: string; name: string; score: number } | null = null;

  for (const rt of property.room_types) {
    const internalNormalized = rt.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Exact match
    if (normalized === internalNormalized) {
      return {
        contractName,
        internalId: rt.id,
        internalName: rt.name,
        confidence: "high",
      };
    }

    // Contains match
    const score =
      (normalized.includes(internalNormalized) || internalNormalized.includes(normalized))
        ? 0.7
        : levenshteinSimilarity(normalized, internalNormalized);

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { id: rt.id, name: rt.name, score };
    }
  }

  if (bestMatch && bestMatch.score >= 0.5) {
    return {
      contractName,
      internalId: bestMatch.id,
      internalName: bestMatch.name,
      confidence: bestMatch.score >= 0.7 ? "medium" : "low",
    };
  }

  return {
    contractName,
    internalId: null,
    internalName: null,
    confidence: "low",
  };
}

function levenshteinSimilarity(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
    for (let j = 1; j <= b.length; j++) {
      if (i === 0) {
        matrix[i][j] = j;
      } else {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
  }
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - matrix[a.length][b.length] / maxLen;
}

function mapCancellationPolicy(
  cancellation: ContractExtraction["cancellation"],
  policies: CancellationPolicy[],
  isCorporate: boolean
): string {
  if (isCorporate && cancellation.type === "standard_24hr") {
    const strict = policies.find((p) => p.code === "STRICT");
    return strict?.id ?? "";
  }
  if (!isCorporate) {
    const groupStd = policies.find((p) => p.code === "GRP-STD");
    return groupStd?.id ?? "";
  }
  return "";
}

function mapBookingBehavior(
  extraction: ContractExtraction,
  profiles: BookingBehaviorProfile[],
  isCorporate: boolean
): string {
  if (!isCorporate) {
    if (extraction.deposit_schedule?.length) {
      const groupDeposit = profiles.find((p) => p.id === "bbp-group-deposit");
      return groupDeposit?.id ?? "";
    }
    return "";
  }
  // Corporate: check commission and payment patterns
  if (!extraction.commission.commissionable) {
    const billCompany = profiles.find((p) => p.id === "bbp-bill-company");
    return billCompany?.id ?? "";
  }
  const payCheckin = profiles.find((p) => p.id === "bbp-pay-checkin");
  return payCheckin?.id ?? "";
}

function guessGroupSegment(clientName: string): string {
  const lower = clientName.toLowerCase();
  if (lower.includes("wedding") || lower.includes("celebration")) return "SMERF";
  if (lower.includes("conference") || lower.includes("board") || lower.includes("institute"))
    return "Association/Convention";
  return "Corporate";
}

function generateDescription(extraction: ContractExtraction): string {
  const type = extraction.contract_type === "corporate" ? "Corporate" : "Group";
  const dates = `${extraction.valid_dates.start} to ${extraction.valid_dates.end}`;
  let rateDesc = "";
  if (extraction.rate_type === "bar_discount" && extraction.bar_discount) {
    rateDesc = ` ${(extraction.bar_discount.pct * 100).toFixed(0)}% off BAR.`;
  } else if (extraction.rate_type === "fixed_seasonal") {
    const roomCount = new Set(extraction.seasonal_rates?.map((r) => r.room_type)).size;
    rateDesc = ` Fixed seasonal rates across ${roomCount} room type(s).`;
  } else if (extraction.rate_type === "group_block") {
    rateDesc = ` ${extraction.total_room_nights ?? "N/A"} total room nights.`;
  }
  return `${type} negotiated rate for ${extraction.client_name}, valid ${dates}.${rateDesc}`;
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/**
 * Compute field-level diffs between an existing rate plan and a new extraction.
 */
export function computeDiffs(
  existing: Record<string, unknown>,
  proposed: Record<string, unknown>,
  labels: Record<string, string>
): { field: string; label: string; oldValue: unknown; newValue: unknown; accepted: boolean }[] {
  const diffs: { field: string; label: string; oldValue: unknown; newValue: unknown; accepted: boolean }[] = [];

  for (const key of Object.keys(labels)) {
    const oldVal = existing[key];
    const newVal = proposed[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      diffs.push({
        field: key,
        label: labels[key],
        oldValue: oldVal,
        newValue: newVal,
        accepted: true,
      });
    }
  }

  return diffs;
}

export function getConfidence(
  extraction: ContractExtraction,
  field: string
): Confidence {
  return extraction.confidence[field] ?? "medium";
}
