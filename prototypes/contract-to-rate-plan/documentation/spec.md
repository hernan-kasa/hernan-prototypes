# "Yer a Wizard, Randi" — Contract-to-Rate-Plan Wizard

**Domain(s):** Revenue Management (primary), Kontrol UI (primary)
**Primary Owner:** Hernan Perla
**Stakeholders:** Corey Stubbs (Eng), Bill Bergquist (Eng / Kontrol UI), Adam Kiss (Eng / Booking Behaviors), Kirsten Knecht (Sales Support — primary user), Kristen Bratton (Sales Support)

---

## Claude Code Context Block

> **For engineers using Claude Code — paste this block as your starting context:**
>
> **Build:** A contract-to-rate-plan tool integrated into Kontrol's rate plan creation flow. When a user clicks "Create Rate Plan," they choose between three paths: (1) create from scratch (existing wizard), (2) create from a contract (new — upload PDF, AI extracts fields, user reviews + confirms, system calls `POST /api/rate-plans`), or (3) amend an existing rate plan from a contract (new — upload amendment PDF, AI extracts changes, system diffs against existing plan, user reviews + confirms, system calls `POST /api/rate-plans/:planId/latest`).
>
> **System(s):**
> - Kontrol UI: `kasa-dev/kontrol-ui/libs/kontrol-ui/pages/revenue-management/rate-plans/src/lib/components/wizard/`
> - Revenue Management Service API: `POST /api/rate-plans` (create), `POST /api/rate-plans/:planId/latest` (update/version)
> - Rate plan model: `kasa-dev/revenue-management/service/src/rate-plans/rate-plans.model.ts`
> - Creation DTO: `kasa-dev/revenue-management/service/src/rate-plans/dtos/rate-plan-creation-request.dto.ts`
> - Enums: `kasa-dev/enums/src/enums/`
> - Claude API: `POST https://api.anthropic.com/v1/messages` with structured JSON output for contract field extraction
>
> **Constraints:**
> - Rate plans go live on creation — no draft mode exists. The confirmation UI is load-bearing; the API call must NOT fire until the user explicitly confirms.
> - All contract-generated rate plans use `category: "negotiated"` and `planType: "Corporate Negotiated"` or `"Group Negotiated"`.
> - Two fundamentally different contract types: **Corporate Rate Agreements** (fixed seasonal rate tables OR % off BAR) and **Group Agreements** (room block tables with counts + rates per date). Detection signal: header line on page 1 reliably says "Corporate Rate Agreement" or "Group Agreement."
> - Corporate rate structures split further: (a) fixed seasonal rate table (date ranges × room types × dollar amounts), or (b) percentage off BAR (single discount %).
> - Room type names in contracts are NOT standardized — "Studio (Kitchenette)" vs. "Studio Plus" vs. "Studio Suite" etc. Requires fuzzy matching to internal room types or manual mapping in review UI.
> - Some contract PDFs are scanned images (not native text) — extraction must handle OCR scenarios.
> - Booking behavior profile suggestion is based on contract payment terms but user must be able to override.
> - Rate propagation delay (30 min–2 hr) is out of scope — do not attempt to solve.
> - Group room block creation is out of scope — rate plan only.
> - PAC-required validation is handled by booking behavior profiles, not this tool.
>
> **Success condition:** Sales Support user uploads a signed corporate or group contract PDF → sees a pre-populated rate plan review screen with all extracted fields → confirms → rate plan is created via API and appears in Kontrol.
>
> **Exists already:** Rate plan creation API (`POST /api/rate-plans`) is fully built with validation and SNS event publishing. Rate plan versioning API (`POST /api/rate-plans/:planId/latest`) exists. The existing wizard UI at `wizard/` is the canonical Kontrol wizard pattern (3-step form). Cancellation policies, room types, and rate codes are all queryable via existing APIs.
>
> **Phases:** V1 = new contract upload + amendment mode with diff viewer. Rate propagation improvements and group room block creation are deferred.
>
> **Edge cases to handle:** (1) AI extraction confidence — low-confidence fields must be flagged for manual review. (2) Contract cancellation terms that don't map cleanly to existing policies — corporate is always standard 24hr (map to existing policy); group uses tiered scales that vary per contract (present closest match + override). (3) Amendment diffs where the existing rate plan was modified outside the tool. (4) Contracts with multiple room types requiring multiple room type groups. (5) Room type names are not standardized across contracts — fuzzy matching or manual mapping required. (6) Scanned/image-based PDFs require OCR — test both native-text and scanned. (7) Corporate contracts have two rate structures (fixed seasonal table vs. % off BAR) — detection and mapping diverge. (8) Group deposit schedules vary from 2 to 4 tiers — extract as structured list for booking behavior suggestion.

