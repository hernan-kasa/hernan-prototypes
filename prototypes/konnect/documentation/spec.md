# Konnect V1 — UI Prototype Brief

**Purpose:** UI build instructions for the Konnect V1 prototype — screens, interactions, mock data. Does NOT contain architecture decisions, resolved open questions, or system constraints.

**Full product spec (source of truth for decisions):** `/Users/Kasa/Claude/product-documentation/konnect-content-management/knt-001-v8-full-spec-2026-04-10.md`
If a question arises about how something should work (inheritance model, sync semantics, data model, channel constraints), check the full spec before making assumptions. This prototype spec covers what to build; the full spec covers why and how it works.

---

## 1. What We're Building

A content management UI inside Kontrol that lets Kasa's Distribution team author property descriptions and amenities, see which channels each field maps to, and trigger sync to OTAs.

**V1 scope (descriptions + amenities only):**
- View/edit descriptions per property and room type
- View/edit amenities per property and room type
- See channel applicability and character limits per field
- Trigger content sync to NextPax (which propagates to BDC, Expedia, Airbnb)
- See sync status per property

**NOT in V1 (do not build):**
- Policies
- Photo upload (photos are read-only from Contentful; ordering is in scope)
- Multi-language authoring workflow (data model supports it, UI defers it)
- Batch operations across multiple properties
- Automated sync on save (V1 is operator-triggered)
- Reconciliation/seeding flow (separate from the content management UI)
- Content audit dashboard

---

## 2. Navigation & Information Architecture

### Where Konnect lives

Konnect is a content management section within an existing property detail view in Kontrol. It is NOT a standalone app.

### Kontrol's existing pattern (match this)

Kontrol uses:
- Left sidebar with collapsible tree navigation
- Breadcrumb trail below a global search bar
- Tabbed sections within entity detail views (Account → Company → Property)
- Modal/slide-out editors for detail editing
- Data tables with search, filters, sort, pagination

### Konnect navigation model

Within a Property detail view, Konnect adds a new section (alongside existing property tabs). The left sidebar uses a two-level collapsible tree:

```
[Property Selector Dropdown]

Overview                          ← property-level
Descriptions            [6/22]
Amenities               [42]
Photos                  [12]
Fees                    [ref]
Taxes                   [ref]
Sync Status

─────────────────────────────
ROOM TYPES

▸ Studio Suite                    ← collapsible, shows summary card when collapsed
    Overview
    Descriptions
    Amenities
    Photos
    Fees

▸ One Bedroom King
    ...
```

**Scope is handled by the sidebar** — no scope toggle or tab bar at the top of content pages. Property-level sections are flat at the top. Room types are collapsible groups below a divider. Room types expose a subset of sections: Overview, Descriptions, Amenities, Photos, Fees. Taxes and Sync Status are property-level only.

**Room type summary cards** (shown when collapsed): display internal title, nickname (if different), setup info (e.g., "1BR King"), max occupancy, and channel listing link badges (Airbnb with listing ID, BDC, Expedia). Clicking the card expands the room type.

**Channel ordering:** Channels are displayed in the order Airbnb → Booking.com → Expedia throughout the entire interface.

### Channel Readiness panel

A persistent right-rail panel (280px, collapsible to 40px) visible on all Konnect pages. Tracks content completion with a hierarchical checklist grouped by:

1. **Property-Level Content** — Descriptions, Amenities, Photos, Fees, Taxes
2. **Room Type: [name]** (one group per room type) — Descriptions, Amenities, Photos, Fees
3. **Channel Sync** — one row per channel showing enabled/paused/not-enabled

**Status criteria:**
- Descriptions: ✅ all 9 core types filled, ⚠️ core filled but optional missing, ❌ core types missing
- Amenities: ✅ property ≥20 / room type ≥10, ⚠️ some enabled but below threshold, ❌ none
- Photos: ✅ 5+ photos with hero (priority 0) set, ⚠️ photos exist but no hero, ❌ no photos
- Fees/Taxes: always ✅ (reference only, configured elsewhere)
- Draft content (from cascade): always ⚠️ until reviewed and saved

