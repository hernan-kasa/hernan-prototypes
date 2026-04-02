import { useState, useMemo } from 'react'
import {
  Box, Typography, Tabs, Tab, Chip, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, FormControl, InputLabel, Select, Tooltip,
} from '@mui/material'
import { MoreVert, Add, Close } from '@mui/icons-material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { type FinancialItem, type FolioWindow, type ItemType, formatCurrency } from './data'

const filterOptions: { key: ItemType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'charge', label: 'Charges' },
  { key: 'refund', label: 'Refunds' },
  { key: 'tax', label: 'Taxes' },
  { key: 'credit', label: 'Credits' },
  { key: 'payment', label: 'Payments' },
]

interface FinancialItemsProps {
  items: FinancialItem[]
  allItems: FinancialItem[]
  windows: FolioWindow[]
  selectedWindowId: number | null
  activeView: 'total' | 'nightly'
  activeFilter: ItemType | 'all'
  onSelectWindow: (id: number | null) => void
  onSelectView: (view: 'total' | 'nightly') => void
  onSelectFilter: (filter: ItemType | 'all') => void
  onMoveItem: (itemId: string, targetWindowId: number) => void
  onAddWindow: (name: string, paymentMethodLabel?: string) => void
  onCloseWindow: (windowId: number, moveToWindowId?: number) => void
}