---

## 1. Overview

Sales Support, Revenue, and Distribution teams manually translate signed contracts into rate plans via Kontrol's multi-step wizard. This is error-prone — the `#sales-and-leasing-support` channel shows a steady stream of rate plans that can't be found, have wrong constraints, or were misconfigured. The people creating rate plans (especially for negotiated/group/corporate deals) are not always deeply technical about the wizard's options.

This tool adds two new paths to rate plan creation: **"Create from Contract"** (upload a signed PDF, AI extracts fields, user reviews and confirms) and **"Amend Existing Rate Plan"** (upload an amendment, AI extracts changes, diff viewer shows what changed, user confirms). Both paths create or update rate plans via the existing backend API.

---

## 2. Problem & Context

**Current state:**
- Rate plan creation requires manually reading a signed contract and entering ~30+ fields across a 3-step wizard in Kontrol
- Rate plans are created by Revenue Managers, Distribution, and Sales Support — a fragmented set of users with varying technical depth
- Configuration errors are frequent: wrong date ranges, missing blackout dates, incorrect rate modifiers, mismatched cancellation policies

**Pain points (from `#sales-and-leasing-support`, March 2026):**
- Rate plans not found in Kontrol after creation (rate code mismatches, naming inconsistencies)
- Rate plan constraints causing booking friction (wrong shoulder dates, unexpected MLOS, missing room types)
- No visibility into what changed when a rate plan is amended — Kirsten and team have no diff tool
- After a rate plan is created, there's a 30-min to 2-hour propagation delay before it's bookable, compounding errors (out of scope for this tool, but context for urgency)

**Who is affected:**
- **Sales Support (Kirsten Knecht, Kristen Bratton):** Primary users — they translate contracts into rate plans daily
- **GX/Reservations:** They book against these rate plans and escalate when something doesn't work
- **Revenue Management:** They review and sometimes create rate plans; benefit from reduced error rates

---

## 3. Goals and Non-Goals

### Goals

- **G1:** Reduce rate plan configuration errors by auto-extracting contract terms and pre-populating the rate plan payload for review
- **G2:** Provide a clear confirmation UI so users can verify extracted fields before the rate plan goes live (critical — no draft mode exists)
- **G3:** Support amendments with a diff viewer showing exactly what changed on the rate plan
- **G4:** Auto-suggest booking behavior profile based on contract payment terms (pay at booking vs. pay at check-in)

### Non-Goals

- **NG1:** Group room block creation (rate plan only)
- **NG2:** Solving rate propagation delay
- **NG3:** Changes to the existing "create from scratch" wizard
- **NG4:** Rate plan creation for non-contract use cases (ad-hoc discounts, neighbor rates)
- **NG5:** Channel sync or NextPax publishing changes (existing pipeline handles downstream)
- **NG6:** PAC-required validation (handled by booking behavior profiles)

---

## 4. Users & Use Cases

### User types

- Sales Support (primary — Kirsten, Kristen)
- Revenue Managers (secondary — may use for negotiated rate plans they create)

### Key use cases

- **UC1:** As Sales Support, I upload a signed corporate rate agreement and get a pre-populated Negotiated rate plan to review and confirm, instead of manually filling 30+ fields across 3 wizard steps
- **UC2:** As Sales Support, I upload a group contract and the tool extracts room types, rates, shoulder dates, blackout dates, and MLOS into the correct API fields
- **UC3:** As Sales Support, I receive an amended contract. I upload it, select the existing rate plan, and see a clear diff of what changed before confirming the update
- **UC4:** As Sales Support, I can override any AI-extracted field before confirming — the tool suggests, I decide

---

## 5. Requirements

### 5.1 Functional Requirements

#### A) Entry Point — Create Rate Plan Flow

- **[MUST] FR1:** When a user clicks "Create Rate Plan" in Kontrol, present three options:
  1. **Create from Scratch** — launches the existing 3-step wizard (no change)
  2. **Create from Contract** — new flow (upload PDF → AI extraction → review → confirm → create)
  3. **Amend Existing Rate Plan** — new flow (select existing plan → upload amendment PDF → AI extraction → diff → confirm → update)
  - Acceptance criteria: All three options are accessible from the same entry point. Existing wizard behavior is unchanged.

#### B) Contract Upload + AI Extraction

- **[MUST] FR2:** Accept PDF upload of a signed contract (corporate rate agreement or group contract)
  - Acceptance criteria: User can drag-and-drop or file-pick a PDF. System displays a loading state during extraction.

