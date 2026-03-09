import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Box,
  Typography,
  InputAdornment,
  Divider,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { ManualPaymentMethod } from '../types';
import { dollarsToCents } from '../utils/format';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    paymentMethod: ManualPaymentMethod;
    amount: number;
    dateReceived: string;
    reference: string;
  }) => void;
}

const METHODS: { value: ManualPaymentMethod; label: string }[] = [
  { value: 'ach', label: 'ACH Transfer' },
  { value: 'wire', label: 'Wire Transfer' },
  { value: 'bank_deposit', label: 'Bank Deposit' },
  { value: 'other', label: 'Other' },
];

export function CreateManualPaymentDialog({ open, onClose, onCreate }: Props) {
  const [method, setMethod] = useState<ManualPaymentMethod>('ach');
  const [amount, setAmount] = useState('');
  const [dateReceived, setDateReceived] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    const cents = dollarsToCents(amount);
    if (!amount || cents <= 0) errs.amount = 'Enter a valid amount';
    if (cents > 50000000) errs.amount = 'Amount exceeds $500,000 limit';
    if (!dateReceived) errs.dateReceived = 'Date received is required';
    if (!reference.trim()) errs.reference = 'Reference/memo is required';
    if (reference.trim().length < 3)
      errs.reference = 'Reference must be at least 3 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onCreate({
      paymentMethod: method,
      amount: dollarsToCents(amount),
      dateReceived,
      reference: reference.trim(),
    });
    // Reset
    setAmount('');
    setReference('');
    setDateReceived(new Date().toISOString().split('T')[0]);
    setMethod('ach');
    setErrors({});
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
        Create Manual Payment
        <Typography variant="body2" color="text.secondary" component="span" sx={{ mt: 0.5, fontWeight: 400, display: 'block' }}>
          Record a non-Stripe payment received outside the system
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mb: 3, mt: 1 }}
        >
          <Typography variant="body2" fontWeight={600}>
            You are asserting this payment was received.
          </Typography>
          <Typography variant="body2">
            Kontrol cannot verify ACH, wire, or bank deposit receipts
            independently. This record will be treated as authoritative for
            accounting purposes.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            select
            label="Payment Method"
            value={method}
            onChange={(e) =>
              setMethod(e.target.value as ManualPaymentMethod)
            }
            fullWidth
            size="small"
          >
            {METHODS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => {
              // Allow only numbers and decimal
              const val = e.target.value.replace(/[^0-9.]/g, '');
              setAmount(val);
            }}
            fullWidth
            size="small"
            error={!!errors.amount}
            helperText={errors.amount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            placeholder="0.00"
          />

          <TextField
            label="Date Received"
            type="date"
            value={dateReceived}
            onChange={(e) => setDateReceived(e.target.value)}
            fullWidth
            size="small"
            error={!!errors.dateReceived}
            helperText={errors.dateReceived}
            InputLabelProps={{ shrink: true }}
          />

          <Divider />

          <TextField
            label="Reference / Memo"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
            error={!!errors.reference}
            helperText={
              errors.reference ||
              'e.g., "ACH deposit for Acme Corp retreat — Chase bank ref #4829173"'
            }
            placeholder="Describe the payment source, group, and any bank reference numbers"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Payment Record
        </Button>
      </DialogActions>
    </Dialog>
  );
}