**Bottom action:** "Enable Content Sync" button, disabled until all required sections pass (no ❌ items).

---

## 3. Screens & Field Inventory

### 3.1 Descriptions Screen

**Purpose:** Author and manage text descriptions for a property (or room type), organized by NextPax description type.

**Layout:** A vertically stacked list of description type cards/sections. Each card contains:

| Element | Details |
|---------|---------|
| Type label | Human-readable name (e.g., "Property Description") with typeCode shown secondary (e.g., `house`) |
| Channel badges | Which channels consume this type — show as small colored badges per channel (BDC, Airbnb, Expedia). Use Kontrol's existing badge component and color tokens for differentiation. See mapping table below. |
| Text input | Multi-line text field for the description content |
| Character counter | Shows current character count. For types that contribute to a BDC composite message, also show the composite running total (see Section 4 for limits) |
| Language indicator | Default: "EN" badge. Data model stores language per entry — V1 is English-only but the field exists |

**Full description type inventory (20+ types):**

| Type Code | Display Label | BDC | Airbnb | Expedia | Priority |
|-----------|--------------|-----|--------|---------|----------|
| `house` | Property Description | ✓ (welcome_message) | ✓ (Space) | ✓ (priority 2) | **High — all 3 channels** |
| `short-introduction` | Short Introduction | ✓ (welcome_message) | ✓ (Summary, 500 char) | — | **High — 2 channels** |
| `interior` | Interior | ✓ (welcome_message) | ✓ (Space) | — | High |
| `unique-benefits` | Unique Benefits | ✓ (welcome_message) | ✓ (Space) | — | High |
| `area` | Area / Neighborhood | ✓ (neighborhood_info) | ✓ (Neighborhood Overview) | — | High |
| `environment` | Environment | ✓ (welcome_message) | ✓ (Neighborhood Overview) | — | High |
| `remarks` | House Rules / Remarks | ✓ (welcome_message) | ✓ (House Rules) | ✓ (priority 1) | **High — all 3 channels** |
| `fine-print` | Fine Print / Terms | ✓ (owner_info) | ✓ (Notes) | ✓ (priority 0) | **High — all 3 channels** |
| `tips-of-the-owner` | Host Tips | ✓ (owner_info) | — | — | Medium |
| `headline` | Headline | ✓ (welcome_message) | — | — | Medium |
| `driving-directions` | Driving Directions | ✓ (neighborhood_info) | — | — | Medium |
| `distances` | Distances | ✓ (neighborhood_info) | — | — | Medium |
| `additional-costs` | Additional Costs | ✓ (owner_info) | — | — | Low |
| `arrival-days` | Arrival Days | ✓ (owner_info) | — | — | Low |
| `discounts` | Discounts | ✓ (owner_info) | — | — | Low |
| `minimum-stay-length` | Minimum Stay Length | ✓ (owner_info) | — | — | Low |
| `opening-hours` | Opening Hours | ✓ (owner_info) | — | — | Low |
| `optional-costs` | Optional Costs | ✓ (owner_info) | — | — | Low |
| `price-table` | Price Table | ✓ (owner_info) | — | — | Low — BDC only |
| `short-winter-text` | Short Winter Text | ✓ (welcome_message) | — | — | Low — BDC only |
| `winter-text` | Winter Text | ✓ (welcome_message) | — | — | Low — BDC only |
| `why-this-property` | Why This Property | ✓ (welcome_message) | — | — | Low — BDC only |

**UI grouping strategy:** Group by priority/usage, not alphabetically. Suggested sections:
1. **Core descriptions** (used by 2-3 channels) — `house`, `short-introduction`, `remarks`, `fine-print`, `interior`, `unique-benefits`, `area`, `environment`
2. **BDC supplementary** (BDC only, commonly used) — `headline`, `tips-of-the-owner`, `driving-directions`, `distances`
3. **BDC specialized** (BDC only, niche) — `additional-costs`, `arrival-days`, `discounts`, `minimum-stay-length`, `opening-hours`, `optional-costs`, `price-table`, `short-winter-text`, `winter-text`, `why-this-property`

