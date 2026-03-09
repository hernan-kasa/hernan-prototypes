import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Chip,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PaymentTable } from '../components/PaymentTable';
import { CreateManualPaymentDialog } from '../components/CreateManualPaymentDialog';
import { AssignmentDrawer } from '../components/AssignmentDrawer';
import { VoidConfirmDialog } from '../components/VoidConfirmDialog';
import { AuditLog } from '../components/AuditLog';
import { usePaymentStore } from '../hooks/usePaymentStore';
import type { Payment } from '../types';

type View = 'unassigned' | 'group' | 'manual';

export function PaymentAssigner() {
  const {
    payments,
    auditLog,
    createManualPayment,
    voidPayment,
    assignPayment,
  } = usePaymentStore();

  // -- View state (dropdown) --
  const [view, setView] = useState<View>('manual');

  // -- Dialog state --
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [assignerPayment, setAssignerPayment] = useState<Payment | null>(null);
  const [assignerOpen, setAssignerOpen] = useState(false);
  const [voidTarget, setVoidTarget] = useState<Payment | null>(null);
  const [voidError, setVoidError] = useState<string | undefined>();

  // -- Manual sub-filter --
  const [manualFilter, setManualFilter] = useState<'all' | 'unassigned'>('all');

  // -- Audit log toggle (only in manual view) --
  const [showAuditLog, setShowAuditLog] = useState(false);

  // -- Snackbar --
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback(
    (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
      setSnackbar({ open: true, message, severity });
    },
    []
  );

  // -- Handlers --
  const handleCreatePayment = useCallback(
    (data: Parameters<typeof createManualPayment>[0]) => {
      createManualPayment(data);
      setCreateDialogOpen(false);
      showSnackbar('Manual payment created successfully');
    },
    [createManualPayment, showSnackbar]
  );

  const handleOpenAssigner = useCallback((payment: Payment) => {
    setAssignerPayment(payment);
    setAssignerOpen(true);
  }, []);

  const handleAssign = useCallback(
    (
      paymentId: string,
      assignments: { reservationId: string; amount: number }[]
    ) => {
      assignPayment(paymentId, assignments);
      showSnackbar(
        `Payment assigned to ${assignments.length} reservation(s)`
      );
    },
    [assignPayment, showSnackbar]
  );

  const handleOpenVoid = useCallback((payment: Payment) => {
    setVoidTarget(payment);
    setVoidError(undefined);
  }, []);

  const handleConfirmVoid = useCallback(() => {
    if (!voidTarget) return;
    const result = voidPayment(voidTarget.id);
    if (result.success) {
      setVoidTarget(null);
      showSnackbar('Payment voided successfully');
    } else {
      setVoidError(result.error);
    }
  }, [voidTarget, voidPayment, showSnackbar]);

  // -- Filter payments by view --
  const viewPayments = payments.filter((p) => {
    if (view === 'unassigned') return p.source === 'stripe' && !p.groupCode;
    if (view === 'group') return p.source === 'stripe' && !!p.groupCode;
    if (view === 'manual') return p.source === 'manual';
    return true;
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header — matches production layout */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        {/* Left: View dropdown */}
        <Box>
          <Select
            value={view}
            onChange={(e: SelectChangeEvent) => {
              setView(e.target.value as View);
              setShowAuditLog(false);
            }}
            variant="standard"
            IconComponent={KeyboardArrowDownIcon}
            disableUnderline
            sx={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#1A1A2E',
              '& .MuiSelect-select': { pb: 0 },
              '& .MuiSvgIcon-root': { fontSize: '1.5rem', mt: 0.5 },
            }}
          >
            <MenuItem value="unassigned">Unassigned payments</MenuItem>
            <MenuItem value="group">Group payments</MenuItem>
            <MenuItem value="manual">Manual payments</MenuItem>
          </Select>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {view === 'manual' && (
            <>
              <Chip
                label={`${auditLog.length} audit entries`}
                size="small"
                onClick={() => setShowAuditLog(!showAuditLog)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: showAuditLog ? '#E3F2FD' : undefined,
                  fontWeight: showAuditLog ? 600 : 400,
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialogOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Create Manual Payment
              </Button>
            </>
          )}
          <SettingsIcon sx={{ color: 'text.secondary', cursor: 'pointer', ml: 1 }} />
        </Box>
      </Box>

      {/* Content */}
      {showAuditLog && view === 'manual' ? (
        <AuditLog entries={auditLog} />
      ) : (
        <PaymentTable
          payments={viewPayments}
          onAssign={handleOpenAssigner}
          onVoid={handleOpenVoid}
          filter={manualFilter}
          onFilterChange={setManualFilter}
          view={view}
        />
      )}

      {/* Dialogs / Drawers */}
      <CreateManualPaymentDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreatePayment}
      />

      <AssignmentDrawer
        payment={assignerPayment}
        open={assignerOpen}
        onClose={() => {
          setAssignerOpen(false);
          setAssignerPayment(null);
        }}
        onAssign={handleAssign}
      />

      <VoidConfirmDialog
        payment={voidTarget}
        open={!!voidTarget}
        onClose={() => setVoidTarget(null)}
        onConfirm={handleConfirmVoid}
        error={voidError}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
