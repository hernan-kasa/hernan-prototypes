import type {
  Payment,
  Reservation,
  GroupParent,
  AuditEntry,
} from '../types';

// ---- Mock Payments (Stripe + Manual) ----

// Stripe payments are split into:
// - "unassigned": no group code, couldn't be auto-matched to a reservation
// - "group": has a known group confirmation code from Stripe metadata
export const INITIAL_STRIPE_UNASSIGNED: Payment[] = [
  {
    id: 'pay_u1',
    source: 'stripe',
    amount: 184_35,
    status: 'active',
    transactionType: 'refund',
    stripeStatus: 'success',
    createdAt: '2026-02-18T20:19:00Z',
    description: '-',
    paymentIntentId: 'pi_3RMFJwKVkpHddo9R0X5YJ7ks',
    assignments: [],
  },
  {
    id: 'pay_u2',
    source: 'stripe',
    amount: 692_32,
    status: 'active',
    transactionType: 'refund',
    stripeStatus: 'success',
    createdAt: '2026-02-20T01:01:00Z',
    description: '-',
    paymentIntentId: 'pi_3ROOvQKVkpHddo9R0UIm3f5V',
    assignments: [],
  },
  {
    id: 'pay_u3',
    source: 'stripe',
    amount: 201_135,
    status: 'active',
    transactionType: 'charge',
    stripeStatus: 'error',
    createdAt: '2026-02-21T15:39:00Z',
    description: 'K-G-JFA0S',
    paymentIntentId: 'pi_3RnKsNKVkpHddo9R19akcIL0',
    assignments: [],
  },
  {
    id: 'pay_u4',
    source: 'stripe',
    amount: 125000,
    status: 'active',
    transactionType: 'charge',
    stripeStatus: 'error',
    createdAt: '2026-02-22T09:15:00Z',
    description: '-',
    paymentIntentId: 'pi_4RyS8wLa9nO5qM3t',
    assignments: [],
  },
  {
    id: 'pay_u5',
    source: 'stripe',
    amount: 15000,
    status: 'active',
    transactionType: 'refund',
    stripeStatus: 'success',
    createdAt: '2026-03-02T08:00:00Z',
    description: '-',
    paymentIntentId: 'pi_7UbV1zOd2qR8tP6w',
    assignments: [],
  },
];

export const INITIAL_STRIPE_GROUP: Payment[] = [
  {
    id: 'pay_g1',
    source: 'stripe',
    amount: 450000,
    status: 'active',
    transactionType: 'charge',
    stripeStatus: 'success',
    groupCode: 'K-G-ACME1',
    createdAt: '2026-02-20T14:30:00Z',
    description: 'K-G-ACME1',
    paymentIntentId: 'pi_3QxR7vKz8mN4pL2s',
    assignments: [],
  },
  {
    id: 'pay_g2',
    source: 'stripe',
    amount: 87500,
    status: 'active',
    transactionType: 'charge',
    stripeStatus: 'success',
    groupCode: 'K-G-TC26',
    createdAt: '2026-02-25T16:45:00Z',
    description: 'K-G-TC26',
    paymentIntentId: 'pi_5SzT9xMb0oP6rN4u',
    assignments: [
      {
        reservationId: 'res_tc_1',
        confirmationCode: 'KASA-TC-001',
        amount: 87500,
        assignedAt: '2026-02-26T10:00:00Z',
        assignedBy: 'kirsten.knecht@kasaliving.com',
      },
    ],
  },
  {
    id: 'pay_g3',
    source: 'stripe',
    amount: 320000,
    status: 'active',
    transactionType: 'charge',
    stripeStatus: 'error',
    groupCode: 'K-G-GLX26',
    createdAt: '2026-03-01T11:20:00Z',
    description: 'K-G-GLX26',
    paymentIntentId: 'pi_6TaU0yNc1pQ7sO5v',
    assignments: [],
  },
  {
    id: 'pay_g4',
    source: 'stripe',
    amount: 978000,
    status: 'active',
    transactionType: 'charge',
    stripeStatus: 'error',
    groupCode: 'K-G-555BM',
    createdAt: '2026-03-04T21:41:00Z',
    description: 'K-G-555BM',
    paymentIntentId: 'pi_3RsVCWKVkpHddo9R1KovWM0E',
    assignments: [],
  },
];

