# Promo Codes — Product Research

> This document compiles all known context about promo codes at Kasa, drawn from the Race Control product spec, meeting transcripts, Slack conversations, and Notion documentation. Use this as the research foundation for writing product specs related to promo code functionality.

---

## Where Promo Codes Sit in the Pricing Architecture

Kasa has four distinct pricing concepts, each serving a different purpose. Promo codes are one of them.

### Rate Plans

The base pricing structure. After the Rate Calendar Service migration, every property has two rate plans: Standard and Non-Refundable. Both incorporate length-of-stay pricing via LOS records. Configured by Revenue Managers. Active on all channels (direct + OTA). Rate plans are the foundation everything else stacks on top of.

### Negotiated Rates

Corporate and group rates managed by Sales. Available on direct + GDS channels. Can be static rate calendars or percentage-off the standard rate. Contracted for specific time periods. No active development in H1 2026.

### Promotions

Auto-applied discounts visible to all guests. No code entry required. Applied at the property level — all room types at a property are included (with the option to exclude at the rate plan level in a future version). Only one active promotion per room type. Guests cannot opt out. Active on both direct and OTA channels, which means promotions must be consistently configured across all distribution to avoid parity issues. Currently being built in H1 2026 with NextPax Promotions API integration. Control (Kontrol) will be the source of truth, not NextPax.

### Promo Codes

Guest-entered discount codes. Targeted at specific/selected guest segments. **Direct channel only** (kasa.com), which means no OTA parity risk and no NextPax integration needed. Can be percentage-off OR static dollar amounts (promotions are percentage-only on OTAs). Stacks on top of rate plans, with stacking behavior controlled by the rate plan. No active development as of February 2026.

### Comparison Table

| Dimension | Rate Plan | Negotiated Rate | Promotion | Promo Code |
|-----------|-----------|-----------------|-----------|------------|
| **Audience** | All guests | Corporate & Group | All guests | Selected guests |
| **Owner** | Revenue Managers | Sales | Marketing & RMs | Marketing & RMs |
| **Channels** | Direct & OTA | Direct & GDS | Direct & OTA | Direct only |
| **Discount Type** | Passthrough from RMS | Static calendars or % off | % off (auto-applied) | % off OR static $ |
| **Active Period** | Always | Contract period | Event period | Always and/or expiration |
| **Stacking** | N/A (base layer) | No | Yes (on rate plans) | Yes (controlled by rate plan) |
| **OTA Parity Risk** | High | N/A | High | Low |
| **Guest Action** | None (displayed options) | Booking code / URL | None (auto-applied) | Enter code at checkout |

### Rate Lifecycle

Understanding where promo codes are applied in the pricing pipeline:

```
Base rate from RMS (Duetto)
  → Length-of-stay modifiers (Rate Calendar Service / LOS records)
    → Rate plan modifiers (channel markups, negotiated rates)
      → Promotions (auto-applied discounts)
        → Promo codes (guest-entered discounts) ← THIS PROJECT
```

---

## Current State of Promo Codes

### How It Works Today

The current promo code system has significant limitations:

**Hard-coded database.** Coupon codes are managed in a hard-coded database by tech ops. There is no self-service UI for business users to create or manage codes.

**No clear data model.** The backing data store is opaque. There's no documented schema, and the system's capabilities are poorly understood outside of the engineers who maintain it.

**Checkout placement.** The promo code entry field exists at checkout on kasa.com. It appears as small blue text that doesn't look like a clickable element — guests often miss it entirely.

**Direct channel only.** Promo codes only work on kasa.com, not on OTAs. This is actually an advantage: it means there's zero OTA parity risk, and the implementation scope is contained.

**Terminology confusion.** The checkout screen says "promo code" but internally most teams say "coupon code." Additionally, rate plan booking codes (entered via the `eventCode` URL parameter) are an entirely different mechanism but are frequently confused with promo codes. On the checkout screen, only coupon codes work in the promo code field — rate plan event codes do not.

### Known Issues

**Tech ops bottleneck.** All code creation requires tech ops involvement. Marketing and Revenue teams cannot self-serve, leading to delays and overhead for simple campaign codes.

**Rate plan exclusion confusion.** Coupon codes are excluded from certain rate plans (e.g., STY7 for 7+ night stays, NRF for non-refundable). This means a code can work for 1–6 night stays and 14+ night stays but silently fail for 7–13 nights. There is no user-facing explanation for why the code fails — it just doesn't work.

**Duplicate code bugs.** There have been incidents where two coupon codes existed with the same code string but different restriction configurations (e.g., one with a 1-night minimum, another with a 2-night minimum), causing unpredictable behavior depending on which record the system hit first.

