# Promo Codes — Project Context for Claude

> This document is the single source of truth for the Promo Codes hackathon project. It contains all research, decisions, architecture, and specs needed to build the system. Feed this into your Claude project so every conversation has full context.

---

## What This Project Is

We're building a standalone promo code service for Kasa during the 2026 Engineering Hackathon (Feb 23–25, 2 coding days). This is part of the larger Race Control initiative (formerly "Guest-Centric Pricing") that aims to simplify how pricing is configured and displayed across all channels.

Promo codes are one of four pricing concepts at Kasa: rate plans, negotiated rates, promotions, and promo codes. Promotions (auto-applied discounts) are a separate system being built in H1 2026 by another team. This project is exclusively about promo codes — codes that guests manually enter.

## Why It Matters

Today, promo codes are managed in a hard-coded database by tech ops. There is no admin UI, no clear data model, and no self-service capability. Marketing files tech requests to create campaign codes. Revenue managers can't set expiration rules. GX agents deal with codes silently failing due to hidden rate plan exclusions. The checkout UX on kasa.com shows a tiny blue "promo code" text that doesn't look clickable.

---

## Key Decisions (Resolved)

| Decision | Answer | Context |
|----------|--------|---------|
| Terminology | "Promo codes" everywhere | Guest-facing and internal. Not "coupon codes." |
| Stacking model | Rate plan dictates | Four modes: all codes valid, no codes valid, allowlist, blocklist |
| Data model | New standalone service | Fresh build with its own PostgreSQL database. Not migrating existing data. |
| Website target | React | kasa.com is being migrated to React. Build against the React codebase. |
| Reservation Creator | Yes, GX agents can apply promo codes | Governed by the same rate plan stacking rules |
| OTA integration | Not needed | Promo codes are direct-channel only (kasa.com). No NextPax work. |
| Promotions integration | Out of scope | Promotions and promo codes are separate concepts. No wiring for the hackathon. |
| Production placement | TBD post-hackathon | Standalone for demo. Where it permanently homes (RCS, Price API, etc.) decided later. |

---

## The Four Pricing Concepts at Kasa

Understanding where promo codes sit in the broader system:

**Rate Plans** — The base pricing structure. Standard and Non-Refundable are the two rate plans post-RCS migration. Configured by Revenue Managers. Active on all channels (direct + OTA). Length-of-stay discounts are baked into rate plans via Rate Calendar Service.

**Negotiated Rates** — Corporate and group rates. Managed by Sales. Available on direct + GDS. Static calendars or percentage-off. No active development in H1 2026.

**Promotions** — Auto-applied discounts visible to all guests. No code entry. Applied at property level. Active on direct + OTA. Being built in H1 2026 with NextPax integration. Only one active promotion per room type. Cannot be opted out of.

**Promo Codes** — Guest-entered codes. Targeted at specific/selected guests. Direct channel only. Can be percentage-off OR static dollar amount. Stacks on top of rate plans (controlled by rate plan stacking policy). No active development — this is the hackathon project.

### Rate Lifecycle (Where Promo Codes Fit)

```
Base rate from RMS (Duetto)
  → Length-of-stay modifiers (Rate Calendar Service)
    → Rate plan modifiers (channel markups, negotiated rates)
      → Promotions (auto-applied, being built H1 2026)
        → Promo codes (guest-entered, THIS PROJECT)
```

---

## Data Model

### `promo_codes` table

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `code` | string | Unique, case-insensitive, guest-facing |
| `name` | string | Internal display name |
| `discount_type` | enum | `percentage` or `fixed_amount` |
| `discount_value` | decimal | e.g., 15 for 15% or 50.00 for $50 |
| `status` | enum | `active`, `inactive` |
| `property_ids` | UUID[] | Which properties this code applies to |
| `valid_from` | datetime | nullable — null means always valid |
| `valid_until` | datetime | nullable — null means no expiration |
| `max_uses` | integer | nullable — null means unlimited |
| `current_uses` | integer | Tracks redemptions, starts at 0 |
| `min_booking_amount` | decimal | nullable — null means no minimum |
| `created_at` | datetime | |
| `updated_at` | datetime | |