Types with no active channel should be visually de-emphasized (muted/collapsed) with a label: "BDC only" or similar.

**Expedia note:** Only 3 types supported (`house`, `remarks`, `fine-print`), English only. Display a note on the Expedia badge for these types.

### 3.2 Amenities Screen

**Purpose:** Select and manage amenities for a property (or room type) using a categorized checklist.

**Data source:** The full amenity inventory comes from the NextPax Supply API (`GET /constants/mapping-codes?category=amenity-types`). The API returns 684 amenity types, each with a code, name, and one of three `codeType` values.

**Layout:** Grouped amenity categories (accordion or card-based), each containing toggles and input controls. A search bar at the top filters across name, code, and category. An "Enabled only" toggle filters to active amenities.

| Element | Details |
|---------|---------|
| Search bar | Type-ahead filter across amenity name, code, and category. Shows result count. |
| Enabled-only filter | Toggle chip to show only active amenities. |
| Category header | Human-readable group name with enabled/total count badge. Categories with enabled items auto-expand; empty categories start collapsed. |
| Amenity toggle | Switch per amenity. Label = human-readable name from API, secondary = amenity code (e.g., `A19`). |
| Value input | Input type depends on the API `codeType` field: **boolean** → toggle only (no extra input), **options** → dropdown populated from API-provided option list (e.g., Stove: Electric/Gas/Induction/Ceramic), **number** → numeric input (e.g., Number of bedrooms, Surface area in m2). Input only shown when amenity is enabled. |
| Channel badges | Which channels consume each amenity (same badge pattern as descriptions). **Deferred:** full amenity-to-channel mapping not yet available. Badges will be added once finalized. |

**Amenity code types (from API):**

| `codeType` | Count | UI Control | Example |
|-----------|-------|-----------|---------|
| `boolean` | 570 | Toggle switch only | `A01` Airconditioning, `D01` Dishwasher |
| `options` | 65 | Dropdown with API-provided choices | `C08` Kitchen stove [Electric, Gas, Ceramic, Induction, Wood], `G01` Parking [Garage, Street, Free, Private] |
| `number` | 49 | Numeric input field | `B02` Number of bedrooms, `P06` Surface area (m2) |

**Amenity categories (24):** Bedroom & Sleeping, Bathroom, Kitchen & Cooking, Living Space & Furniture, Climate Control, Entertainment & Technology, Laundry & Housekeeping, Safety & Security, Parking & Transport, Outdoor & Garden, Pool Spa & Wellness, Fitness Sports & Activities, Services & Amenities, Food & Beverage, Family & Children, Pets, Accessibility, Business Facilities, Views, Location & Property Type, Property Details, Sustainability, Health & Safety Protocols, Policies & Restrictions. Categories are assigned by semantic grouping of amenity names — the API does not provide native categorization.

**Scope:** Each property and room type has its own independent amenity set. Switching scope loads that scope's amenities. **Open question:** Should room types inherit from the property level with override capability, or remain fully independent?

**Key interaction: locked amenity indicator.** Some amenities were imported via BDC reverse content pull and are "locked" in the NextPax UI. Konnect should show a visual indicator (e.g., lock icon with tooltip: "Imported from PMS — will be overwritten on next sync") for amenities that exist in NextPax but haven't been confirmed in Konnect.

