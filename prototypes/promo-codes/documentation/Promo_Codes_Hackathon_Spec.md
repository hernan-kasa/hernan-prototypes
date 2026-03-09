# Promo Codes — Hackathon Build Spec

**Project:** 2026 Engineering Hackathon — Race Control Initiative
**Author:** Hernan Perla
**Date:** February 13, 2026
**Coding Window:** February 23–25 (2 days)

---

## Problem Statement

Kasa has no self-service system for managing promo codes. Codes are currently hard-coded in a database by tech ops, with no admin UI, no clear data model, and no integration with the broader revenue tooling stack. Marketing can't create campaign codes without filing tech requests, Revenue can't set expiration rules, and GX agents deal with confusing behavior (codes silently failing for certain stay lengths due to hidden rate plan exclusions). This project builds a standalone promo code service from scratch.

## Goals

1. **Self-service promo code management** — Revenue, Marketing, and Ops can create, edit, and deactivate promo codes without tech ops involvement
2. **Rate plan stacking controls** — Rate plans dictate which promo codes are valid (all, none, allowlist, blocklist)
3. **Clean checkout UX** — Guests on kasa.com can enter and validate promo codes with clear feedback
4. **GX agent support** — Agents can apply promo codes in Reservation Creator, governed by the same stacking rules
5. **Demo-ready in 2 days** — Standalone service that can be presented in a 10-minute hackathon demo

## Non-Goals

- **OTA/NextPax integration** — Promo codes are direct-only. No channel manager work needed.
- **Promotions integration** — Promotions (auto-applied) are a separate system being built in H1. No wiring between the two for now.
- **Migration of existing codes** — We're building fresh, not migrating the current hard-coded database.
- **Production deployment** — This is a hackathon demo. Production placement (RCS, Price API, etc.) is decided later.
- **Analytics dashboards** — Usage tracking is P1, not P0.

---

## User Stories

### Revenue Manager / Marketing

- As a **Revenue Manager**, I want to create a promo code with a percentage or dollar-amount discount so that I can run targeted campaigns without filing a tech ops request.
- As a **Marketing Manager**, I want to set expiration dates on promo codes so that campaign codes auto-deactivate and don't become evergreen liabilities.
- As a **Revenue Manager**, I want to assign promo codes to specific properties so that codes are scoped to the right inventory.
- As a **Revenue Manager**, I want to control stacking at the rate plan level (all codes valid / no codes / allowlist / blocklist) so that I have precise control over which discounts combine.

### Guest

- As a **Guest**, I want to enter a promo code at checkout on kasa.com and immediately see the discount applied so that I know my code worked before completing my booking.
- As a **Guest**, I want clear error messages when a code is invalid, expired, or doesn't apply to my booking so that I'm not confused.

### GX Agent

- As a **GX Agent**, I want to apply a promo code when creating a reservation in Kontrol so that I can honor codes for guests who call in.
- As a **GX Agent**, I want to see which promo codes are active for a property so that I can assist guests without guessing.

---

## Requirements

### P0 — Must-Have (Hackathon Demo)

**Promo Code Data Model**

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | Primary key |
| `code` | string | Unique, case-insensitive, guest-facing |
| `name` | string | Internal display name |
| `discount_type` | enum | `percentage` or `fixed_amount` |
| `discount_value` | decimal | e.g., 15 for 15% or 50 for $50 |
| `status` | enum | `active`, `inactive` |
| `property_ids` | UUID[] | Which properties this code applies to |
| `valid_from` | datetime | nullable — null means always valid |
| `valid_until` | datetime | nullable — null means no expiration |
| `max_uses` | integer | nullable — null means unlimited |
| `current_uses` | integer | Tracks redemptions |
| `min_booking_amount` | decimal | nullable — null means no minimum |
| `created_at` | datetime | |
| `updated_at` | datetime | |

*Acceptance criteria:* CRUD operations work. Code uniqueness enforced. Status toggle works.

**Rate Plan Stacking Configuration**

| Field | Type | Notes |
|-------|------|-------|
| `rate_plan_id` | UUID | FK to rate plan |
| `promo_code_policy` | enum | `all`, `none`, `allowlist`, `blocklist` |
| `promo_code_ids` | UUID[] | Only used when policy is `allowlist` or `blocklist` |

*Acceptance criteria:* When validating a promo code, the system checks the rate plan's stacking policy and returns an appropriate accept/reject.

**Validation API**

```
POST /api/promo-codes/validate
{
  "code": "SUMMER25",
  "property_id": "uuid",
  "rate_plan_id": "uuid",
  "booking_amount": 500.00,
  "check_in": "2026-03-01",
  "check_out": "2026-03-05"
}

→ 200 { "valid": true, "discount_type": "percentage", "discount_value": 15, "name": "Summer Sale" }
→ 400 { "valid": false, "reason": "Code expired" | "Not valid for this rate plan" | "Minimum booking amount not met" | ... }
```

