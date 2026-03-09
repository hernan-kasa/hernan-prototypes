# Kontrol Payment Assigner — Phase 3 Prototype Spec

## 1. Overview

Phase 3 adds a **Manual Payments** view to the existing Kontrol Payment Assigner, which currently handles Stripe-sourced transactions. Manual payments represent non-Stripe funds (ACH, wire, bank deposit) that arrive outside the system and need to be recorded, assigned to reservations, and audited.

## 2. Navigation Structure

The page uses a **dropdown selector** (MUI `Select`, `variant="standard"`) in the top-left to switch between three views:

| View | Data source | Description |
|------|------------|-------------|
| **Unassigned payments** | Stripe | Transactions that could not be auto-matched to a reservation (missing/incorrect confirmation code in metadata) |
| **Group payments** | Stripe | Transactions with a known group confirmation code (e.g. `K-G-ACME1`) from Stripe metadata |
| **Manual payments** | Manual entry | Non-Stripe payments created by ops staff (ACH, wire, bank deposit, other) |

### View-scoped controls
- **"Create Manual Payment" button** — only visible in Manual payments view
- **Audit log chip** — only visible in Manual payments view
- **All Payments / Unassigned Only toggle** — only visible in Manual payments view
- **Settings gear icon** — always visible (placeholder)

## 3. Table Columns

### Stripe views (Unassigned payments + Group payments)

| Column | Content |
|--------|---------|
| Stripe payment ID | `paymentIntentId` as blue monospace link |
| Type | Charge (blue chip) / Refund (orange chip) |
| Status | Success (green chip) / Error (red chip) — from `stripeStatus` field |
| Amount sum | Formatted dollar amount |
| Created at | Date/time string |
| Description | Free text; often contains group code (e.g. `K-G-ACME1`) or `-` |
| Actions | "Assign to reservation(s)" as link text |

### Manual payments view

| Column | Content |
|--------|---------|
| Source | Payment method chip (ACH Transfer, Wire Transfer, Bank Deposit, Other) |
| ID | Generated ID in monospace |
| Type | Charge / Refund chip |
| Status | Active (blue) / Voided (red) |
| Amount | Formatted dollar amount, bold |
| Assigned | "Unassigned" (orange) or "N res." (green) chip |
| Date | Date/time string |
| Description | Reference / memo text |
| Actions | "Assign to reservation(s)" link + Void icon button |

## 4. Manual Payment CRUD

### Create
- Dialog: "Create Manual Payment"
- Fields: Payment Method (select), Amount ($), Date Received (date picker), Reference / Memo (textarea)
- Warning banner: "You are asserting this payment was received..."
- Creates a payment with `source: 'manual'`, `status: 'active'`, `transactionType: 'charge'`
- Logged in audit trail

### Void
- Confirmation dialog: shows method, amount, reference
- **Assignment guard**: If payment has active assignments, void is blocked with error message. Must unassign first.
- Sets `status: 'voided'`, records `voidedAt`, `voidedBy`
- Voided rows render at 50% opacity; assign + void actions disabled
- Logged in audit trail

### Assign
- Slide-out drawer from right
- Shows group parent reservations with expandable child reservations
- Individual (non-group) reservations also listed
- Assignment options: split equally, split by balance due, or custom amounts
- Each child assignment is individually audit-logged

## 5. Data Model

### Payment type
```typescript
interface Payment {
  id: string;
  source: 'stripe' | 'manual';
  amount: number;           // cents
  status: 'active' | 'voided';
  transactionType: 'charge' | 'refund';
  createdAt: string;        // ISO
  description: string;
  // Stripe-specific
  paymentIntentId?: string;
  stripeStatus?: 'success' | 'error';
  groupCode?: string;       // present => "Group payments" view; absent => "Unassigned payments" view
  // Manual-specific
  manualPaymentMethod?: 'ach' | 'wire' | 'bank_deposit' | 'other';
  dateReceived?: string;
  reference?: string;
  createdBy?: string;
  voidedAt?: string;
  voidedBy?: string;
  // Assignment
  assignments: PaymentAssignment[];
}
```

### View filtering logic
- **Unassigned payments**: `source === 'stripe' && !groupCode`
- **Group payments**: `source === 'stripe' && !!groupCode`
- **Manual payments**: `source === 'manual'`

## 6. Audit Log

- Tracks: `created`, `voided`, `assigned`, `unassigned`
- Fields: id, paymentId, action, actor (email), timestamp, details (human-readable)
- Displayed via audit log chip toggle (Manual view only)
- Sorted newest-first

## 7. Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite 6.x |
| UI | React 18 + TypeScript |
| Components | MUI v6 + MUI X DataGrid |
| State | React hooks (`usePaymentStore` custom hook) |
| Data | In-memory mock arrays (no API) |
| Server | `npm run dev` on port 5175, host `0.0.0.0` |

## 8. File Map

```
prototype/
  src/
    types/index.ts              — All TypeScript interfaces and types
    data/mock.ts                — Mock payments, reservations, audit log seed data
    hooks/usePaymentStore.ts    — State management (create, void, assign, unassign)
    pages/PaymentAssigner.tsx   — Main page: dropdown nav, view routing, dialog orchestration
    components/
      PaymentTable.tsx          — DataGrid with per-view column definitions
      CreateManualPaymentDialog.tsx — Create form dialog
      AssignmentDrawer.tsx      — Slide-out assignment drawer with group breakout
      VoidConfirmDialog.tsx     — Void confirmation with assignment guard
      AuditLog.tsx              — Audit trail table
    utils/format.ts             — formatCents, formatDateTime, generateId
    App.tsx                     — Root wrapper (ThemeProvider)
    main.tsx                    — React DOM entry
  .claude/launch.json           — Dev server config (port 5175)
  vite.config.ts                — Vite config (host: true)
```