- **[MUST] FR3:** Use Claude API structured outputs to extract contract fields into a JSON payload matching the rate plan creation schema
  - The extraction prompt must include the full field mapping (see Section 7) and return a structured JSON object
  - Acceptance criteria: Extracted JSON maps directly to `POST /api/rate-plans` attributes shape

- **[MUST] FR4:** Classify the contract and rate structure in two steps:
  1. Contract type: header line detection → `"Corporate Negotiated"` or `"Group Negotiated"`
  2. Rate structure (corporate only): fixed seasonal rate table → `rateModifier.type: "set"` per season/room type; OR percentage off BAR → `rateModifier.type: "percentage"` with `modification: "decrease"`
  3. Group contracts always use room block tables → `rateModifier.type: "set"` per room type
  - Acceptance criteria: Classification drives downstream field mapping. Review UI labels the detected type.

- **[MUST] FR4b:** Require property selection before contract upload, so the extraction can present the property's internal room types for mapping
  - Acceptance criteria: User selects target property from a dropdown → uploads PDF → review UI shows the property's room types alongside extracted contract room type names

- **[SHOULD] FR5:** Include a confidence indicator per extracted field (high / medium / low)
  - Low-confidence fields should be visually flagged in the review UI so the user knows to verify them
  - Acceptance criteria: Fields the AI is uncertain about are highlighted differently from high-confidence fields

- **[SHOULD] FR6:** Auto-suggest a booking behavior profile based on contract payment terms
  - "Pay at booking" → suggest the corresponding profile
  - "Pay at check-in" or "bill to company" → suggest the corresponding profile
  - If payment terms are ambiguous or missing → leave blank, flag for manual selection
  - Acceptance criteria: Booking behavior dropdown is pre-selected when extraction is confident; left blank otherwise

#### C) Review & Confirmation UI

- **[MUST] FR7:** Present extracted fields in a review screen organized by the same three groups as the existing wizard (General Information, Price Modifiers, Availability/Restrictions)
  - Every field must be editable — the user can override any AI-extracted value
  - Acceptance criteria: All fields from the `POST /api/rate-plans` payload are represented and editable

- **[MUST] FR8:** Include a "Confirm & Create" action that:
  1. Validates the payload against the creation DTO
  2. Calls `POST /api/rate-plans`
  3. Shows success state with the created rate plan's name and code
  - Acceptance criteria: Rate plan is created only after explicit user confirmation. Validation errors are surfaced inline before submission.

- **[MUST] FR9:** Include a "Cancel" action that discards the extraction and returns to the rate plan list without creating anything
  - Acceptance criteria: No API call is made; no rate plan is created

- **[SHOULD] FR10:** Show the raw contract PDF alongside the review form (split-pane or toggle) so the user can cross-reference
  - Acceptance criteria: User can view the original contract while reviewing extracted fields

#### D) Amendment Mode + Diff Viewer

- **[MUST] FR11:** In "Amend Existing Rate Plan" mode:
  1. User selects an existing rate plan from a searchable list
  2. User uploads an amendment PDF
  3. AI extracts the amended fields
  4. System displays a diff view comparing current rate plan values vs. proposed changes
  - Acceptance criteria: Diff clearly shows old value → new value for each changed field

- **[MUST] FR12:** The diff viewer must highlight only changed fields — unchanged fields are shown but not emphasized
  - Acceptance criteria: User can immediately see what the amendment changes without reading every field

- **[MUST] FR13:** On confirmation, call `POST /api/rate-plans/:planId/latest` to create a new version of the rate plan
  - Acceptance criteria: Existing rate plan is versioned (not overwritten). The update publishes SNS events as expected.

- **[SHOULD] FR14:** Allow the user to accept or reject individual field changes from the amendment before confirming
  - Acceptance criteria: User can toggle individual changes on/off in the diff viewer

#### E) Validation & Guardrails

- **[MUST] FR15:** Validate the assembled payload against the creation DTO before submission — surface errors inline
  - Acceptance criteria: If `cancellationPolicy` is missing, or `minimumNights > maximumNights`, or required fields are empty, the UI blocks submission with clear error messages

- **[MUST] FR16:** Map contract cancellation terms to existing cancellation policy IDs (Strict, Moderate, Flex, etc.)
  - If no confident match, flag the field and present the dropdown for manual selection
  - Acceptance criteria: Cancellation policy is a dropdown of existing policies, pre-selected when AI is confident

- **[SHOULD] FR17:** Validate that room types referenced in the contract exist for the target property
  - Acceptance criteria: If a contract references "Studio" but the property has no Studio room type, flag it

### 5.2 Non-Functional Requirements

