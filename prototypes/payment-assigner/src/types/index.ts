// ---- Payment Types ----

export type PaymentSource = 'stripe' | 'manual';

export type ManualPaymentMethod = 'ach' | 'wire' | 'bank_deposit' | 'other';

export type PaymentStatus = 'active' | 'voided';

export type TransactionType = 'charge' | 'refund';

export type StripeStatus = 'success' | 'error';

export interface Payment {
  id: string;
  source: PaymentSource;
  amount: number; // in cents
  status: PaymentStatus;
  transactionType: TransactionType;
  createdAt: string; // ISO date
  description: string;
  // Stripe-specific
  paymentIntentId?: string;
  stripeStatus?: StripeStatus;
  groupCode?: string; // e.g. "K-G-XBACQ" — present when Stripe metadata had a known group code
  // Manual-specific
  manualPaymentMethod?: ManualPaymentMethod;
  dateReceived?: string; // ISO date
  reference?: string;
  createdBy?: string;
  voidedAt?: string;
  voidedBy?: string;
  // Assignment
  assignments: PaymentAssignment[];
}

export interface PaymentAssignment {
  reservationId: string;
  confirmationCode: string;
  amount: number; // in cents
  assignedAt: string;
  assignedBy: string;
}

// ---- Reservation Types ----

export interface Reservation {
  id: string;
  confirmationCode: string;
  guestName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number; // in cents
  balanceDue: number; // in cents
  group?: GroupInfo;
}

export interface GroupInfo {
  type: 'parent' | 'child';
  parentId?: string;
  parentConfirmationCode?: string;
  groupName: string;
}

export interface GroupParent extends Reservation {
  children: Reservation[];
}

// ---- Audit Log ----

export type AuditAction = 'created' | 'voided' | 'assigned' | 'unassigned';

export interface AuditEntry {
  id: string;
  paymentId: string;
  action: AuditAction;
  actor: string;
  timestamp: string;
  details: string;
}

// ---- Form Types ----

export interface CreateManualPaymentForm {
  paymentMethod: ManualPaymentMethod;
  amount: string; // dollar string for form input
  dateReceived: string;
  reference: string;
}

export type SplitOption = 'equal' | 'based_on_balance';