**Key interaction: Import from PMS (property-scope only).** Above the category groups on the property-level amenity editor, an "Import from PMS" outlined button opens a preview dialog of amenities already configured in Portfolio Manager Service but not yet toggled in Konnect. The dialog groups proposed imports by Konnect category, shows per-row confidence (High/Medium), source PMS FacilityType, and a non-blocking policy-verification note for parking/pet rows. Operator unchecks any rows that shouldn't seed, confirms, and the toggles flip on with a subtle "Seeded from PMS" origin chip. A "Last imported from PMS: {date} by {user}" line appears under the button after the first import and on re-open. Empty state ("All mappable PMS amenities are already configured.") appears when every mapped PMS amenity is already present. Imports participate in the existing `Save & Apply to Room Types` cascade identically to manually authored amenities. Implementation: see `src/data/pmsMapping.ts` for the mapping + mock data, `src/components/ImportFromPmsDialog.tsx` for the preview dialog. Product context: `product-documentation/konnect-content-management/knt-001-amenity-pms-seed-spec.md`.

### 3.3 Sync Status Screen

**Purpose:** Show the sync state for this property's content across channels.

**Layout:** A status dashboard for the current property, showing:

| Element | Details |
|---------|---------|
| Channel status cards | One card per channel (BDC, Expedia, Airbnb). Shows: sync enabled/disabled, last sync timestamp, last sync result (success/failure/pending) |
| Content type breakdown | Per channel: descriptions sync status, amenities sync status |
| Sync trigger button | "Sync Now" button that pushes current Konnect content to NextPax via CMB. Operator-triggered, not automatic. |
| Sync log (recent) | Last 5-10 sync events: timestamp, operator, content type, result, NextPax request ID |

**Sync ordering note:** When enabling content sync, the system enforces property-level first, then room types. When disabling, room types first, then property. The UI should handle this automatically — the operator just clicks "Enable" or "Disable" and the system handles ordering.

**Warning banners (contextual, shown when relevant):**
- "Content sync is enabled. Manual changes on OTA extranets will be overwritten."
- "Content sync is disabled for Booking.com (duplicate tax issue). Content can be authored but will not sync to BDC."
- "Expedia content sync has never been enabled for this property."
- "Pet fees must be added manually in NextPax channel-specific settings."
- "Airbnb 'Guest Access' and 'Getting Around' fields must be managed directly on Airbnb."

### 3.4 Photos Screen

**Purpose:** Read-only gallery showing photos sourced from Contentful, with a drag-to-reorder interface for setting display priority across channels. Photos cannot be uploaded or edited in Konnect — this is an ordering and review interface.

**Why it exists:** Distribution needs to see photos in context alongside descriptions and amenities. Loadies (operations team) don't have Contentful access. Photo ordering is a channel distribution concern, not a Contentful concern.

**Layout:**

| Element | Details |
|---------|---------|
| Info banner | "Photos are managed in Contentful. Drag to reorder for channel distribution." with "Open in Contentful" link |
| Photo count | "24 photos" |
| View toggle | Grid view (default, responsive 3-4 columns) / List view (table with Priority, Thumbnail, Type, Caption, Last Updated) |
| Photo card | Thumbnail, image type badge (Exterior, Bedroom, Kitchen, etc.), priority number, caption, "Source: Contentful" indicator |
| Hero photo | Priority 0, distinct visual treatment (gold border, "Hero" badge with star icon, slightly taller) |
| Drag-to-reorder | Drag cards to change order. Priority numbers auto-recalculate. Drag handle visible on each card. |

**Save behavior:** Reordering puts the page in a dirty state. "Save Order" persists the new priority sequence. After save, the standard sync banner appears.

**Scope:** Available at both property level and room-type level. Each scope has its own independent photo set and ordering.

---

## 4. Character Limits & Validation Rules

### BDC Composite Message Limits

BDC assembles multiple description types into 3 composite message types, each capped at **1,990 characters**. The UI must show a running total for each composite:

**`welcome_message`** (composed from):
`house` + `interior` + `unique-benefits` + `environment` + `short-introduction` + `headline` + `short-winter-text` + `winter-text` + `why-this-property` + optionally `remarks`

**`neighborhood_info`** (composed from):
`area` + `driving-directions` + `distances`