**No expiration enforcement.** Codes can become evergreen liabilities because there's no auto-expiration mechanism. Revenue and Marketing teams want time-boxed codes that automatically deactivate.

**Rate plan workarounds.** Because the promo code system is limited, teams have been using rate plans with `eventCode` URL parameters as a workaround for promotion-like functionality. This creates separate rate plan options in the booking flow rather than applying discounts to existing rates, which is confusing to guests and adds configuration overhead for Revenue Managers.

---

## Stakeholder Requirements

### From the Dec 2025 Pricing Strategy Meeting

Key decisions and open questions about promo codes discussed with Revenue, Marketing, and Product:

- Promo codes should support both **percentage-off** and **static dollar amount** discounts
- **Stacking behavior should be dictated by the rate plan.** Four modes were agreed upon: valid with all codes, not valid with any code, only valid with certain codes (allowlist), or excludes certain codes (blocklist)
- Michelle, Kelly, and Ravni were assigned to determine operational ownership of stacking rules
- Coupon code entry at checkout was deemed acceptable placement, but the UI needs improvement
- The current blue text is too small and doesn't look clickable — needs to be a proper input field

### From the Race Control Spec

The Race Control spec identifies these desired capabilities:

- **Promo Code Management UI:** A dedicated interface for creating and managing promo codes, separate from rate plans
- **Audience targeting:** Ability to target new vs. returning bookers
- **Discount flexibility:** Both percentage-off and static dollar amount
- **Time controls:** Always-on codes and/or expiration dates
- **Usage limits:** Single-use vs. multiple-use codes
- **Minimum booking amount:** Minimum spend requirements
- **Custom date ranges:** Booking window restrictions
- **Stacking controls:** Configurable interaction with rate plans (all/none/allowlist/blocklist)

### From the Race Control Spec — Restriction Capabilities

The spec identifies these restriction types for promo codes:

- New vs. returning booker targeting
- Custom date ranges (valid from / valid until)
- Minimum booking amount thresholds
- Single-use vs. multiple-use enforcement

### From the Race Control Spec — Use Cases

- Email marketing campaigns
- Returning guest incentives
- Kasa special events and partnerships

### From Marketing & Revenue (Slack Conversations)

- Marketing wants coupon codes for email campaigns with **measurable ROI** — they need usage tracking
- Revenue Managers want **time-boxed codes** that auto-expire to avoid evergreen discount liabilities
- GX agents need **visibility into active codes** when handling guest inquiries and manual reservations
- Operations teams need **self-service code creation** without requiring tech ops tickets
- Need for clear **naming consistency** — standardize on "promo code" across all touchpoints

---

## Meeting Transcript Insights

### Promotions Product Walkthrough (Jan 2026)

This meeting between Hernan (Product) and Bill (Engineering) established the clear distinction between promotions and promo codes:

> "Promo codes will eventually be on the fold, but the next most impactful one is the promotions."

Key points relevant to promo codes:
- Promo codes are explicitly called out as a future phase after promotions ship
- The promotions system is being built to align with NextPax's API capabilities — promo codes do NOT need this alignment since they're direct-only
- Rate Calendar Service is the foundation. Only one property has been migrated so far, with more coming
- The website is being migrated to React, which will support new promo code checkout UX
- Reservation Creator recently moved rate plan selection to the Financial Settings page — promo code application should live there too

### CASA.com Rate Standardization Meeting (Aug 2025)

This meeting between Hernan and the design team established the broader pricing simplification context:

- kasa.com is moving from three rate options (Standard, Non-Refundable, Stay Longer & Save) down to two (Standard and Non-Refundable) with LOS pricing baked in
- Promotions will appear as stacked discounts on these two options, not as separate rate plan options
- Promo codes follow the same philosophy — they should be discounts applied to existing rate plan options, not separate booking options
- A new promotions wizard was discussed for Control. A similar pattern would apply to a promo code management UI.

### E-blast Campaign Discussion (Aug 2025, Slack)

A conversation between Marketing (Miles, Laura) and Revenue (Anne) revealed real-world friction:

- Anne Willis explicitly noted: "there is confusion around promo vs coupon code because on the checkout screen it says promo code but in reality only coupon codes can go there"
- The team was using rate plans with `eventCode` URL parameters as a workaround for campaign discounts
- Anne described the shift: "This is our switch to the rate plan versions and get away from those coupon codes"
- Laura flagged that naming inconsistency is confusing: the internal code name (e.g., "ENDOFSUMMER") didn't match the guest-facing campaign name ("Stay Longer & Save")
- Miles flagged that promo codes are risky because "they are evergreen if we don't address them timely"

### Tech Ops Coupon Issue (Feb 2026, Slack)

