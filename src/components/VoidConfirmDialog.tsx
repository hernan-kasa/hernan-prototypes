import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import type { Payment } from '../types';
import { formatCents } from '../utils/format';
import { PAYMENT_METHOD_LABELS } from '../data/mock';

interface Props {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  error?: string;
}

export function VoidConfirmDialog({
  payment,
  open,
  onClose,
  onConfirm,
  error,
}: Props) {
  if (!payment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Void Manual Payment</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Are you sure you want to void this payment record? This action
              will be logged in the audit trail.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Method:</strong>{' '}
              {PAYMENT_METHOD_LABELS[payment.manualPaymentMethod ?? 'other']}
              <br />
              <strong>Amount:</strong> {formatCents(payment.amount)}
              <br />
              <strong>Reference:</strong> {payment.reference}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        {!error && (
          <Button onClick={onConfirm} variant="contained" color="error">
            Void Payment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