- **[MUST] NFR1:** The confirmation UI is the safety boundary — the `POST /api/rate-plans` call must NEVER fire without explicit user action (click "Confirm & Create")
- **[MUST] NFR2:** Claude API calls must include the contract PDF as a document input with structured JSON output instructions
- **[SHOULD] NFR3:** Extraction should complete within 15 seconds for typical contracts (1–5 pages)
- **[SHOULD] NFR4:** Log each extraction attempt and creation action for auditability (who uploaded what, what was extracted, what was confirmed)

---

## 6. Domain-Specific Considerations

### 6.1 Revenue Management

- All contract-generated rate plans target the Negotiated category within the Standard / Non-Refundable / Negotiated framework (RCS migration is complete)
- Three rate structures map to existing modifier types:
  - **Fixed seasonal rate table** (corporate) → `rateModifier.type: "set"` with `setAmount` per season/room type. Open question: how this maps to `rateModifierLevel: "periodic"` for seasonal variation.
  - **% off BAR** (corporate) → `rateModifier: { type: "percentage", percentageAmount: X, modification: "decrease" }` applied universally
  - **Group block rate** → `rateModifier.type: "set"` with `setAmount` per room type
- Market segmentation defaults: Corporate → `{ category: "Contract", segment: "Corporate", subSegment: "Negotiated" }`; Group → `{ category: "Group", segment: based on contract type }`
- Blackout dates are corporate-only and always provided as a bullet list with event names — reliable extraction

### 6.2 Financial Tooling (Indirect)

- Rate plans created via this tool flow through the same pipeline as wizard-created plans — no special financial handling needed
- Perks/waivers extracted from contracts (comped parking, waived cleaning fee) set the `waive*` flags on the room type group, which affects the reservation financial breakdown downstream
- Tax exemption extracted from contract sets `taxExempt: true` on the room type group

---

## 7. Data, Integrations & Technical Notes

### Systems Involved

- **Kontrol UI** — new entry point + review/confirmation UI + diff viewer
- **Claude API** — contract PDF → structured JSON extraction
- **Revenue Management Service** — `POST /api/rate-plans` (create), `POST /api/rate-plans/:planId/latest` (amend/version)
- **Existing lookup APIs** — cancellation policies, room types, rate codes, booking behavior profiles

### AI Extraction — Contract Type Detection & Branching

The extraction pipeline branches on contract type, detected from the header line on page 1 (100% reliable across all sample contracts):

```
Upload PDF
  → Detect: "Corporate Rate Agreement" or "Group Agreement"
  → Branch:
      Corporate → Detect rate type: "fixed seasonal table" or "% off BAR"
      Group → Extract room block table
  → Extract common fields (metadata, cancellation, concessions)
  → Assemble rate plan payload
```

### Extraction Confidence Tiers

Based on analysis of 7 signed contracts (3 corporate, 4 group) for Mint House at 70 Pine:

**High Confidence — reliably present and consistent across all contracts:**

| Contract Term | Target API Field | Notes |
|---|---|---|
| Contract type (Corporate vs. Group) | `planType` | Header line detection — `"Corporate Negotiated"` or `"Group Negotiated"` |
| Client / organization name | `eventCode.accountName` | Always present |
| Property contact (sales manager) | `eventCode.salesManager` | Always present |
| Agreement dates (start + end) | `applicabilityConfiguration.effectiveDateRange` | Always present |
| Blackout dates (corporate only) | `applicabilityConfiguration.blockedDateRanges` | Always a bullet list with event name + date range |
| Cancellation policy (corporate) | `cancellationPolicy` | Standardized boilerplate: 24hr / 3PM EST → map to existing "Strict" or "Moderate" policy |
| Commission structure | Metadata (not a rate plan field) | Corporate = always "net, non-commissionable"; Group = stated explicitly |
| Check-in / check-out times | Metadata | Always 3:00 PM / 11:00 AM — can validate or hardcode |

**High Confidence — rate structure (varies by type):**

| Contract Type | Rate Structure | Target API Fields |
|---|---|---|
| Corporate — fixed seasonal table | Date ranges × room types × dollar amounts (e.g., 4 seasons × 3 room types) | `roomTypeGroups[]` with `rateModifier.type: "set"` and `rateModifier.setAmount` per season/room type |
| Corporate — % off BAR | Single discount percentage, year-round | `roomTypeGroups[].actions.rateModifier: { type: "percentage", percentageAmount: X, modification: "decrease" }` |
| Group — room block table | Room types × dates × nightly rate × count per night | `roomTypeGroups[]` with `rateModifier.type: "set"` per room type; dates → `applicabilityConfiguration.applicableDateRange` |

**Medium Confidence — present but requires pattern matching:**