// Combined for backward compat with store
export const INITIAL_PAYMENTS: Payment[] = [
  ...INITIAL_STRIPE_UNASSIGNED,
  ...INITIAL_STRIPE_GROUP,
];

// ---- Mock Group Parents with Children ----

export const GROUP_PARENTS: GroupParent[] = [
  {
    id: 'res_acme_parent',
    confirmationCode: 'KASA-ACME-GRP',
    guestName: 'Acme Corp',
    propertyName: 'Kasa Austin Downtown',
    checkIn: '2026-04-10',
    checkOut: '2026-04-13',
    totalAmount: 900000,
    balanceDue: 450000,
    group: {
      type: 'parent',
      groupName: 'Acme Corp Q2 Retreat',
    },
    children: [
      {
        id: 'res_acme_1',
        confirmationCode: 'KASA-ACME-001',
        guestName: 'Alice Chen',
        propertyName: 'Kasa Austin Downtown',
        checkIn: '2026-04-10',
        checkOut: '2026-04-13',
        totalAmount: 225000,
        balanceDue: 112500,
        group: {
          type: 'child',
          parentId: 'res_acme_parent',
          parentConfirmationCode: 'KASA-ACME-GRP',
          groupName: 'Acme Corp Q2 Retreat',
        },
      },
      {
        id: 'res_acme_2',
        confirmationCode: 'KASA-ACME-002',
        guestName: 'Bob Martinez',
        propertyName: 'Kasa Austin Downtown',
        checkIn: '2026-04-10',
        checkOut: '2026-04-13',
        totalAmount: 225000,
        balanceDue: 112500,
        group: {
          type: 'child',
          parentId: 'res_acme_parent',
          parentConfirmationCode: 'KASA-ACME-GRP',
          groupName: 'Acme Corp Q2 Retreat',
        },
      },
      {
        id: 'res_acme_3',
        confirmationCode: 'KASA-ACME-003',
        guestName: 'Carol Davis',
        propertyName: 'Kasa Austin Downtown',
        checkIn: '2026-04-10',
        checkOut: '2026-04-13',
        totalAmount: 225000,
        balanceDue: 112500,
        group: {
          type: 'child',
          parentId: 'res_acme_parent',
          parentConfirmationCode: 'KASA-ACME-GRP',
          groupName: 'Acme Corp Q2 Retreat',
        },
      },
      {
        id: 'res_acme_4',
        confirmationCode: 'KASA-ACME-004',
        guestName: 'Dan Wilson',
        propertyName: 'Kasa Austin Downtown',
        checkIn: '2026-04-10',
        checkOut: '2026-04-13',
        totalAmount: 225000,
        balanceDue: 112500,
        group: {
          type: 'child',
          parentId: 'res_acme_parent',
          parentConfirmationCode: 'KASA-ACME-GRP',
          groupName: 'Acme Corp Q2 Retreat',
        },
      },
    ],
  },
  {
    id: 'res_globex_parent',
    confirmationCode: 'KASA-GLX-GRP',
    guestName: 'Globex Corporation',
    propertyName: 'Kasa Nashville Gulch',
    checkIn: '2026-05-01',
    checkOut: '2026-05-04',
    totalAmount: 640000,
    balanceDue: 320000,
    group: {
      type: 'parent',
      groupName: 'Globex Annual Meeting 2026',
    },
    children: [
      {
        id: 'res_glx_1',
        confirmationCode: 'KASA-GLX-001',
        guestName: 'Hank Scorpio',
        propertyName: 'Kasa Nashville Gulch',
        checkIn: '2026-05-01',
        checkOut: '2026-05-04',
        totalAmount: 160000,
        balanceDue: 80000,
        group: {
          type: 'child',
          parentId: 'res_globex_parent',
          parentConfirmationCode: 'KASA-GLX-GRP',
          groupName: 'Globex Annual Meeting 2026',
        },
      },
      {
        id: 'res_glx_2',
        confirmationCode: 'KASA-GLX-002',
        guestName: 'Frank Grimes',
        propertyName: 'Kasa Nashville Gulch',
        checkIn: '2026-05-01',
        checkOut: '2026-05-04',
        totalAmount: 160000,
        balanceDue: 80000,
        group: {
          type: 'child',
          parentId: 'res_globex_parent',
          parentConfirmationCode: 'KASA-GLX-GRP',
          groupName: 'Globex Annual Meeting 2026',
        },
      },
      {
        id: 'res_glx_3',
        confirmationCode: 'KASA-GLX-003',
        guestName: 'Lenny Leonard',
        propertyName: 'Kasa Nashville Gulch',
        checkIn: '2026-05-01',
        checkOut: '2026-05-04',
        totalAmount: 160000,
        balanceDue: 80000,
        group: {
          type: 'child',
          parentId: 'res_globex_parent',
          parentConfirmationCode: 'KASA-GLX-GRP',
          groupName: 'Globex Annual Meeting 2026',
        },
      },
      {
        id: 'res_glx_4',
        confirmationCode: 'KASA-GLX-004',
        guestName: 'Carl Carlson',
        propertyName: 'Kasa Nashville Gulch',
        checkIn: '2026-05-01',
        checkOut: '2026-05-04',
        totalAmount: 160000,
        balanceDue: 80000,
        group: {
          type: 'child',
          parentId: 'res_globex_parent',
          parentConfirmationCode: 'KASA-GLX-GRP',
          groupName: 'Globex Annual Meeting 2026',
        },
      },
    ],
  },
  {
    id: 'res_techconf_parent',
    confirmationCode: 'KASA-TC-GRP',
    guestName: 'TechConf Inc',
    propertyName: 'Kasa Denver LoDo',
    checkIn: '2026-06-15',
    checkOut: '2026-06-18',
    totalAmount: 350000,
    balanceDue: 262500,
    group: {
      type: 'parent',
      groupName: 'TechConf 2026 Speaker Block',
    },
    children: [
      {
        id: 'res_tc_1',
        confirmationCode: 'KASA-TC-001',
        guestName: 'Sarah Kim',
        propertyName: 'Kasa Denver LoDo',
        checkIn: '2026-06-15',
        checkOut: '2026-06-18',
        totalAmount: 175000,
        balanceDue: 87500,
        group: {
          type: 'child',
          parentId: 'res_techconf_parent',
          parentConfirmationCode: 'KASA-TC-GRP',
          groupName: 'TechConf 2026 Speaker Block',
        },
      },
      {
        id: 'res_tc_2',
        confirmationCode: 'KASA-TC-002',
        guestName: 'Mike Patel',
        propertyName: 'Kasa Denver LoDo',
        checkIn: '2026-06-15',
        checkOut: '2026-06-18',
        totalAmount: 175000,
        balanceDue: 175000,
        group: {
          type: 'child',
          parentId: 'res_techconf_parent',
          parentConfirmationCode: 'KASA-TC-GRP',
          groupName: 'TechConf 2026 Speaker Block',
        },
      },
    ],
  },
];

