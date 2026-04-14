# CLAUDE.md — Persistent Instructions

## Who You're Working With

- Hernan, non-technical PM at Kasa (hospitality company)
- Gives product direction in plain language — never touches code
- Validates work visually (screenshots, running the app), not by reading code

## Working Style

- When asked to "spin up" or "start" a dev server, run the command directly with Bash — don't tell Hernan to do it manually
- When asked for output, exports, or documentation, always save to a file — don't print a summary in chat unless explicitly asked for one
- Use existing client libraries and patterns found in the codebase — don't use direct REST calls unless no client exists
- Feature requests come as: **[what I want]** + **[where it appears]** + **[how it should behave]**
- If two reasonable options exist, pick one and flag it — don't block on a decision I didn't ask to make

## Session Protocol

### Start of Session
1. Read this file
2. Read `documentation/spec.md` for the active prototype — treat it as source of truth
3. Wait for the Session Brief: what exists, desired end state, spec reference, out of scope

### During Session
- Log every assumption where the spec is ambiguous
- If a request is ambiguous, ask **one** clarifying question before building

### End of Session — Produce a Closeout
Save a closeout markdown file to the prototype's `documentation/closeouts/` folder with:
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

## Starting a New Prototype

1. Hernan provides the prototype name and high-level idea
2. Claude Code scaffolds the folder: `prototypes/<name>/` with `documentation/`, `src/`, `package.json`, `vite.config.ts`, and adds the SPA redirect to `netlify.toml`
3. Hernan moves the spec file into `prototypes/<name>/documentation/`
4. Claude reads the spec and building begins

## Development & Deployment Workflow

Hernan builds prototypes locally with Claude Code, then deploys via GitHub → Netlify:

1. **Build locally** — Claude Code writes the code; Hernan validates visually by running the dev server
2. **Commit & push to GitHub** — When the prototype is ready, commit changes and push to `main`
3. **Netlify auto-deploys** — Netlify watches the `main` branch; every push triggers a build
   - Netlify runs `npm run build` (which executes `build.mjs`)
   - `build.mjs` installs + builds every prototype under `prototypes/` and assembles output into `dist/`
   - Netlify publishes the `dist/` folder
4. **Live at** https://hernan-prototypes.netlify.app — each prototype is available at `/<name>/`

Key files in this workflow:
- `build.mjs` — root build script that builds all prototypes
- `netlify.toml` — Netlify config (build command, publish dir, SPA redirects)
- `public/index.html` — landing page linking to all prototypes

When adding a new prototype, also add a SPA redirect entry in `netlify.toml`.

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
