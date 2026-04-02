import { Box, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { AuditEntry } from './data'

const columns: GridColDef<AuditEntry>[] = [
  {
    field: 'timestamp',
    headerName: 'Timestamp',
    width: 200,
    valueFormatter: (value: Date) =>
      value.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
  },
  { field: 'user', headerName: 'User', width: 160 },
  { field: 'action', headerName: 'Action', flex: 1, minWidth: 300 },
]

interface AuditLogProps {
  entries: AuditEntry[]
}

export function AuditLog({ entries }: AuditLogProps) {
  return (
    <Box sx={{ p: 3, mt: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Audit Log
      </Typography>
      <DataGrid
        rows={entries}
        columns={columns}
        autoHeight
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        hideFooter
        density="compact"
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': { bgcolor: '#fafafa' },
          '& .MuiDataGrid-columnSeparator': { display: 'none' },
        }}
      />
    </Box>
  )
}