*Acceptance criteria:* Validates code existence, status, date range, property, rate plan stacking policy, usage limits, and min booking amount. Returns clear error reasons.

**Admin UI (Kontrol)**

- Table view of all promo codes with status, discount, dates, usage count
- Create/edit form with all P0 fields
- Activate/deactivate toggle
- Property selector (multi-select)

*Acceptance criteria:* Admin can create a code, assign it to properties, set restrictions, and toggle status without touching the database.

**Checkout Integration (kasa.com)**

- Promo code input field at checkout (visible, well-styled — not tiny blue text)
- Real-time validation on submit (calls validation API)
- Success state: show discount amount and adjusted total
- Error state: show specific reason the code didn't work
- Remove code option

*Acceptance criteria:* Guest enters code → sees discount reflected in total OR sees a clear error message.

### P1 — Nice-to-Have (If Time Allows)

- **Single-use vs. multi-use enforcement** with `max_uses` tracking
- **Min booking amount** validation
- **New vs. returning booker targeting** (requires knowing if the guest has booked before)
- **Reservation Creator integration** — GX agents see active codes and can apply them
- **Usage log table** — Track which reservation used which code

### P2 — Future (Post-Hackathon)

- Bulk code generation for campaigns
- Campaign performance analytics
- Email/marketing platform integration
- Stacking with promotions (when promotions ship)
- Production service placement decision (RCS vs. Price API vs. standalone)

---

## Technical Architecture

### Stack (Standalone Service)

```
┌─────────────────────────────────────┐
│           Kontrol Admin UI          │  ← React (existing Kontrol patterns)
├─────────────────────────────────────┤
│          Promo Code API             │  ← REST API (Node/Express or Python/FastAPI)
├─────────────────────────────────────┤
│          PostgreSQL                 │  ← Standalone DB
└─────────────────────────────────────┘
         ↑                    ↑
    kasa.com checkout    Reservation Creator
    (validate endpoint)  (validate + list endpoints)
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/promo-codes` | List all codes (admin) |
| `GET` | `/api/promo-codes/:id` | Get code details (admin) |
| `POST` | `/api/promo-codes` | Create code (admin) |
| `PUT` | `/api/promo-codes/:id` | Update code (admin) |
| `PATCH` | `/api/promo-codes/:id/status` | Toggle active/inactive (admin) |
| `POST` | `/api/promo-codes/validate` | Validate code for booking context |
| `GET` | `/api/promo-codes/property/:id` | List active codes for property |
| `GET` | `/api/rate-plans/:id/promo-policy` | Get stacking policy |
| `PUT` | `/api/rate-plans/:id/promo-policy` | Set stacking policy |

### Validation Logic (Waterfall)

```
1. Does the code exist? → "Invalid promo code"
2. Is the code active? → "This promo code is no longer active"
3. Is today within valid_from / valid_until? → "This promo code has expired" or "not yet valid"
4. Does property_ids include the booking's property? → "Not valid for this property"
5. Does the rate plan allow this code? (check stacking policy) → "Not valid with this rate plan"
6. Is max_uses exceeded? → "This promo code has reached its usage limit"
7. Is booking_amount >= min_booking_amount? → "Minimum booking of $X required"
8. ✅ Return discount details
```

---

## Demo Script (10 minutes)

1. **Problem statement** (1 min) — Show the current tiny blue "promo code" text at checkout, explain the tech ops bottleneck
2. **Admin walkthrough** (3 min) — Create a promo code in Kontrol, assign to a property, set a 20% discount with an expiration date
3. **Rate plan stacking** (1 min) — Show configuring a rate plan to blocklist a specific code
4. **Guest checkout flow** (3 min) — Go to kasa.com, search a property, go to checkout, enter the code, show discount applied. Then try the blocklisted rate plan, show the error.
5. **Architecture & next steps** (2 min) — Show the standalone service diagram, explain how it fits into Race Control, path to production

---

## Success Metrics

**Leading (demo day):**
- End-to-end flow works: create code → apply at checkout → see discount
- Stacking rules enforced correctly
- Error messages are clear and specific

**Lagging (if productionized):**
- Reduction in tech ops tickets for coupon code requests (target: 100% elimination)
- Time to create a new promo code (target: < 2 minutes vs. current "file a ticket and wait")
- Promo code redemption rate on kasa.com campaigns

---

## Open Questions

- **[Engineering]** What's the auth pattern for Kontrol admin APIs? Need to match existing patterns for the admin UI.
- **[Engineering]** What React component library / design system does Kontrol use? Need to match for the admin UI.
- **[Design]** Should the checkout promo code field be above or below the price summary? Current placement is below and easy to miss.
