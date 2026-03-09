import { useState, useMemo, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  Autocomplete,
  TextField,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Alert,
  Divider,
  InputAdornment,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import type { Payment, Reservation, GroupParent, SplitOption } from '../types';
import { formatCents, formatDate, centsToDollars, dollarsToCents } from '../utils/format';
import { GROUP_PARENTS, INDIVIDUAL_RESERVATIONS, PAYMENT_METHOD_LABELS } from '../data/mock';

interface Props {
  payment: Payment | null;
  open: boolean;
  onClose: () => void;
  onAssign: (
    paymentId: string,
    assignments: { reservationId: string; amount: number }[]
  ) => void;
}

export function AssignmentDrawer({ payment, open, onClose, onAssign }: Props) {
  // -- Search state --
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<GroupParent | null>(null);
  const [selectedIndividual, setSelectedIndividual] = useState<Reservation | null>(null);

  // -- Child selection state --
  const [selectedChildIds, setSelectedChildIds] = useState<Set<string>>(new Set());
  const [splitOption, setSplitOption] = useState<SplitOption>('equal');
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [useCustomSplit, setUseCustomSplit] = useState(false);

  const reset = useCallback(() => {
    setSearchTerm('');
    setSelectedGroup(null);
    setSelectedIndividual(null);
    setSelectedChildIds(new Set());
    setSplitOption('equal');
    setCustomAmounts({});
    setUseCustomSplit(false);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  // -- Search across groups and individual reservations --
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const term = searchTerm.toLowerCase();
    const results: (GroupParent | Reservation)[] = [];

    for (const g of GROUP_PARENTS) {
      if (
        g.confirmationCode.toLowerCase().includes(term) ||
        g.guestName.toLowerCase().includes(term) ||
        g.group?.groupName.toLowerCase().includes(term) ||
        g.propertyName.toLowerCase().includes(term)
      ) {
        results.push(g);
      }
    }
    for (const r of INDIVIDUAL_RESERVATIONS) {
      if (
        r.confirmationCode.toLowerCase().includes(term) ||
        r.guestName.toLowerCase().includes(term) ||
        r.propertyName.toLowerCase().includes(term)
      ) {
        results.push(r);
      }
    }
    return results;
  }, [searchTerm]);

  // -- Handle group selection --
  const handleSelectResult = (result: GroupParent | Reservation | null) => {
    if (!result) {
      setSelectedGroup(null);
      setSelectedIndividual(null);
      setSelectedChildIds(new Set());
      return;
    }
    if ('children' in result) {
      setSelectedGroup(result);
      setSelectedIndividual(null);
      // Select all children by default
      setSelectedChildIds(new Set(result.children.map((c) => c.id)));
    } else {
      setSelectedIndividual(result);
      setSelectedGroup(null);
    }
  };

  // -- Toggle child selection --
  const toggleChild = (childId: string) => {
    setSelectedChildIds((prev) => {
      const next = new Set(prev);
      if (next.has(childId)) next.delete(childId);
      else next.add(childId);
      return next;
    });
  };

  const selectAllChildren = () => {
    if (!selectedGroup) return;
    setSelectedChildIds(new Set(selectedGroup.children.map((c) => c.id)));
  };

  const deselectAllChildren = () => {
    setSelectedChildIds(new Set());
  };

  // -- Calculate split amounts --
  const selectedChildren = useMemo(() => {
    if (!selectedGroup) return [];
    return selectedGroup.children.filter((c) => selectedChildIds.has(c.id));
  }, [selectedGroup, selectedChildIds]);

  const calculatedAmounts = useMemo(() => {
    if (!payment) return {};
    if (useCustomSplit) {
      const amounts: Record<string, number> = {};
      for (const child of selectedChildren) {
        amounts[child.id] = dollarsToCents(customAmounts[child.id] ?? '0');
      }
      return amounts;
    }
    if (selectedIndividual) {
      return { [selectedIndividual.id]: payment.amount };
    }
    if (selectedChildren.length === 0) return {};

    const total = payment.amount;

    if (splitOption === 'equal') {
      const base = Math.floor(total / selectedChildren.length);
      const remainder = total - base * selectedChildren.length;
      const amounts: Record<string, number> = {};
      selectedChildren.forEach((c, i) => {
        amounts[c.id] = base + (i < remainder ? 1 : 0);
      });
      return amounts;
    }

    // based on balance
    const totalBalance = selectedChildren.reduce(
      (sum, c) => sum + c.balanceDue,
      0
    );
    if (totalBalance === 0) {
      // fallback to equal
      const base = Math.floor(total / selectedChildren.length);
      const remainder = total - base * selectedChildren.length;
      const amounts: Record<string, number> = {};
      selectedChildren.forEach((c, i) => {
        amounts[c.id] = base + (i < remainder ? 1 : 0);
      });
      return amounts;
    }

    const amounts: Record<string, number> = {};
    let allocated = 0;
    selectedChildren.forEach((c, i) => {
      if (i === selectedChildren.length - 1) {
        amounts[c.id] = total - allocated;
      } else {
        const share = Math.round((c.balanceDue / totalBalance) * total);
        amounts[c.id] = share;
        allocated += share;
      }
    });
    return amounts;
  }, [payment, selectedChildren, selectedIndividual, splitOption, useCustomSplit, customAmounts]);

  const totalAllocated = Object.values(calculatedAmounts).reduce(
    (sum, v) => sum + v,
    0
  );
  const allocationMatch = payment ? totalAllocated === payment.amount : false;
  const hasSelections =
    selectedChildren.length > 0 || selectedIndividual !== null;

  const handleAssign = () => {
    if (!payment || !hasSelections) return;
    const assignments = Object.entries(calculatedAmounts)
      .filter(([, amount]) => amount > 0)
      .map(([reservationId, amount]) => ({ reservationId, amount }));
    onAssign(payment.id, assignments);
    handleClose();
  };

  if (!payment) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: '100%', md: 680 } } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid #E0E0E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Assign Payment
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Stack spacing={3} sx={{ maxWidth: 560, mx: 'auto' }}>
            {/* Payment Card */}
            <Box
              sx={{
                border: '1px solid #E0E0E0',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                {payment.source === 'manual' ? (
                  <AccountBalanceIcon sx={{ color: '#2E7D32' }} />
                ) : (
                  <CreditCardIcon sx={{ color: '#5C6BC0' }} />
                )}
                <Typography variant="subtitle2" fontWeight={700}>
                  Payment
                </Typography>
                <Chip
                  label={payment.source === 'manual'
                    ? PAYMENT_METHOD_LABELS[payment.manualPaymentMethod ?? 'other']
                    : 'Stripe'}
                  size="small"
                  sx={{
                    bgcolor: payment.source === 'manual' ? '#E8F5E9' : '#EDE7F6',
                    color: payment.source === 'manual' ? '#2E7D32' : '#5C6BC0',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                {formatCents(payment.amount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {payment.source === 'stripe'
                  ? payment.paymentIntentId
                  : `Ref: ${payment.reference}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(payment.createdAt)}
                {payment.description ? ` — ${payment.description}` : ''}
              </Typography>
              {payment.assignments.length > 0 && (
                <Alert severity="info" sx={{ mt: 1.5 }}>
                  This payment already has {payment.assignments.length}{' '}
                  existing assignment(s) totaling{' '}
                  {formatCents(
                    payment.assignments.reduce((s, a) => s + a.amount, 0)
                  )}
                </Alert>
              )}
            </Box>

            <Divider />

            {/* Search for Reservation/Group */}
            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                Search for a reservation or group
              </Typography>
              <Autocomplete
                freeSolo
                options={searchResults}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  const isGroup = 'children' in option;
                  return `${option.confirmationCode} — ${option.guestName}${isGroup ? ` (Group: ${option.group?.groupName})` : ''}`;
                }}
                inputValue={searchTerm}
                onInputChange={(_, value) => setSearchTerm(value)}
                onChange={(_, value) => {
                  if (typeof value === 'string') return;
                  handleSelectResult(value);
                }}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  const isGroup = 'children' in option;
                  return (
                    <li key={key} {...rest}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {option.confirmationCode}
                          </Typography>
                          {isGroup && (
                            <Chip label="Group" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {option.guestName} — {option.propertyName}
                          {isGroup
                            ? ` — ${(option as GroupParent).children.length} rooms`
                            : ''}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search by confirmation code, guest name, group name, or property..."
                  />
                )}
              />
            </Box>

            {/* Individual reservation selected */}
            {selectedIndividual && (
              <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Assign to reservation
                </Typography>
                <ReservationRow
                  reservation={selectedIndividual}
                  amount={calculatedAmounts[selectedIndividual.id] ?? 0}
                />
              </Box>
            )}

            {/* Group selected — show children */}
            {selectedGroup && (
              <Box>
                <Box
                  sx={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    bgcolor: '#FAFAFA',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    {selectedGroup.group?.groupName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedGroup.confirmationCode} —{' '}
                    {selectedGroup.propertyName} —{' '}
                    {selectedGroup.children.length} child reservations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedGroup.checkIn)} →{' '}
                    {formatDate(selectedGroup.checkOut)}
                  </Typography>
                </Box>

                {/* Child selection */}
                <Box
                  sx={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Select child reservations ({selectedChildIds.size}/
                      {selectedGroup.children.length})
                    </Typography>
                    <Box>
                      <Button size="small" onClick={selectAllChildren}>
                        Select all
                      </Button>
                      <Button size="small" onClick={deselectAllChildren}>
                        None
                      </Button>
                    </Box>
                  </Box>

                  {selectedGroup.children.map((child) => (
                    <Box
                      key={child.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        py: 0.75,
                        borderBottom: '1px solid #F5F5F5',
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={selectedChildIds.has(child.id)}
                        onChange={() => toggleChild(child.id)}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {child.confirmationCode} — {child.guestName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Balance: {formatCents(child.balanceDue)}
                        </Typography>
                      </Box>
                      {selectedChildIds.has(child.id) && (
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ minWidth: 80, textAlign: 'right' }}
                        >
                          {useCustomSplit ? (
                            <TextField
                              size="small"
                              value={customAmounts[child.id] ?? centsToDollars(calculatedAmounts[child.id] ?? 0)}
                              onChange={(e) => {
                                const val = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ''
                                );
                                setCustomAmounts((prev) => ({
                                  ...prev,
                                  [child.id]: val,
                                }));
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
                              sx={{ width: 120 }}
                            />
                          ) : (
                            formatCents(calculatedAmounts[child.id] ?? 0)
                          )}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Split options */}
                {selectedChildIds.size > 1 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{ mb: 1 }}
                    >
                      Split method
                    </Typography>
                    <RadioGroup
                      value={useCustomSplit ? 'custom' : splitOption}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom') {
                          setUseCustomSplit(true);
                          // Seed custom amounts from current calculated
                          const seeded: Record<string, string> = {};
                          for (const child of selectedChildren) {
                            seeded[child.id] = centsToDollars(
                              calculatedAmounts[child.id] ?? 0
                            );
                          }
                          setCustomAmounts(seeded);
                        } else {
                          setUseCustomSplit(false);
                          setSplitOption(val as SplitOption);
                        }
                      }}
                    >
                      <FormControlLabel
                        value="equal"
                        control={<Radio size="small" />}
                        label="Equal split"
                      />
                      <FormControlLabel
                        value="based_on_balance"
                        control={<Radio size="small" />}
                        label="Based on balance owed"
                      />
                      <FormControlLabel
                        value="custom"
                        control={<Radio size="small" />}
                        label="Custom amounts"
                      />
                    </RadioGroup>
                  </Box>
                )}
              </Box>
            )}

            {/* Allocation Summary */}
            {hasSelections && (
              <Box>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Payment total:
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCents(payment.amount)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Total allocated:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={allocationMatch ? 'success.main' : 'warning.main'}
                  >
                    {formatCents(totalAllocated)}
                  </Typography>
                </Box>
                {!allocationMatch && (
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Allocated amount ({formatCents(totalAllocated)}) does not
                    match payment ({formatCents(payment.amount)}).
                    {totalAllocated < payment.amount
                      ? ` ${formatCents(payment.amount - totalAllocated)} unallocated.`
                      : ` ${formatCents(totalAllocated - payment.amount)} over-allocated.`}
                  </Alert>
                )}
                {allocationMatch && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Allocation matches payment amount exactly.
                  </Alert>
                )}
                <Alert severity="info" sx={{ mt: 1, fontSize: '0.8rem' }}>
                  This action will not trigger payment — it is only for
                  accounting purposes.
                </Alert>
              </Box>
            )}
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #E0E0E0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
          }}
        >
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!hasSelections || !allocationMatch}
          >
            Assign Payment
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

function ReservationRow({
  reservation,
  amount,
}: {
  reservation: Reservation;
  amount: number;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1,
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {reservation.confirmationCode} — {reservation.guestName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {reservation.propertyName} — {formatDate(reservation.checkIn)} →{' '}
          {formatDate(reservation.checkOut)}
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Balance: {formatCents(reservation.balanceDue)}
        </Typography>
      </Box>
      <Typography variant="body2" fontWeight={700}>
        {formatCents(amount)}
      </Typography>
    </Box>
  );
}
