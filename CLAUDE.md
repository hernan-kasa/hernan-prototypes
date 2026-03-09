# CLAUDE.md — Persistent Instructions

## Who You're Working With

- Hernan, non-technical PM at Kasa (hospitality company)
- Gives product direction in plain language — never touches code
- Validates work visually (screenshots, running the app), not by reading code

## Session Protocol

### Start of Session
1. Read this file
2. Read `documentation/spec.md` for the active prototype — treat it as source of truth
3. Wait for the Session Brief: what exists, desired end state, spec reference, out of scope

### During Session
- Feature requests come as: **[what I want]** + **[where it appears]** + **[how it should behave]**
- Log every assumption where the spec is ambiguous
- If two reasonable options exist, pick one and flag it
- If a request is ambiguous, ask **one** clarifying question before building

### End of Session — Produce a Closeout
- **Assumption Log** — decisions made without explicit spec guidance
- **What Was Built** — summary of completed work
- **What's Broken or Incomplete** — known issues or unfinished items
- **Suggested Spec Updates** — things the spec should be updated to reflect
- **Next Session Starting Point** — where to pick up next time

### Spec Maintenance
- Update `documentation/spec.md` with any spec changes confirmed during the session

## Repo Structure

```
hernan-prototypes/
  build.mjs              # Builds all prototypes into dist/
  netlify.toml           # Netlify config
  public/index.html      # Landing page linking to all prototypes
  prototypes/
    <name>/              # Each prototype is a standalone Vite + React app
      documentation/     # Spec and research docs
      src/
```

- Each prototype has its own `package.json`, `vite.config.ts`, and `documentation/`
- Root `build.mjs` builds all prototypes and assembles them under `dist/<name>/`
- Deployed to Netlify at https://hernan-prototypes.netlify.app

## Kasa Domain Context

Hernan's work spans:
- **Revenue Management** — Duetto, RCS, PricePulse
- **Channel Management** — Booking.com, Expedia, Airbnb, NextPax
- **Financial Tooling** — Kontrol, ledgers, reconciliation

Use this context when naming things, modeling data, or making implementation decisions.

## Terminology

| Term | Meaning |
|------|---------|
| BAR | Best Available Rate (transient segment) |
| NRF | Non-Refundable Rate |
| RCS | Rate Calendar Service |
| OTA | Online Travel Agency (Booking.com, Expedia, Airbnb) |
| Access code | Gates visibility to a rate |
| Promo code | Applies a discount |
