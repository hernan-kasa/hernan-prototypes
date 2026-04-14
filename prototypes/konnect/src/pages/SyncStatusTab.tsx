import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Snackbar from '@mui/material/Snackbar';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import BlockIcon from '@mui/icons-material/Block';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SyncConfirmDialog from '../components/SyncConfirmDialog';
import { mockSyncStatus, mockSyncLog } from '../data/mockData';
import { ChannelSyncStatus, SyncLogEntry } from '../types';
import { colors } from '../theme';

function formatDate(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function StatusChip({ status }: { status: ChannelSyncStatus }) {
  if (!status.contentEnabled) {
    return (
      <Chip
        icon={<BlockIcon sx={{ fontSize: 16 }} />}
        label="Disabled"
        size="small"
        sx={{ bgcolor: colors.neutral[200], color: colors.neutral[600], fontWeight: 700 }}
      />
    );
  }
  if (status.lastSyncStatus === 'success') {
    return (
      <Chip
        icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
        label="Synced"
        size="small"
        sx={{ bgcolor: colors.green[100], color: colors.green[500], fontWeight: 700 }}
      />
    );
  }
  if (status.lastSyncStatus === 'failure') {
    return (
      <Chip
        icon={<ErrorIcon sx={{ fontSize: 16 }} />}
        label="Failed"
        size="small"
        sx={{ bgcolor: colors.red[100], color: colors.red[500], fontWeight: 700 }}
      />
    );
  }
  if (status.lastSyncStatus === 'pending') {
    return (
      <Chip
        icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
        label="Pending"
        size="small"
        sx={{ bgcolor: colors.orange[100], color: colors.orange[400], fontWeight: 700 }}
      />
    );
  }
  return (
    <Chip
      label="Never synced"
      size="small"
      sx={{ bgcolor: colors.neutral[200], color: colors.neutral[500], fontWeight: 700 }}
    />
  );
}

// Warning banners based on channel state
function getWarnings(channels: ChannelSyncStatus[]): string[] {
  const warnings: string[] = [];
  const bdc = channels.find((c) => c.channelName === 'Booking.com');
  const expedia = channels.find((c) => c.channelName === 'Expedia');
  const airbnb = channels.find((c) => c.channelName === 'Airbnb');

  if (airbnb?.contentEnabled) {
    warnings.push('Content sync is enabled for Airbnb. Manual changes on Airbnb extranet will be overwritten.');
    warnings.push("Airbnb 'Guest Access' and 'Getting Around' fields must be managed directly on Airbnb.");
  }
  if (bdc && bdc.enabled && !bdc.contentEnabled && bdc.disableReason) {
    warnings.push(`Booking.com channel is active but content sync is off (${bdc.disableReason}). Content can be authored but will not sync.`);
  }
  if (expedia && !expedia.contentEnabled && expedia.disableReason === 'Never enabled') {
    warnings.push('Expedia content sync has never been enabled for this property.');
  }
  warnings.push('Pet fees must be added manually in NextPax channel-specific settings.');
  return warnings;
}

interface Props {
  propertyId: string;
}

export default function SyncStatusTab({ propertyId }: Props) {
  const channels = mockSyncStatus[propertyId] || [];
  const syncLog = mockSyncLog[propertyId] || [];
  const warnings = getWarnings(channels);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const canSync = channels.some((c) => c.contentEnabled);

  const handleSync = () => {
    setConfirmOpen(false);
    setSnackOpen(true);
  };

  return (
    <Box>
      {/* Channel status cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2, mb: 2 }}>
        {channels.map((ch) => (
          <Card key={ch.channelId}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">{ch.channelName}</Typography>
                <StatusChip status={ch} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                    Channel ID
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                    {ch.channelId}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                    Channel
                  </Typography>
                  <Typography variant="caption" sx={{ color: ch.enabled ? colors.green[300] : colors.neutral[400] }}>
                    {ch.enabled ? 'Active' : 'Disabled'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                    Content Sync
                  </Typography>
                  <Typography variant="caption" sx={{ color: ch.contentEnabled ? colors.green[300] : colors.orange[400] }}>
                    {ch.contentEnabled ? 'On' : 'Off'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                    Last Sync
                  </Typography>
                  <Typography variant="caption">{formatDate(ch.lastSyncAt)}</Typography>
                </Box>
                {ch.disableReason && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="caption" sx={{ color: colors.neutral[500], flexShrink: 0 }}>
                      Reason
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.orange[400], textAlign: 'right' }}>
                      {ch.disableReason}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Sync trigger */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<SyncIcon />}
          onClick={() => setConfirmOpen(true)}
          disabled={!canSync}
        >
          Sync Now
        </Button>
      </Box>

      {/* Sync log */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Recent Sync Log
      </Typography>
      {syncLog.length === 0 ? (
        <Typography variant="body2" sx={{ color: colors.neutral[500], mb: 4 }}>
          No sync events recorded for this property.
        </Typography>
      ) : (
        <TableContainer sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Operator</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Content</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Channel</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Result</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Request ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {syncLog.map((log: SyncLogEntry) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Typography variant="body2">{formatDate(log.timestamp)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{log.operator}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.contentType}
                      size="small"
                      sx={{ bgcolor: colors.neutral[200], fontWeight: 700, fontSize: '0.75rem', height: 22 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{log.channel}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.result}
                      size="small"
                      sx={{
                        bgcolor: log.result === 'success' ? colors.green[100] : colors.red[100],
                        color: log.result === 'success' ? colors.green[500] : colors.red[500],
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {log.nextpaxRequestId}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Notes & Warnings */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Notes &amp; Warnings</Typography>
      {warnings.map((w, i) => (
        <Alert
          key={i}
          severity={w.includes('disabled') || w.includes('never been enabled') ? 'warning' : 'info'}
          sx={{ mb: 1.5 }}
        >
          {w}
        </Alert>
      ))}

      <SyncConfirmDialog
        open={confirmOpen}
        channels={channels}
        contentType="all"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSync}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={() => setSnackOpen(false)}
        message="Sync triggered. Content is being pushed to enabled channels via NextPax."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
}
