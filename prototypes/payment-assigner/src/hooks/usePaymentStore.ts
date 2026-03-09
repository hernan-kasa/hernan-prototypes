import { useState, useCallback } from 'react';
import type {
  Payment,
  AuditEntry,
  ManualPaymentMethod,
  PaymentAssignment,
} from '../types';
import {
  INITIAL_PAYMENTS,
  INITIAL_AUDIT_LOG,
  CURRENT_USER,
  GROUP_PARENTS,
  INDIVIDUAL_RESERVATIONS,
  PAYMENT_METHOD_LABELS,
} from '../data/mock';
import { generateId, formatCents } from '../utils/format';

export function usePaymentStore() {
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);

  const addAuditEntry = useCallback(
    (paymentId: string, action: AuditEntry['action'], details: string) => {
      const entry: AuditEntry = {
        id: generateId('audit'),
        paymentId,
        action,
        actor: CURRENT_USER,
        timestamp: new Date().toISOString(),
        details,
      };
      setAuditLog((prev) => [entry, ...prev]);
      return entry;
    },
    []
  );

  const createManualPayment = useCallback(
    (data: {
      paymentMethod: ManualPaymentMethod;
      amount: number; // cents
      dateReceived: string;
      reference: string;
    }) => {
      const payment: Payment = {
        id: generateId('mpay'),
        source: 'manual',
        amount: data.amount,
        status: 'active',
        transactionType: 'charge',
        createdAt: new Date().toISOString(),
        description: data.reference,
        manualPaymentMethod: data.paymentMethod,
        dateReceived: data.dateReceived,
        reference: data.reference,
        createdBy: CURRENT_USER,
        assignments: [],
      };
      setPayments((prev) => [payment, ...prev]);
      addAuditEntry(
        payment.id,
        'created',
        `Manual ${PAYMENT_METHOD_LABELS[data.paymentMethod]} payment created for ${formatCents(data.amount)} — "${data.reference}"`
      );
      return payment;
    },
    [addAuditEntry]
  );

  const voidPayment = useCallback(
    (paymentId: string): { success: boolean; error?: string } => {
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) return { success: false, error: 'Payment not found' };
      if (payment.source !== 'manual')
        return { success: false, error: 'Only manual payments can be voided' };
      if (payment.assignments.length > 0) {
        return {
          success: false,
          error: `This payment has been assigned to ${payment.assignments.length} reservation(s). Unassign before voiding.`,
        };
      }
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                status: 'voided' as const,
                voidedAt: new Date().toISOString(),
                voidedBy: CURRENT_USER,
              }
            : p
        )
      );
      addAuditEntry(
        paymentId,
        'voided',
        `Manual payment ${formatCents(payment.amount)} voided`
      );
      return { success: true };
    },
    [payments, addAuditEntry]
  );

  const assignPayment = useCallback(
    (
      paymentId: string,
      assignments: { reservationId: string; amount: number }[]
    ) => {
      const allReservations = [
        ...GROUP_PARENTS.flatMap((g) => [g, ...g.children]),
        ...INDIVIDUAL_RESERVATIONS,
      ];

      const newAssignments: PaymentAssignment[] = assignments.map((a) => {
        const res = allReservations.find((r) => r.id === a.reservationId);
        return {
          reservationId: a.reservationId,
          confirmationCode: res?.confirmationCode ?? 'Unknown',
          amount: a.amount,
          assignedAt: new Date().toISOString(),
          assignedBy: CURRENT_USER,
        };
      });

      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? { ...p, assignments: [...p.assignments, ...newAssignments] }
            : p
        )
      );

      for (const a of newAssignments) {
        addAuditEntry(
          paymentId,
          'assigned',
          `Assigned ${formatCents(a.amount)} to ${a.confirmationCode}`
        );
      }
    },
    [addAuditEntry]
  );

  const unassignPayment = useCallback(
    (paymentId: string, reservationId: string) => {
      const payment = payments.find((p) => p.id === paymentId);
      const assignment = payment?.assignments.find(
        (a) => a.reservationId === reservationId
      );

      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                assignments: p.assignments.filter(
                  (a) => a.reservationId !== reservationId
                ),
              }
            : p
        )
      );

      if (assignment) {
        addAuditEntry(
          paymentId,
          'unassigned',
          `Unassigned ${formatCents(assignment.amount)} from ${assignment.confirmationCode}`
        );
      }
    },
    [payments, addAuditEntry]
  );

  return {
    payments,
    auditLog,
    createManualPayment,
    voidPayment,
    assignPayment,
    unassignPayment,
  };
}