// ---- Mock Individual (non-group) Reservations ----

export const INDIVIDUAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res_ind_1',
    confirmationCode: 'KASA-IND-101',
    guestName: 'Emily Johnson',
    propertyName: 'Kasa Austin Downtown',
    checkIn: '2026-04-05',
    checkOut: '2026-04-08',
    totalAmount: 125000,
    balanceDue: 125000,
  },
  {
    id: 'res_ind_2',
    confirmationCode: 'KASA-IND-102',
    guestName: 'James Park',
    propertyName: 'Kasa Nashville Gulch',
    checkIn: '2026-04-12',
    checkOut: '2026-04-14',
    totalAmount: 85000,
    balanceDue: 85000,
  },
];

// ---- Initial Audit Entries ----

export const INITIAL_AUDIT_LOG: AuditEntry[] = [
  {
    id: 'audit_1',
    paymentId: 'pay_3',
    action: 'assigned',
    actor: 'kirsten.knecht@kasaliving.com',
    timestamp: '2026-02-26T10:00:00Z',
    details:
      'Assigned $875.00 to KASA-TC-001 (Sarah Kim) — TechConf 2026 Speaker Block',
  },
];

// ---- Helpers ----

export const CURRENT_USER = 'kirsten.knecht@kasaliving.com';

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  ach: 'ACH Transfer',
  wire: 'Wire Transfer',
  bank_deposit: 'Bank Deposit',
  other: 'Other',
};
