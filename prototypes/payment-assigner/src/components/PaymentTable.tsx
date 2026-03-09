import { useState } from 'react';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from '@mui/x-data-grid';
import {
  Chip,
  IconButton,
  Tooltip,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Link,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import type { Payment } from '../types';
import { formatCents, formatDateTime } from '../utils/format';
import { PAYMENT_METHOD_LABELS } from '../data/mock';

type View = 'unassigned' | 'group' | 'manual';

interface Props {
  payments: Payment[];
  onAssign: (payment: Payment) => void;
  onVoid: (payment: Payment) => void;
  filter: 'all' | 'unassigned';
  onFilterChange: (filter: 'all' | 'unassigned') => void;
  view: View;
}

export function PaymentTable({
  payments,
  onAssign,
  onVoid,
  filter,
  onFilterChange,
  view,
}: Props) {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  // Sub-filter only applies to manual view
  const filteredPayments =
    view === 'manual' && filter === 'unassigned'
      ? payments.filter((p) => p.assignments.length === 0)
      : payments;

  // --- Column definitions per view ---

  const stripeColumns: GridColDef<Payment>[] = [
    {
      field: 'paymentIntentId',
      headerName: 'Stripe payment ID',
      flex: 1,
      minWidth: 240,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Link
          href="#"
          underline="hover"
          sx={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#1976D2' }}
          onClick={(e) => e.preventDefault()}
        >
          {params.row.paymentIntentId}
        </Link>
      ),
    },
    {
      field: 'transactionType',
      headerName: 'Type',
      width: 100,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Chip
          label={params.row.transactionType === 'charge' ? 'Charge' : 'Refund'}
          size="small"
          sx={{
            bgcolor:
              params.row.transactionType === 'charge' ? '#E3F2FD' : '#FFF3E0',
            color:
              params.row.transactionType === 'charge' ? '#1565C0' : '#E65100',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      ),
    },
    {
      field: 'stripeStatus',
      headerName: 'Status',
      width: 100,
      renderCell: (params: GridRenderCellParams<Payment>) => {
        const status = params.row.stripeStatus ?? 'success';
        return (
          <Chip
            label={status === 'success' ? 'Success' : 'Error'}
            size="small"
            sx={{
              bgcolor: status === 'success' ? '#E8F5E9' : '#FFEBEE',
              color: status === 'success' ? '#2E7D32' : '#C62828',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Amount sum',
      width: 130,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Typography variant="body2">{formatCents(params.row.amount)}</Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 190,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          {formatDateTime(params.row.createdAt)}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
          {params.row.description}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      headerAlign: 'right',
      align: 'right',
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Link
          href="#"
          underline="hover"
          sx={{ fontSize: '0.85rem', color: '#1976D2', cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault();
            onAssign(params.row);
          }}
        >
          Assign to reservation(s)
        </Link>
      ),
    },
  ];

  const manualColumns: GridColDef<Payment>[] = [
    {
      field: 'source',
      headerName: 'Source',
      width: 120,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Chip
          label={
            PAYMENT_METHOD_LABELS[params.row.manualPaymentMethod ?? 'other']
          }
          size="small"
          sx={{
            bgcolor: '#E8F5E9',
            color: '#2E7D32',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      ),
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 180,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
        >
          {params.row.id}
        </Typography>
      ),
    },
    {
      field: 'transactionType',
      headerName: 'Type',
      width: 85,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Chip
          label={params.row.transactionType === 'charge' ? 'Charge' : 'Refund'}
          size="small"
          variant="outlined"
          color={params.row.transactionType === 'charge' ? 'default' : 'warning'}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      renderCell: (params: GridRenderCellParams<Payment>) => {
        if (params.row.status === 'voided') {
          return (
            <Chip
              label="Voided"
              size="small"
              sx={{ bgcolor: '#FFEBEE', color: '#C62828' }}
            />
          );
        }
        return (
          <Chip
            label="Active"
            size="small"
            sx={{ bgcolor: '#E3F2FD', color: '#1565C0' }}
          />
        );
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 110,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatCents(params.row.amount)}
        </Typography>
      ),
    },
    {
      field: 'assignments',
      headerName: 'Assigned',
      width: 100,
      renderCell: (params: GridRenderCellParams<Payment>) => {
        const count = params.row.assignments.length;
        if (count === 0) {
          return (
            <Chip
              label="Unassigned"
              size="small"
              sx={{ bgcolor: '#FFF3E0', color: '#E65100', fontSize: '0.7rem' }}
            />
          );
        }
        return (
          <Chip
            label={`${count} res.`}
            size="small"
            sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontSize: '0.7rem' }}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 150,
      renderCell: (params: GridRenderCellParams<Payment>) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          {formatDateTime(params.row.createdAt)}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'actions',
      headerName: '',
      width: 140,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Payment>) => {
        const isVoided = params.row.status === 'voided';
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Link
              href="#"
              underline="hover"
              sx={{
                fontSize: '0.85rem',
                color: isVoided ? 'text.disabled' : '#1976D2',
                cursor: isVoided ? 'default' : 'pointer',
                pointerEvents: isVoided ? 'none' : 'auto',
              }}
              onClick={(e) => {
                e.preventDefault();
                if (!isVoided) onAssign(params.row);
              }}
            >
              Assign to reservation(s)
            </Link>
            {!isVoided && (
              <Tooltip title="Void payment">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onVoid(params.row)}
                >
                  <BlockIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        );
      },
    },
  ];

  const columns = view === 'manual' ? manualColumns : stripeColumns;

  return (
    <Box>
      {/* Sub-filter: only for Manual view */}
      {view === 'manual' && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToggleButtonGroup
            size="small"
            value={filter}
            exclusive
            onChange={(_, val) => val && onFilterChange(val)}
          >
            <ToggleButton value="all">All Payments</ToggleButton>
            <ToggleButton value="unassigned">Unassigned Only</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="body2" color="text.secondary">
            {filteredPayments.length} payment(s)
          </Typography>
        </Box>
      )}
      <DataGrid
        rows={filteredPayments}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight
        getRowClassName={(params) =>
          params.row.status === 'voided' ? 'voided-row' : ''
        }
        sx={{
          '& .voided-row': { opacity: 0.5 },
          border: '1px solid #E0E0E0',
          borderRadius: 2,
        }}
      />
    </Box>
  );
}