| Contract Term | Target API Field | Notes |
|---|---|---|
| Last Room Availability (corporate) | Metadata / flag | Must handle both positive ("offered on a Last Room Availability option") and negative ("not on a Last-room availability basis") |
| Deposit / payment schedule (group) | `bookingBehaviorProfileId` suggestion | 2–4 tier table; structure consistent but row count varies. Map to booking behavior profile. |
| Cut-off date (group) | Metadata (not a rate plan field directly) | Always present but label varies ("cut-off date" vs. "CUT-OFF DATE") |
| Concessions / added values | `roomTypeGroups[].actions.waive*` flags + `compedAddOns` | Common items (Wi-Fi, parking) can map to waiver flags; bespoke perks (gift bags, restaurant discounts) → extract as freeform list for review |
| Rate extension (±3 days, group) | `applicabilityConfiguration.applicableDateRange` adjustment | Buried in prose, not structured — extend applicable date range by ±3 days |
| Cancellation policy (group) | `cancellationPolicy` | Tiered scale varies per contract (25%/70%/100% at different day thresholds) — map to closest existing policy |

**Low Confidence — unreliable or requires manual intervention:**

| Contract Term | Issue | Handling |
|---|---|---|
| Room type names | Not standardized — "Studio (Kitchenette)" vs. "Studio Plus" vs. "Studio Suite" vs. "Junior One Bedroom Apartment" | Extract raw name, present for manual mapping to internal room types |
| Billing responsibility (group) | Complex master account arrangements that vary significantly | Extract as freeform text for review; do not auto-map |
| Reservation method / booking code | Corporate references "access code to be provided" (not in contract); Group references custom web pages | Leave `code` / `rateCode` blank; user must enter manually |
| Signed vs. unsigned detection | Blank signature lines are unreliable to detect from PDF text | Do not attempt — user is responsible for uploading signed contracts |

### Contract-to-API Field Mapping (Complete)

| Contract Term | Target API Field | Corporate | Group | Confidence |
|---|---|---|---|---|
| Client name | `eventCode.accountName` | ✓ | ✓ | High |
| Sales manager | `eventCode.salesManager` | ✓ | ✓ | High |
| Rate code | `code`, `rateCode` | — (not in contract) | — (not in contract) | Manual entry |
| Rate plan name | `name` | Generate: "Corporate - {client}" | Generate: "Group - {client/event}" | Generated |
| Contract type | `planType` | `"Corporate Negotiated"` | `"Group Negotiated"` | High |
| Category | `category` | `"negotiated"` | `"negotiated"` | Hardcoded |
| Cancellation terms | `cancellationPolicy` | Map 24hr boilerplate → policy ID | Map tiered scale → closest policy ID | High (corp) / Medium (group) |
| Distribution channels | `applicabilityConfiguration.reservationSource` | Default `["direct"]` | Default `["direct"]` | Default |
| Rate modifier | `roomTypeGroups[].actions.rateModifier` | Seasonal table → `set` per period; BAR discount → `percentage decrease` | Block rate → `set` per room type | High |
| Room types | `roomTypeGroups[].roomTypes` | From rate table columns | From block table rows | Low (fuzzy matching needed) |
| Min/max nights | `applicabilityConfiguration.minimumNights / maximumNights` | Not typically in contract | Not typically in contract | Manual if needed |
| Blackout dates | `applicabilityConfiguration.blockedDateRanges` | ✓ (bullet list with event names) | — (not applicable) | High (corp) |
| Contract dates | `applicabilityConfiguration.effectiveDateRange` | ✓ | ✓ | High |
| Guest stay dates | `applicabilityConfiguration.applicableDateRange` | Same as contract dates | From block date range (±3 day extension) | High |
| Perks (parking, check-in) | `roomTypeGroups[].actions.waive*` flags | From concessions list | From concessions list | Medium |
| Tax exemption | `roomTypeGroups[].actions.taxExempt` | Not in contracts analyzed | Not in contracts analyzed | Default `false` |
| Payment terms | `bookingBehaviorProfileId` | "Individual pays" → standard profile | Deposit schedule → suggest profile | Medium |
| Description | `description` | Generate from contract terms | Generate from contract terms | Generated |
| Market segmentation | `marketSegmentation` | `{ category: "Contract", segment: "Corporate", subSegment: "Negotiated" }` | `{ category: "Group", segment: based on contract type }` | Hardcoded |

### Extraction Prompt Design