A recent conversation in #techops-and-it-requests revealed ongoing operational issues:

- A group booking needed a coupon code for 7–13 night stays, but the standard rate plan (which allows coupon codes) only displays for stays of 6 nights or fewer
- For 7–13 nights, only NRF and STY7 rate plans are available, and both have promo codes excluded
- The 14+ night rate plan (STY14) does allow promo codes, creating an inconsistent gap
- The workaround suggested was creating a custom rate plan with a booking code — further evidence that the current system pushes people toward rate plan workarounds instead of proper promo code functionality

---

## Technical Context

### Key Systems

**Rate Calendar Service (RCS):** New source of truth for all rates. Stores length-of-stay records. Currently migrating properties (only 1 completed as of Jan 2026). Manages base pricing that promo codes would discount against.

**Kontrol (Control):** Internal PMS. Rate plan management lives here. Source of truth for promotions. Logical home for promo code management UI. Reservation Creator is part of Kontrol.

**NextPax:** Channel manager for OTA distribution. Has a Promotions API that the promotions project is integrating with. **Not needed for promo codes** since they're direct-only.

**kasa.com (CASA):** Direct booking website. React. Currently has a coupon code entry field at checkout. This is where guests would enter promo codes.

**Price API / Price Options:** Service that surfaces pricing to the website. Promo code discount calculation would need to integrate at this layer or similar.

**Reservation Creator:** Internal tool in Kontrol for GX agents to create reservations. Rate plan selection recently moved to the Financial Settings page. GX agents can already apply coupon codes today — this capability should be preserved and improved.

**Duetto:** Revenue Management System. Provides base rates via rate codes and subrates. Not directly relevant to promo codes but is the upstream source for the rates that promo codes discount.

### Direct-Only Advantage

The fact that promo codes are direct-channel only is a significant architectural simplification:

- No NextPax integration required
- No OTA parity risk (OTAs won't see these discounts)
- No need to align with Booking.com/Expedia/Airbnb promotion constraints
- Can support features OTAs don't (static dollar amounts, not just percentages)
- Implementation is contained to kasa.com + Kontrol + Price API

---

## Decisions Made

| Decision | Answer | Source |
|----------|--------|--------|
| Terminology | "Promo codes" — guest-facing and internal | Product decision, Feb 2026 |
| Stacking model | Rate plan dictates. Four modes: all codes valid, no codes valid, allowlist, blocklist | Dec 2025 pricing meeting + Product decision |
| Website target | React codebase | Website migration in progress |
| Reservation Creator | GX agents can apply promo codes, governed by rate plan stacking rules | Existing capability, confirmed Feb 2026 |
| OTA integration | Not needed — promo codes are direct-only | Race Control spec |
| Promotions interaction | Separate concepts. No integration required between the two systems. | Jan 2026 promotions walkthrough |
| Discount types | Percentage-off AND static dollar amounts | Dec 2025 pricing meeting |

## Open Questions

| Question | Owner | Context |
|----------|-------|---------|
| Where should the promo code service live permanently? | Engineering | Options: within RCS, within Price API, or standalone microservice |
| What does the current hard-coded coupon database look like? | Engineering | Schema and existing data need to be understood for migration planning |
| Should promo codes apply to all rate plans by default, or require explicit opt-in? | Product + Revenue | Related to the stacking policy — what's the default for a new rate plan? |
| Checkout field placement — above or below price summary? | Design | Current placement below the summary is easy to miss |
| Who owns promo code creation operationally? | Revenue + Marketing | Need to determine RACI for code lifecycle management |

---

## Sources

### Notion Pages
- Race Control Spec — Main product spec with pricing concepts table and promo code requirements
- Promotions - Product Walkthrough (Jan 2026) — Key distinction between promotions and promo codes
- Nextpax Promotions API Integration Planning (Aug 2025) — Channel integration context
- Centralized Promotion Management System Design (Aug 2025) — Promotions system design
- CASA.com Rate Standardization and Promotions System Design (Aug 2025) — Rate simplification context

### Meeting Transcripts
- Pricing Strategy & Development Roadmap Discussion (Dec 2025)
- Promotions - Product Walkthrough (Jan 2026)
- Rate Plan Standardization and Length of Stay Records Strategy
- Promotions Restructuring Plan
- Rate Plan Standardization Strategy Meeting
- Promotions and Rate Parity Project Discussion
- Guest-facing Design Crit
- Rate Plan Discussion

### Slack Conversations
- #techops-and-it-requests — Coupon code rate plan exclusion issues (Feb 2026)
- #bas-eblast-aug25 — Promo code vs coupon code confusion, eventCode workaround (Aug 2025)
- #bugs — Duplicate coupon code bug report (Jun 2023)
