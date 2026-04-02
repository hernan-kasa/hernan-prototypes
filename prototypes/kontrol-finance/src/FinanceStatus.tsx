import { Box, Typography, Card, Chip } from '@mui/material'
import { type FolioWindow, formatCurrency } from './data'

interface FinanceStatusProps {
  totals: { totalPayments: number; outstandingBalance: number }
  selectedWindowId: number | null
  windows: FolioWindow[]
}

export function FinanceStatus({ totals, selectedWindowId, windows }: FinanceStatusProps) {
  const selectedWindow = selectedWindowId !== null
    ? windows.find(w => w.id === selectedWindowId)
    : null

  const windowChip = selectedWindow ? (
    <Chip
      label={`Window ${selectedWindow.id}: ${selectedWindow.name}`}
      size="small"
      sx={{ ml: 1, bgcolor: '#e3f2fd', fontSize: '0.75rem' }}
    />
  ) : null

  return (
    <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Finance Status
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Total payments */}
        <Card variant="outlined" sx={{ flex: '1 1 280px', p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Total payments
            </Typography>
            {windowChip}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 600, my: 1 }}>
            {formatCurrency(totals.totalPayments)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            What guest paid so far
          </Typography>
        </Card>

        {/* Outstanding balance */}
        <Card variant="outlined" sx={{ flex: '1 1 280px', p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Outstanding balance
            </Typography>
            {windowChip}
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              my: 1,
              color: totals.outstandingBalance > 0 ? '#d32f2f' : '#2e7d32',
            }}
          >
            {formatCurrency(totals.outstandingBalance)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            What guest still has to pay
          </Typography>
          {totals.outstandingBalance === 0 && (
            <Chip label="Settled" color="success" size="small" sx={{ mt: 1 }} />
          )}
          {totals.outstandingBalance > 0 && (
            <Chip label="Open" color="warning" size="small" sx={{ mt: 1 }} />
          )}
        </Card>
      </Box>
    </Box>
  )
}