The Claude API system prompt should:
1. **First pass — type detection:** Identify "Corporate Rate Agreement" vs. "Group Agreement" from header
2. **Second pass — rate structure detection (corporate only):** Fixed seasonal table vs. % off BAR
3. **Third pass — field extraction:** Extract all fields per the confidence-tiered mapping above into a structured JSON object matching the `rate-plan-creation-request.dto.ts` attributes shape
4. Include the valid enum values for `planType`, `category`, channels, rate modifier types, cancellation policies, days of week
5. Return a `confidence` field (high/medium/low) per extracted value
6. Return `null` for fields that cannot be confidently extracted, rather than guessing
7. Return extracted room type names as-is (raw strings) — fuzzy matching to internal room types happens in the UI layer, not the extraction layer

**Extraction schema (TypeScript interface for Claude API structured output):**

```typescript
interface ContractExtraction {
  // Detection
  contract_type: "corporate" | "group";
  rate_type: "fixed_seasonal" | "bar_discount" | "group_block";

  // Metadata (all high confidence)
  client_name: string;
  client_contact: { name: string; phone: string | null; email: string | null };
  property_contact: { name: string; phone: string | null; email: string | null };
  valid_dates: { start: string; end: string }; // ISO dates

  // Rate structure (polymorphic based on rate_type)
  seasonal_rates?: Array<{
    date_range: { start: string; end: string };
    room_type: string; // raw name from contract
    rate: number;
  }>;
  bar_discount?: { pct: number; period: { start: string; end: string } };
  room_block?: Array<{
    room_type: string; // raw name from contract
    date: string;
    count: number;
    rate: number;
  }>;
  total_room_nights?: number;
  total_anticipated_revenue?: number;

  // Restrictions
  blackout_dates: Array<{ event_name: string; date_range: { start: string; end: string } }>;
  last_room_availability: boolean | null; // corporate only
  cut_off_date: string | null; // group only

  // Cancellation
  cancellation: {
    type: "standard_24hr" | "tiered_scale";
    tiers?: Array<{ days_range: string; pct_of_revenue: number }>;
  };

  // Payment
  commission: { commissionable: boolean; pct?: number };
  deposit_schedule?: Array<{
    type: string;
    due_date_description: string;
    amount_or_pct: string;
  }>;

  // Extras
  concessions: string[];
  room_night_commitment: { count: number; type: "estimate" | "minimum"; pct_of_block?: number };

  // Per-field confidence
  confidence: Record<string, "high" | "medium" | "low">;
}
```

### Architecture Flow

```
User clicks "Create Rate Plan" → chooses "From Contract" or "Amend"
  → Upload PDF
  → [Kontrol UI] sends PDF to Claude API with extraction prompt
  → Claude API returns structured JSON + confidence scores
  → [Kontrol UI] renders review form pre-populated with extracted values
  → User reviews, edits, confirms
  → [Kontrol UI] validates payload against creation DTO
  → POST /api/rate-plans (new) or POST /api/rate-plans/:planId/latest (amend)
  → Rate plan saved to MongoDB → SNS events published
  → Rate Calendar Service recomputes nightly rates
  → Channel Management pushes rates to OTAs
```

### Source Code References

| Component | Location |
|---|---|
| Rate plan API controller | `kasa-dev/revenue-management/service/src/rate-plans/rate-plans.controller.ts` |
| Rate plan service | `kasa-dev/revenue-management/service/src/rate-plans/rate-plans.service.ts` |
| Rate plan model | `kasa-dev/revenue-management/service/src/rate-plans/rate-plans.model.ts` |
| Creation DTO / validation | `kasa-dev/revenue-management/service/src/rate-plans/dtos/rate-plan-creation-request.dto.ts` |
| Wizard UI (canonical pattern) | `kasa-dev/kontrol-ui/libs/kontrol-ui/pages/revenue-management/rate-plans/src/lib/components/wizard/` |
| Rate plan types | `kasa-dev/revenue-management/types/src/rate-plans/common.ts` |
| Enums (channels, modifiers, etc.) | `kasa-dev/enums/src/enums/` |

---

## 8. Edge Cases & Scenarios

**Scenario 1: Low-confidence extraction**
- AI cannot confidently extract cancellation terms → field is flagged, cancellation policy dropdown shows "Select..." with a warning badge → user must manually select before confirming

**Scenario 2: Room type name mismatch (most common expected issue)**
- Contract says "Studio (Kitchenette)" but internal room types are "Studio", "Premium Studio", "Superior Studio" → extracted raw name is displayed alongside a dropdown of internal room types for the selected property → user manually maps. Consider building a fuzzy matching suggestion layer in V2.

**Scenario 3: Multiple properties in one contract**
- Some corporate agreements cover multiple properties → V1: extract for one property at a time; user selects target property before extraction begins. Multi-property batch creation is deferred.