**`owner_info`** (composed from):
`tips-of-the-owner` + `fine-print` + `additional-costs` + `arrival-days` + `discounts` + `minimum-stay-length` + `opening-hours` + `optional-costs` + `price-table`

**UI pattern:** Show a composite character counter bar (e.g., "welcome_message: 1,247 / 1,990 chars") at the top of each group or as a persistent sidebar indicator. When the total exceeds the limit, show a warning using Kontrol's existing warning/error color tokens (warning state > 90%, error state > 100%). The operator can still save and sync — truncation happens on the NextPax/BDC side — but the warning prevents surprises.

### Airbnb Limits

| Field | Composed From | Limit |
|-------|--------------|-------|
| Summary | `short-introduction` | 500 characters (truncated at last sentence boundary) |

### Expedia Limits

No enforced character limits. English only.

---

## 5. Interaction Patterns

### Save & Sync (two separate actions)

**Save** = persist content to Kontrol (local save). Available at any time.
**Sync** = push saved content from Kontrol → CMB → NextPax → OTAs. Operator-triggered action. Only available after content is saved.

This two-step model is intentional for V1 — it lets operators author and review content without immediately pushing it live. "Draft" state is implicit: saved but not yet synced.

### Optimistic Locking

If another operator modifies the same property's content between when you loaded the page and when you save, show a warning: "This content was modified by [operator] at [timestamp]. Review changes before saving." Use `lastModifiedAt` comparison.

### Diff Indicator

**[SHOULD]** When Konnect content differs from what's currently in NextPax (fetched via GET endpoints), show a diff indicator — e.g., a small dot or "out of sync" badge on the field. Especially important for amenities where locked imported values will be overwritten.

### Channel Applicability Badges

Consistent badge pattern across all screens — each channel gets a visually distinct badge using Kontrol's existing badge component and color tokens:
- **BDC** — Booking.com
- **Airbnb** — Airbnb
- **Expedia** — Expedia
- No badge = not consumed by any active channel (de-emphasize the field)

### Empty State

New properties with no content yet should show a clear empty state: "No descriptions authored yet. Start with the core types used by all channels." with a visual indicator pointing to `house`, `remarks`, `fine-print`, `short-introduction`.

### Property vs. Room Type Scope

Scope is handled by the sidebar tree navigation (see Section 2). Each room type has its own independent set of descriptions, amenities, and photos.

### Property-to-Room-Type Content Cascade

On property-level Descriptions and Amenities pages, a secondary action "Save & Apply to Room Types" copies property content to all room types as a draft baseline. A confirmation dialog lists all room types with checkboxes — room types with existing content show an overwrite warning and can be unchecked to skip.

**Draft state:** After cascade, room-type content enters a "draft" state shown with a yellow "Draft — inherited from property, review and save to confirm" banner. The draft indicator clears when a user explicitly saves at the room-type level. The Channel Readiness panel shows draft items as ⚠️ (needs review), not ✅.

### Channel-Specific Room Type Name Overrides

On each room type's Overview page, optional text fields allow overriding the room type display name per channel (Airbnb, Booking.com, Expedia). If left empty, the default Kontrol room type name is used. Character limit indicators shown for channels with constraints (BDC ~100 chars, Airbnb ~50 chars — verify against API docs).

### Channel Field Name Tooltips

On the Descriptions page, hovering over a channel badge shows the actual field name on that channel. Example: hovering over the BDC badge on the `house` description type shows "Maps to: Property Description on Booking.com". Mappings are maintained in `channelFieldNames` in `descriptionTypes.ts`.

---

## 6. Design Constraints

### Match Kontrol's existing design language — from the codebase

Konnect is built inside Kontrol, not as a standalone app. The prototype must look and feel like a native Kontrol screen.

**Before building any UI, inspect the Kontrol codebase to extract the existing design language:**

