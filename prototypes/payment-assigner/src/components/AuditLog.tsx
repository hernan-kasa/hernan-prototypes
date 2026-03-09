import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { AuditEntry } from '../types';
import { formatDateTime } from '../utils/format';

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  created: { bg: '#E8F5E9', color: '#2E7D32' },
  voided: { bg: '#FFEBEE', color: '#C62828' },
  assigned: { bg: '#E3F2FD', color: '#1565C0' },
  unassigned: { bg: '#FFF3E0', color: '#E65100' },
};

interface Props {
  entries: AuditEntry[];
}

export function AuditLog({ entries }: Props) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Audit Log
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#FAFAFA' }}>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actor</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2, textAlign: 'center' }}
                  >
                    No audit entries yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {entries.map((entry) => {
              const colors = ACTION_COLORS[entry.action] ?? {
                bg: '#F5F5F5',
                color: '#616161',
              };
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Chip
                      label={entry.action}
                      size="small"
                      sx={{
                        bgcolor: colors.bg,
                        color: colors.color,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        fontSize: '0.7rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {entry.actor}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {formatDateTime(entry.timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {entry.details}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
