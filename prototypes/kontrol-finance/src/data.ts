export interface FolioWindow {
  id: number
  name: string
  paymentMethodLabel?: string
}

export type ItemType = 'charge' | 'tax' | 'credit' | 'payment' | 'refund'

export interface FinancialItem {
  id: string
  name: string
  windowId: number
  type: ItemType
  amount: number // positive = charge, negative = credit/payment
  parentId?: string
}

export interface AuditEntry {
  id: string
  timestamp: Date
  user: string
  action: string
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

export const initialWindows: FolioWindow[] = [
  { id: 1, name: 'Room & Tax', paymentMethodLabel: 'Company card ending 4242' },
  { id: 2, name: 'Incidentals', paymentMethodLabel: 'Guest card ending 8888' },
]

export const initialItems: FinancialItem[] = [
  // Window 1: Room & Tax
  { id: 'w1-room', name: 'Room revenue', windowId: 1, type: 'charge', amount: 600 },
  { id: 'w1-city-tax', name: 'City tax', windowId: 1, type: 'tax', amount: 60, parentId: 'w1-room' },
  { id: 'w1-state-tax', name: 'State tax', windowId: 1, type: 'tax', amount: 30, parentId: 'w1-room' },
  { id: 'w1-resort', name: 'Resort fee', windowId: 1, type: 'charge', amount: 75 },
  { id: 'w1-cleaning', name: 'Cleaning fee', windowId: 1, type: 'charge', amount: 150 },
  { id: 'w1-cleaning-tax', name: 'Cleaning tax', windowId: 1, type: 'tax', amount: 15, parentId: 'w1-cleaning' },
  { id: 'w1-payment', name: 'Stripe charge •••• 4242', windowId: 1, type: 'payment', amount: -930 },

  // Window 2: Incidentals
  { id: 'w2-parking', name: 'Parking fee', windowId: 2, type: 'charge', amount: 45 },
  { id: 'w2-parking-tax', name: 'Parking fee tax', windowId: 2, type: 'tax', amount: 4.5, parentId: 'w2-parking' },
  { id: 'w2-pet', name: 'Pet fee', windowId: 2, type: 'charge', amount: 75 },
  { id: 'w2-pet-tax', name: 'Pet fee tax', windowId: 2, type: 'tax', amount: 7.5, parentId: 'w2-pet' },
  { id: 'w2-late', name: 'Late checkout', windowId: 2, type: 'charge', amount: 50 },
]

export const initialAuditLog: AuditEntry[] = [
  {
    id: 'a1',
    timestamp: new Date('2026-03-28T14:30:00'),
    user: 'System',
    action: 'Reservation created with Window 1: Room & Tax',
  },
  {
    id: 'a2',
    timestamp: new Date('2026-03-29T09:15:00'),
    user: 'Hernan Perla',
    action: 'Window 2: Incidentals created',
  },
  {
    id: 'a3',
    timestamp: new Date('2026-03-30T11:00:00'),
    user: 'John Marren',
    action: 'Parking fee moved from Window 1 → Window 2',
  },
  {
    id: 'a4',
    timestamp: new Date('2026-03-31T16:45:00'),
    user: 'System',
    action: 'Stripe charge $930.00 applied to Window 1',
  },
]