1. **Component library:** Find the shared/common components directory. Identify the existing button, input, select, toggle, tab, table, modal, badge, and card components. Use them directly — do not create new base components.
2. **Color tokens / theme:** Find the CSS variables, theme file, or Tailwind config that defines Kontrol's color palette. Use those exact tokens for backgrounds, borders, text, accents, and status colors.
3. **Typography:** Identify the font family, size scale, and weight usage from the existing styles or Tailwind config. Match them.
4. **Layout patterns:** Look at 2-3 existing Kontrol property detail screens to understand the page shell: sidebar width, content area max-width, padding/margin conventions, header structure, breadcrumb pattern.
5. **Form patterns:** Find how existing forms handle labels, inputs, validation states, error messages, and save/cancel actions. Replicate those patterns.
6. **Table patterns:** If Kontrol has data tables (it does), match the existing header style, row density, action menus, and pagination pattern.
7. **Status/feedback patterns:** Look at how Kontrol surfaces success, warning, and error states (toasts, inline banners, colored badges). Use the same approach.

**Do not invent new design patterns.** If Kontrol uses a specific tab component, use that tab component. If it uses a specific shade of blue for primary actions, use that blue. The goal is that Konnect screens are indistinguishable from existing Kontrol screens in terms of visual language.

**If a pattern doesn't exist in Kontrol** (e.g., the BDC composite character counter, channel applicability badges), build it using Kontrol's existing primitives — same border radius, same font sizes, same color tokens — so it feels like a natural extension, not a bolt-on.

### Historical reference (2023 Konnect Figma)

A previous Konnect design from 2023 used a standalone platform with its own nav hierarchy (Account → Company → Property), tabbed sections per content type, modal editors, and color-coded channel status badges. These patterns are directionally valid for information architecture, but the visual design should come from the current Kontrol codebase, not from the 2023 Figma.

---

## 7. Data Shapes (for mock data)

### Description entry
```json
{
  "typeCode": "house",
  "language": "EN",
  "text": "Welcome to our modern downtown apartment...",
  "lastModifiedBy": "mel.baker@kasa.com",
  "lastModifiedAt": "2026-03-10T14:30:00Z",
  "lastSyncedAt": "2026-03-10T14:35:00Z",
  "lastSyncStatus": "success"
}
```

### Amenity entry
```json
{
  "typeCode": "A19",
  "label": "Free WiFi",
  "category": "Internet & Technology",
  "attributes": ["Y"],
  "channels": ["BDC", "Airbnb", "Expedia"],
  "isLockedImport": false,
  "seededFromPMS": false
}
```

`seededFromPMS` (optional) — set to `true` when the entry was populated by the
"Import from PMS" flow on the property-level amenity editor. Drives the
"Seeded from PMS" origin chip in the editor. Survives save/edit; stripped on
cascade to room types (room-type entries are authored independently).

### Sync status
```json
{
  "propertyId": "prop-123",
  "nextpaxPropertyId": "NP-456",
  "channels": [
    {
      "channelId": "BOO142",
      "channelName": "Booking.com",
      "contentSyncEnabled": false,
      "disableReason": "Duplicate tax issue (Feb 2026)",
      "lastSyncAt": "2026-02-01T10:00:00Z",
      "lastSyncStatus": "success"
    },
    {
      "channelId": "EXP270",
      "channelName": "Expedia",
      "contentSyncEnabled": false,
      "disableReason": "Never enabled",
      "lastSyncAt": null,
      "lastSyncStatus": null
    },
    {
      "channelId": "AIR298",
      "channelName": "Airbnb",
      "contentSyncEnabled": true,
      "lastSyncAt": "2026-03-15T09:00:00Z",
      "lastSyncStatus": "success"
    }
  ]
}
```

### Property with room types
```json
{
  "propertyId": "prop-123",
  "propertyName": "Kasa 2nd Street Austin",
  "roomTypes": [
    {
      "id": "rt-001",
      "name": "Studio Suite",
      "internalTitle": "Studio Apartment A",
      "nickname": null,
      "setupInfo": "Studio",
      "maxOccupancy": 2,
      "channelLinks": [
        { "channel": "Airbnb", "url": "...", "listingId": "ABB-8847231" },
        { "channel": "BDC", "url": "..." },
        { "channel": "Expedia", "url": "..." }
      ]
    }
  ]
}
```