export function FinancialItems({
  items, allItems, windows, selectedWindowId, activeView, activeFilter,
  onSelectWindow, onSelectView, onSelectFilter, onMoveItem, onAddWindow, onCloseWindow,
}: FinancialItemsProps) {
  // Row action menu
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  const [menuItemId, setMenuItemId] = useState<string | null>(null)

  // Move dialog
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [moveTargetWindowId, setMoveTargetWindowId] = useState<number | ''>('')

  // Add window dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newWindowName, setNewWindowName] = useState('')
  const [newWindowPayment, setNewWindowPayment] = useState('')

  // Close window dialog (only shown when window has items)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [closeTargetWindowId, setCloseTargetWindowId] = useState<number | ''>('')

  // Sort rows: group by window, parents before children
  const sortedRows = useMemo(() => {
    const result: FinancialItem[] = []
    const windowIds = [...new Set(items.map(i => i.windowId))].sort((a, b) => a - b)

    for (const wId of windowIds) {
      const wItems = items.filter(i => i.windowId === wId)
      const parents = wItems.filter(i => !i.parentId)
      for (const parent of parents) {
        result.push(parent)
        result.push(...wItems.filter(i => i.parentId === parent.id))
      }
      // orphans whose parent was filtered out
      const added = new Set(result.map(i => i.id))
      wItems.forEach(i => { if (!added.has(i.id)) result.push(i) })
    }
    return result
  }, [items])

  // Track visible IDs for child indentation
  const visibleIds = useMemo(() => new Set(sortedRows.map(r => r.id)), [sortedRows])

  // Footer totals (not affected by type filter)
  const footerTotals = useMemo(() => {
    const relevant = selectedWindowId !== null
      ? allItems.filter(i => i.windowId === selectedWindowId)
      : allItems
    const charges = relevant.filter(i => i.amount > 0).reduce((s, i) => s + i.amount, 0)
    const credits = relevant.filter(i => i.amount < 0).reduce((s, i) => s + Math.abs(i.amount), 0)
    return { total: charges, outstanding: charges - credits }
  }, [allItems, selectedWindowId])

  // Columns
  const columns: GridColDef<FinancialItem>[] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Item',
      width: 300,
      sortable: false,
      renderCell: (params) => {
        const isChild = params.row.parentId && visibleIds.has(params.row.parentId)
        return (
          <Box sx={{ pl: isChild ? 3 : 0, display: 'flex', alignItems: 'center', height: '100%' }}>
            {isChild && (
              <Typography component="span" sx={{ color: 'text.disabled', mr: 0.5, fontSize: '0.9rem' }}>
                ↳
              </Typography>
            )}
            <Typography variant="body2">{params.value as string}</Typography>
          </Box>
        )
      },
    },
    {
      field: 'windowId',
      headerName: 'Window',
      width: 120,
      sortable: false,
      valueFormatter: (value: number) => {
        const w = windows.find(win => win.id === value)
        return w ? `Window ${w.id}` : ''
      },
    },
    {
      field: 'chargeAmount',
      headerName: 'Charges',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      valueGetter: (_v: unknown, row: FinancialItem) => row.amount > 0 ? row.amount : null,
      renderCell: (params) =>
        params.value != null ? formatCurrency(params.value as number) : '',
    },
    {
      field: 'creditAmount',
      headerName: 'Credit',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      valueGetter: (_v: unknown, row: FinancialItem) => row.amount < 0 ? Math.abs(row.amount) : null,
      renderCell: (params) =>
        params.value != null ? (
          <span style={{ color: '#d32f2f' }}>{formatCurrency(params.value as number)}</span>
        ) : '',
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.parentId || params.row.type === 'payment') return null
        return (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              setMenuAnchor(e.currentTarget)
              setMenuItemId(params.row.id)
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        )
      },
    },
  ], [windows, visibleIds])

  const columnVisibilityModel = useMemo(() => ({
    windowId: selectedWindowId === null,
  }), [selectedWindowId])

  // Handlers
  const handleMenuClose = () => { setMenuAnchor(null); setMenuItemId(null) }

  const handleMoveClick = () => {
    setMoveDialogOpen(true)
    setMenuAnchor(null)
  }

  const handleMoveSubmit = () => {
    if (menuItemId && moveTargetWindowId !== '') {
      onMoveItem(menuItemId, moveTargetWindowId as number)
      setMoveDialogOpen(false)
      setMoveTargetWindowId('')
      setMenuItemId(null)
    }
  }

  const handleMoveCancel = () => {
    setMoveDialogOpen(false)
    setMoveTargetWindowId('')
    setMenuItemId(null)
  }

  const handleAddSubmit = () => {
    if (newWindowName.trim()) {
      onAddWindow(newWindowName.trim(), newWindowPayment.trim() || undefined)
      setAddDialogOpen(false)
      setNewWindowName('')
      setNewWindowPayment('')
    }
  }

  // Close window
  const selectedWindow = selectedWindowId !== null
    ? windows.find(w => w.id === selectedWindowId)
    : null
  const selectedWindowItemCount = selectedWindowId !== null
    ? allItems.filter(i => i.windowId === selectedWindowId).length
    : 0

  const handleCloseWindowClick = () => {
    if (!selectedWindowId) return
    if (selectedWindowItemCount === 0) {
      onCloseWindow(selectedWindowId)
    } else {
      setCloseDialogOpen(true)
    }
  }

  const handleCloseSubmit = () => {
    if (selectedWindowId && closeTargetWindowId !== '') {
      onCloseWindow(selectedWindowId, closeTargetWindowId as number)
      setCloseDialogOpen(false)
      setCloseTargetWindowId('')
    }
  }

  const moveItem = menuItemId ? allItems.find(i => i.id === menuItemId) : null

  return (
    <Box sx={{ p: 3, mt: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
      {/* Section header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Financial Items</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {selectedWindowId !== null && (
            <Tooltip title={windows.length <= 1 ? 'Cannot close the only window' : ''}>
              <span>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Close />}
                  onClick={handleCloseWindowClick}
                  disabled={windows.length <= 1}
                  sx={{ textTransform: 'none' }}
                >
                  Close Window
                </Button>
              </span>
            </Tooltip>
          )}
          <Tooltip title="Not part of prototype">
            <span>
              <Button variant="contained" startIcon={<Add />} disabled>
                Add charges
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Window tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedWindowId ?? 'all'}
          onChange={(_, v) => {
            if (v === 'add') {
              setAddDialogOpen(true)
            } else if (v === 'all') {
              onSelectWindow(null)
            } else {
              onSelectWindow(v as number)
            }
          }}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', minHeight: 44 },
            '& .Mui-selected': { bgcolor: '#e3f2fd', borderRadius: '8px 8px 0 0' },
          }}
        >
          <Tab label="All" value="all" />
          {windows.map(w => (
            <Tab key={w.id} label={`Window ${w.id}: ${w.name}`} value={w.id} />
          ))}
          <Tab
            label="+ Add Window"
            value="add"
            sx={{ color: '#1976d2 !important', fontWeight: 500, opacity: '1 !important' }}
          />
        </Tabs>
      </Box>

      {/* View tabs */}
      <Tabs
        value={activeView}
        onChange={(_, v) => onSelectView(v)}
        sx={{
          mt: 1,
          minHeight: 36,
          '& .MuiTab-root': { textTransform: 'none', minHeight: 36, py: 0 },
        }}
      >
        <Tab label="Total costs" value="total" />
        <Tab label="Nightly costs" value="nightly" />
      </Tabs>

      {/* Filter chips */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2, flexWrap: 'wrap' }}>
        {filterOptions.map(f => (
          <Chip
            key={f.key}
            label={f.label}
            onClick={() => onSelectFilter(f.key)}
            variant={activeFilter === f.key ? 'filled' : 'outlined'}
            sx={{
              bgcolor: activeFilter === f.key ? '#e3f2fd' : 'transparent',
              fontWeight: activeFilter === f.key ? 600 : 400,
              borderColor: activeFilter === f.key ? 'transparent' : 'divider',
              '&:hover': { bgcolor: activeFilter === f.key ? '#bbdefb' : undefined },
            }}
          />
        ))}
      </Box>

      {/* Grid or placeholder */}
      {activeView === 'nightly' ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">Nightly view not included in prototype</Typography>
        </Box>
      ) : (
        <>
          <DataGrid
            rows={sortedRows}
            columns={columns}
            columnVisibilityModel={columnVisibilityModel}
            getRowId={(row) => row.id}
            autoHeight
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnMenu
            hideFooter
            rowHeight={44}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: '#fafafa',
                borderBottom: '2px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
              '& .MuiDataGrid-columnSeparator': { display: 'none' },
            }}
          />

          {/* Footer totals */}
          <Box sx={{
            maxWidth: 500,
            ml: 'auto',
            mt: 2,
            pt: 2,
            borderTop: '2px solid',
            borderColor: 'divider',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">Total</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {formatCurrency(footerTotals.total)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">Outstanding balance</Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: footerTotals.outstanding > 0 ? '#d32f2f' : '#2e7d32',
                }}
              >
                {formatCurrency(footerTotals.outstanding)}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* Row action menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMoveClick}>Move to Window…</MenuItem>
      </Menu>

      {/* Move to Window dialog */}
      <Dialog open={moveDialogOpen} onClose={handleMoveCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Move "{moveItem?.name}"</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {moveItem?.parentId ? '' : 'Child items (taxes) will move with this item.'}
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="move-target-label">Target window</InputLabel>
            <Select
              labelId="move-target-label"
              value={moveTargetWindowId}
              label="Target window"
              onChange={(e) => setMoveTargetWindowId(e.target.value as number)}
            >
              {windows
                .filter(w => moveItem ? w.id !== moveItem.windowId : true)
                .map(w => (
                  <MenuItem key={w.id} value={w.id}>
                    Window {w.id}: {w.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMoveCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleMoveSubmit} disabled={moveTargetWindowId === ''}>
            Move
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Window dialog (shown when window has items) */}
      <Dialog open={closeDialogOpen} onClose={() => { setCloseDialogOpen(false); setCloseTargetWindowId('') }} maxWidth="xs" fullWidth>
        <DialogTitle>Close Window {selectedWindow?.id}: {selectedWindow?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This window contains {selectedWindowItemCount} item(s). Move all items to another window before closing.
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="close-target-label">Move items to</InputLabel>
            <Select
              labelId="close-target-label"
              value={closeTargetWindowId}
              label="Move items to"
              onChange={(e) => setCloseTargetWindowId(e.target.value as number)}
            >
              {windows
                .filter(w => w.id !== selectedWindowId)
                .map(w => (
                  <MenuItem key={w.id} value={w.id}>
                    Window {w.id}: {w.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCloseDialogOpen(false); setCloseTargetWindowId('') }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleCloseSubmit} disabled={closeTargetWindowId === ''}>
            Move Items & Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Window dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create new folio window</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Window name"
            placeholder="e.g., Incidentals, Group charges"
            value={newWindowName}
            onChange={(e) => setNewWindowName(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            fullWidth
            label="Payment method label (optional)"
            placeholder="e.g., Company card ending 4242"
            value={newWindowPayment}
            onChange={(e) => setNewWindowPayment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSubmit} disabled={!newWindowName.trim()}>
            Create Window
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