**Scenario 4: Corporate — fixed seasonal rate table (4 seasons × 3 room types)**
- Contract contains a tabular rate grid with date ranges as rows and room types as columns → extract each cell as a separate `roomTypeGroup` entry with `rateModifier.type: "set"` and `rateModifier.setAmount`. This produces multiple room type groups with periodic rate modifier levels.

**Scenario 5: Corporate — % off BAR**
- Contract says "20.0% off Best Available Rate, Jan 1 – Dec 31, 2026" → single `roomTypeGroup` with `rateModifier: { type: "percentage", percentageAmount: 0.20, modification: "decrease" }` and `appliesToAllCurrentAndFutureRoomTypes: true`.

**Scenario 6: Group — variable deposit schedules**
- Wedding contract has 2 deposit tiers (25% initial + final invoice). Jane Street has 4 tiers (25% → 50% at 90 days → 25% at 30 days → remaining). Both are extracted as structured deposit schedule arrays, used to suggest a booking behavior profile. If no profile matches cleanly, leave blank for manual selection.

**Scenario 7: Group — tiered cancellation varies per contract**
- Guttmacher Board: 61+ days → 25%, 60–31 → 70%, 30–0 → 100%. JSIP: 91+ days → 25%, 90–61 → 70%, 60–0 → 100%. Wedding: no penalty (rooms released). The tiers are extracted and mapped to the closest existing cancellation policy. If no clean match, flag for manual selection with the extracted tiers shown for reference.

**Scenario 8: Scanned / image-based PDF**
- Some contracts (e.g., Guttmacher corporate) have image-based pages → Claude API handles vision-based extraction from the PDF. If extraction quality degrades, surface a warning: "This appears to be a scanned document — please verify all extracted fields carefully."

**Scenario 9: Amendment changes fields the AI didn't extract**
- Amendment says "extend contract through Dec 2027" but the AI only extracted the new end date, not a rate change → diff viewer shows only `effectiveDateRange.endDate` changed; all other fields show "unchanged"

**Scenario 10: Existing rate plan was modified outside the tool**
- User opens amendment mode, but the current rate plan state doesn't match what was originally created from a contract → diff is computed against the *current* state (latest version from API), not the original contract. This is correct behavior.

**Scenario 11: Concessions that map to waiver flags vs. freeform**
- Contract says "Complimentary Wi-Fi, complimentary parking, complimentary early check-in" → map to `waiveEarlyCheckIn: true`, `waiveParkingFee: true`. But "Gift bag distribution at front desk" and "10% discount at Blue Park Kitchen" → extract as freeform concessions list for operational awareness, no rate plan field mapping.

**Scenario 12: Blocked date ranges exceed limit**
- Contract lists more than 10 blackout date ranges → extract the first 10, flag the field with a warning that the maximum was reached, and note the omitted dates

**Scenario 13: Rate code not in contract**
- Corporate contracts reference "access code to be provided" — the code itself isn't in the contract. Group contracts reference custom web pages. → `code` and `rateCode` fields are left blank in the review UI with a required-field indicator. User must enter manually.

---

## 9. Analytics, Monitoring & Success Metrics

### Primary Metrics

- Rate plan configuration error rate (measured via `#sales-and-leasing-support` escalation volume) — target: measurable decline within 4 weeks of deployment
- Time to create a rate plan from a signed contract (manual wizard vs. contract tool) — target: >50% reduction

### Secondary Metrics

- Extraction accuracy: % of fields that users do not modify after AI extraction (higher = better extraction quality)
- Amendment adoption: % of rate plan updates that use the amendment flow vs. manual edit

### Monitoring

- Log every extraction attempt: user, contract filename, extraction result, fields modified before confirmation
- Log every creation/amendment: user, rate plan ID, source (contract tool vs. wizard)
- Alert on extraction failures (Claude API errors, malformed PDFs)

---

## 10. Rollout Plan & Risks

### Rollout

- **Phase 1 (Hackathon → Production):** Deploy "Create from Contract" flow supporting both corporate rate agreements (fixed seasonal + % off BAR) and group contracts. Extraction schema validated against 7 real contracts. Target Kirsten as first user for UAT.
- **Phase 2:** Enable "Amend Existing Rate Plan" flow with diff viewer.
- **Phase 3:** Room type fuzzy matching (auto-suggest internal room types from contract names), multi-property batch creation, and extraction quality monitoring dashboard.

### Risks & Mitigations

- **R1: AI extraction hallucination / wrong values**
  - Mitigation: Confirmation UI is mandatory. Every field is editable. Low-confidence fields are flagged. No API call without explicit user action.

- **R2: No draft mode — rate plans go live immediately**
  - Mitigation: The review screen IS the safety net. Clear "Confirm & Create" vs. "Cancel" actions. Validation runs before submission.