### Photo entry (sourced from Contentful, ordering managed in Konnect)
```json
{
  "id": "ph-1",
  "imageType": "exterior",
  "imageTypeLabel": "Exterior",
  "caption": "Building facade from 2nd Street",
  "priority": 0,
  "lastUpdated": "2026-03-01T10:00:00Z",
  "contentfulId": "ctfl-a1b2c3"
}
```

---

## 8. Claude Code Prototype Prompt

> **Paste this as your starting prompt in Claude Code. The prototype brief document should be in a reference folder accessible during the session.**
>
> **Build:** A UI prototype for Konnect V1 — a content management interface inside Kontrol (Kasa's PMS) that lets the Distribution team author property descriptions and amenities, see which OTA channels each field maps to, and manage content sync status. This is a prototype for stakeholder review, not a production build.
>
> **Reference:** Read the Konnect V1 Prototype Brief (in the reference folder) for the complete screen inventory, field tables, interaction patterns, data shapes, and character limit rules. That document is the single source of truth for what to build.
>
> **Design — match Kontrol's existing design language:** Before building any screens, inspect the Kontrol codebase to extract the existing design system. Find the shared component library (buttons, inputs, tabs, toggles, tables, modals, badges), color tokens / theme variables, typography scale, and layout conventions. Use Kontrol's existing components and styles directly. Do not invent new design patterns — Konnect screens should be visually indistinguishable from existing Kontrol screens. See Section 6 of the prototype brief for the full checklist of what to extract from the codebase.
>
> **Screens to build:**
> 1. **Property content view** with tabs for Descriptions, Amenities, and Sync Status, plus a property/room-type selector
> 2. **Descriptions tab** — vertically stacked description type cards grouped by priority (Core → BDC Supplementary → BDC Specialized), each showing: type label, channel badges (BDC, Airbnb, Expedia), text area, character counter, and BDC composite message running totals
> 3. **Amenities tab** — grouped categories with toggles/checkboxes, channel badges, attribute inputs for non-boolean amenities, and a lock icon indicator for imported amenities
> 4. **Sync Status tab** — channel status cards (BDC/Expedia/Airbnb), sync trigger button, recent sync log, and contextual warning banners
>
> **Key interactions:** Two-step save/sync flow (save locally, then sync to push), BDC composite character counter bars with warning at >90%, property vs. room-type toggle, channel applicability badges on every field, empty states for new properties, diff indicator when Konnect content differs from NextPax.
>
> **Mock data:** Use the data shapes from Section 7 of the prototype brief. Include at least 2 mock properties with 2-3 room types each, and populate 5-6 description types with sample content.
>
> **What success looks like:** A stakeholder can click through the prototype and understand: (a) where content lives, (b) how descriptions are organized by type and channel, (c) how character limits are surfaced, (d) how amenities are managed, and (e) what the sync workflow looks like. It should feel like a natural part of Kontrol, not a separate app.

---

## Appendix: What's NOT in this document (and why)

The following topics are covered in the full PRD (KNT-001 v4) but are intentionally excluded from this prototype brief because they don't affect what screens to build:

- **CMB pipeline architecture** (data providers, transformers, SQS queues, versioned entities) — backend concern
- **NextPax Supply API endpoint details** — backend concern
- **Reverse pull / content seeding infrastructure** — separate workflow, not part of the content management UI
- **Rollout plan & phasing** (Phase 0-6) — operational planning
- **Dependencies & open questions** — project management
- **Risk matrix** — project management
- **Decision log** — project governance
- **BDC duplicate tax issue details** — external blocker, surfaced in UI only as a warning banner
- **Policy data model (V2)** — deferred, not in prototype scope
- **Kontrol database patterns & proposed collections** — backend concern