### `rate_plan_promo_policies` table

| Field | Type | Notes |
|-------|------|-------|
| `rate_plan_id` | UUID | FK to rate plan |
| `promo_code_policy` | enum | `all`, `none`, `allowlist`, `blocklist` |
| `promo_code_ids` | UUID[] | Only used when policy is `allowlist` or `blocklist` |

### `promo_code_usages` table (P1)

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `promo_code_id` | UUID | FK to promo_codes |
| `reservation_id` | UUID | FK to reservation |
| `applied_discount` | decimal | Actual discount amount applied |
| `applied_at` | datetime | |

---

## API Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `GET` | `/api/promo-codes` | List all codes (admin) | Admin |
| `GET` | `/api/promo-codes/:id` | Get code details (admin) | Admin |
| `POST` | `/api/promo-codes` | Create code (admin) | Admin |
| `PUT` | `/api/promo-codes/:id` | Update code (admin) | Admin |
| `PATCH` | `/api/promo-codes/:id/status` | Toggle active/inactive (admin) | Admin |
| `POST` | `/api/promo-codes/validate` | Validate code for booking context | Public |
| `GET` | `/api/promo-codes/property/:id` | List active codes for property | Admin |
| `GET` | `/api/rate-plans/:id/promo-policy` | Get stacking policy | Admin |
| `PUT` | `/api/rate-plans/:id/promo-policy` | Set stacking policy | Admin |

### Validation Request/Response

```json
// POST /api/promo-codes/validate
// Request:
{
  "code": "SUMMER25",
  "property_id": "uuid",
  "rate_plan_id": "uuid",
  "booking_amount": 500.00,
  "check_in": "2026-03-01",
  "check_out": "2026-03-05"
}

// Success (200):
{
  "valid": true,
  "discount_type": "percentage",
  "discount_value": 15,
  "name": "Summer Sale"
}

// Failure (400):
{
  "valid": false,
  "reason": "Code expired"
}
```

### Validation Logic (Waterfall — order matters)

```
1. Does the code exist?                              → "Invalid promo code"
2. Is the code active?                               → "This promo code is no longer active"
3. Is today within valid_from / valid_until?          → "This promo code has expired" / "not yet valid"
4. Does property_ids include the booking's property?  → "Not valid for this property"
5. Does the rate plan allow this code?                → "Not valid with this rate plan"
   - policy=all → pass
   - policy=none → reject
   - policy=allowlist → code must be in list
   - policy=blocklist → code must NOT be in list
6. Is max_uses exceeded?                              → "This promo code has reached its usage limit"
7. Is booking_amount >= min_booking_amount?            → "Minimum booking of $X required"
8. ✅ Return discount details
```

---

## Architecture

```
┌──────────────────────────────────────────┐
│            Kontrol Admin UI              │  React (match existing Kontrol patterns)
│  - Promo code CRUD table/form            │
│  - Rate plan stacking policy config      │
├──────────────────────────────────────────┤
│            Promo Code API                │  REST (Node/Express or Python/FastAPI)
│  - CRUD endpoints (admin)                │
│  - Validation endpoint (public)          │
├──────────────────────────────────────────┤
│            PostgreSQL                    │  Standalone DB
│  - promo_codes table                     │
│  - rate_plan_promo_policies table        │
│  - promo_code_usages table (P1)         │
└──────────────────────────────────────────┘
         ↑                        ↑
    kasa.com checkout         Reservation Creator
    (validate endpoint)       (validate + list endpoints)
```

This is a standalone service. It does NOT live inside Rate Calendar Service, Price API, or any existing service. Production placement is a post-hackathon decision.

---

## UI Components

### Admin UI (Kontrol)