- **R3: Contract formats vary significantly**
  - Mitigation: Extraction schema validated against 7 real Mint House contracts (3 corporate, 4 group). Two contract types and three rate structures are well-understood. Room type name variance is the highest-risk field — handled via manual mapping in review UI. Expand extraction prompt as new properties/formats are encountered.

- **R4: Scanned / image-based PDFs**
  - Mitigation: Claude API supports vision-based PDF extraction. Flag scanned documents with a verification warning. Test extraction quality against known scanned contracts (Guttmacher corporate).

- **R5: Claude API latency**
  - Mitigation: Loading state during extraction. Target <15s for typical contracts. If extraction fails, surface error and allow retry or fallback to manual wizard.

---

## 11. Dependencies & Open Questions

### Dependencies

- **Claude API access** from Kontrol UI (or a backend proxy) — confirm auth pattern and whether API calls go client-side or via a Kasa backend service
- **Existing rate plan APIs** — all confirmed to exist (`POST /api/rate-plans`, `POST /api/rate-plans/:planId/latest`, lookup endpoints for cancellation policies, room types, rate codes)
- **Booking behavior profiles** — must be queryable to populate the suggestion dropdown

### Open Questions

1. **Claude API routing:** Should the Kontrol UI call Claude API directly (client-side with a proxy) or route through a Kasa backend service? Backend is cleaner for logging/auditability but adds a hop.
2. **Rate code generation:** Should the tool auto-generate a rate code from the contract (e.g., `CORP-ACME2026`) or require manual entry? Auto-generation reduces errors but may conflict with existing naming conventions. (Extraction map confirms rate codes are NOT in contracts — "to be provided" — so this is always a manual or auto-generated field.)
3. **Seasonal rate table → room type groups mapping:** For corporate contracts with 4 seasons × 3 room types (= 12 rate cells), what is the optimal `roomTypeGroups` structure? One group per room type with `periodic` modifier level? Or one group per season? Needs alignment with how `rateModifierLevel: "periodic"` works in the existing model.

---

## 12. Benefits Summary

- Reduces rate plan configuration errors by replacing manual data entry with AI-assisted extraction and pre-population
- Cuts time-to-create for contract-based rate plans by >50%
- Gives Sales Support a clear diff viewer for amendments — no more guessing what changed
- Builds on existing infrastructure (rate plan API, wizard patterns, cancellation policies) with no backend changes required for V1
- Auto-suggests booking behavior profiles, reducing a common source of misconfiguration

---

## 13. Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-03-25 | Corey confirmed direction as "upload contract → AI creates rate plan for review" | Hackathon channel — preferred over other four proposed directions |
| 2026-03-25 | Corey proposed pre-populate wizard + diff viewer as two key UI features | Hackathon planning |
| 2026-03-26 | Target the new model (Negotiated category, Standard/NRF/Negotiated framework) | RCS migration is complete |
| 2026-03-26 | Auto-suggest booking behavior from contract payment terms | Hernan confirmed |
| 2026-03-26 | Rate propagation delay out of scope | Hernan confirmed — potential future idea |
| 2026-03-26 | Rate plan only — no group room block creation | Hernan confirmed — potential future idea |
| 2026-03-26 | Support amendments with diff viewer (two modes: New Contract + Amending Contract) | Hernan confirmed |
| 2026-03-26 | Extract both blackout dates AND excluded dates from contracts | Hernan confirmed |
| 2026-03-26 | Entry point: "Create Rate Plan" button shows 3 options (from scratch / from contract / amend existing) | Hernan confirmed |
| 2026-03-26 | Primary user: Sales Support (Kirsten, Kristen) | Hernan confirmed |
| 2026-03-26 | PAC validation handled by booking behavior profiles, not this tool | Hernan confirmed |
| 2026-03-26 | Production spec for hackathon deployment | Hernan confirmed |
| 2026-03-26 | Create via API (`POST /api/rate-plans`), not pre-populate wizard UI | System summary confirmed API exists and is fully built |
| 2026-03-26 | Extraction schema validated against 7 real contracts (3 corporate, 4 group) | Extraction map analysis — two contract types, three rate structures, confidence tiers documented |
| 2026-03-26 | Room type names require manual mapping (not auto-matched in V1) | Contract names are not standardized — "Studio (Kitchenette)" vs. "Studio Plus" etc. |
| 2026-03-26 | Rate code / booking code must be entered manually | Not present in contracts analyzed — references "to be provided" |
| 2026-03-26 | Phase 1 includes both corporate and group contracts | Extraction map confirmed both types are well-understood with 7 sample contracts |
