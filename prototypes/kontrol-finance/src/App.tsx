import { useState, useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box, Container, Typography, Chip } from '@mui/material'
import { FinanceStatus } from './FinanceStatus'
import { FinancialItems } from './FinancialItems'
import { AuditLog } from './AuditLog'
import {
  type FolioWindow, type FinancialItem, type AuditEntry, type ItemType,
  initialWindows, initialItems, initialAuditLog,
} from './data'

const theme = createTheme({
  palette: {
    background: { default: '#f5f5f5' },
  },
})

export default function App() {
  const [windows, setWindows] = useState<FolioWindow[]>(initialWindows)
  const [items, setItems] = useState<FinancialItem[]>(initialItems)
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(initialAuditLog)
  const [selectedWindowId, setSelectedWindowId] = useState<number | null>(null)
  const [activeView, setActiveView] = useState<'total' | 'nightly'>('total')
  const [activeFilter, setActiveFilter] = useState<ItemType | 'all'>('all')

  // Filter items by selected window + type
  const filteredItems = useMemo(() => {
    let result = items
    if (selectedWindowId !== null) {
      result = result.filter(i => i.windowId === selectedWindowId)
    }
    if (activeFilter !== 'all') {
      result = result.filter(i => i.type === activeFilter)
    }
    return result
  }, [items, selectedWindowId, activeFilter])

  // Totals for finance status cards (not affected by type filter)
  const totals = useMemo(() => {
    const relevant = selectedWindowId !== null
      ? items.filter(i => i.windowId === selectedWindowId)
      : items

    const totalPayments = relevant
      .filter(i => i.type === 'payment')
      .reduce((sum, i) => sum + Math.abs(i.amount), 0)

    const totalCharges = relevant
      .filter(i => i.amount > 0)
      .reduce((sum, i) => sum + i.amount, 0)

    return { totalPayments, outstandingBalance: totalCharges - totalPayments }
  }, [items, selectedWindowId])

  const handleMoveItem = (itemId: string, targetWindowId: number) => {
    const item = items.find(i => i.id === itemId)
    if (!item) return

    const sourceWindow = windows.find(w => w.id === item.windowId)
    const targetWindow = windows.find(w => w.id === targetWindowId)
    if (!sourceWindow || !targetWindow) return

    // Move item + children
    setItems(prev => prev.map(i =>
      (i.id === itemId || i.parentId === itemId)
        ? { ...i, windowId: targetWindowId }
        : i
    ))

    setAuditLog(prev => [{
      id: `a-${Date.now()}`,
      timestamp: new Date(),
      user: 'Hernan Perla',
      action: `${item.name} moved from Window ${sourceWindow.id}: ${sourceWindow.name} → Window ${targetWindow.id}: ${targetWindow.name}`,
    }, ...prev])
  }

  const handleAddWindow = (name: string, paymentMethodLabel?: string) => {
    const newId = Math.max(...windows.map(w => w.id)) + 1
    setWindows(prev => [...prev, { id: newId, name, paymentMethodLabel }])

    setAuditLog(prev => [{
      id: `a-${Date.now()}`,
      timestamp: new Date(),
      user: 'Hernan Perla',
      action: `Window ${newId}: ${name} created`,
    }, ...prev])
  }

  const handleCloseWindow = (windowId: number, moveToWindowId?: number) => {
    const closedWindow = windows.find(w => w.id === windowId)

    if (moveToWindowId) {
      const targetWindow = windows.find(w => w.id === moveToWindowId)
      setItems(prev => prev.map(i =>
        i.windowId === windowId ? { ...i, windowId: moveToWindowId } : i
      ))
      setAuditLog(prev => [{
        id: `a-${Date.now()}`,
        timestamp: new Date(),
        user: 'Hernan Perla',
        action: `Window ${windowId}: ${closedWindow?.name} closed — items moved to Window ${moveToWindowId}: ${targetWindow?.name}`,
      }, ...prev])
    } else {
      setAuditLog(prev => [{
        id: `a-${Date.now()}`,
        timestamp: new Date(),
        user: 'Hernan Perla',
        action: `Window ${windowId}: ${closedWindow?.name} closed (empty)`,
      }, ...prev])
    }

    setWindows(prev => prev.filter(w => w.id !== windowId))
    setSelectedWindowId(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 3 }}>
        <Container maxWidth="lg">
          {/* Reservation header */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" color="text.secondary">
              Reservation
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                KAS-2026-0412
              </Typography>
              <Chip label="Confirmed" color="success" size="small" />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              John Smith · Apr 1–4, 2026 · 3 nights · Kasa South Beach
            </Typography>
          </Box>

          <FinanceStatus
            totals={totals}
            selectedWindowId={selectedWindowId}
            windows={windows}
          />

          <FinancialItems
            items={filteredItems}
            allItems={items}
            windows={windows}
            selectedWindowId={selectedWindowId}
            activeView={activeView}
            activeFilter={activeFilter}
            onSelectWindow={setSelectedWindowId}
            onSelectView={setActiveView}
            onSelectFilter={setActiveFilter}
            onMoveItem={handleMoveItem}
            onAddWindow={handleAddWindow}
            onCloseWindow={handleCloseWindow}
          />

          <AuditLog entries={auditLog} />
        </Container>
      </Box>
    </ThemeProvider>
  )
}