**Promo Codes List View:**
- Table: code, name, discount, status (active/inactive badge), valid dates, usage count (current/max)
- Actions: create new, edit, toggle status
- Filters: status, property

**Promo Code Create/Edit Form:**
- Code (text input, auto-uppercase)
- Name (text input)
- Discount type (radio: percentage / fixed amount)
- Discount value (number input)
- Properties (multi-select)
- Valid from / Valid until (date pickers, optional)
- Max uses (number input, optional)
- Min booking amount (number input, optional)
- Status (toggle)

**Rate Plan Stacking Policy (within rate plan settings):**
- Policy selector (dropdown: All codes valid / No codes / Only these codes / Exclude these codes)
- When allowlist or blocklist: multi-select of promo codes

### Checkout (kasa.com)

- Prominent promo code input field (not hidden blue text)
- "Apply" button
- Success state: green checkmark, code name, discount amount shown, total updated
- Error state: red text with specific reason
- "Remove" link to clear applied code

---

## Current System Issues (Context for Why This Matters)

These are real problems from Slack and meeting notes that this project solves:

1. **Tech ops bottleneck:** All coupon code creation requires tech ops involvement. Marketing and Revenue can't self-serve.

2. **Rate plan exclusion confusion:** Coupon codes are excluded from STY7 (Stay 7+ nights) and NRF rate plans, meaning codes fail silently for stays between 7-13 nights. The new stacking policy model (all/none/allowlist/blocklist) makes this explicit and configurable.

3. **Duplicate code bugs:** There have been incidents where two coupon codes existed with the same code string but different restrictions, causing unpredictable behavior.

4. **Terminology confusion:** The checkout screen says "promo code" but internally everyone says "coupon code." eventCode URL parameters (for rate plans) add further confusion. We're standardizing on "promo code."

5. **Invisible UX:** The current promo code entry field is blue text that's too small and doesn't look like a clickable element.

6. **No expiration enforcement:** Codes can become evergreen liabilities because there's no auto-expiration. Revenue and Marketing want time-boxed codes.

---

## Hackathon Demo Script (10 minutes)

1. **Problem (1 min):** Show the current tiny blue "promo code" text at checkout. Explain the tech ops bottleneck and rate plan exclusion confusion.

2. **Admin walkthrough (3 min):** Create a promo code "HACKATHON20" in Kontrol — 20% off, assigned to a property, expires in 30 days.

3. **Rate plan stacking (1 min):** Show configuring a rate plan's stacking policy. Set one to "blocklist" that excludes HACKATHON20.

4. **Guest checkout (3 min):** Go to kasa.com, search the property, go to checkout. Enter "HACKATHON20" → see 20% discount applied. Then switch to the blocklisted rate plan → see clear error message "Not valid with this rate plan."

5. **Architecture & future (2 min):** Show the standalone service diagram. Explain how it fits into Race Control alongside promotions. Path to production: service placement, promotions stacking integration, analytics.

---

## What NOT to Build

- No OTA/NextPax integration
- No promotions integration
- No migration of existing hard-coded coupon data
- No analytics dashboards
- No bulk code generation
- No email/marketing platform webhooks
- No A/B testing framework
- No draft/publish workflow for codes

---

## Relevant Kasa Systems (Reference)

- **Rate Calendar Service (RCS):** New source of truth for rates. LOS records. Currently migrating properties (only 1 done).
- **Kontrol:** Internal PMS. Rate plan management lives here. Admin UI for promo codes should live here.
- **NextPax:** Channel manager. Has Promotions API. NOT needed for promo codes (direct-only).
- **kasa.com (CASA):** Direct booking site. React. Promo code entry at checkout.
- **Price API / Price Options:** Surfaces pricing to the website. Promo code discounts would be applied at this layer or similar.
- **Duetto:** Revenue Management System. Provides base rates. Not relevant to promo codes directly.
- **Reservation Creator:** Internal tool in Kontrol for GX agents. Recently moved rate plan selection to Financial Settings page. Promo code application should be here too.
