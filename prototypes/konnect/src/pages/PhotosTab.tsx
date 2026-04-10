import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Link from '@mui/material/Link';
import SaveIcon from '@mui/icons-material/Save';
import SyncIcon from '@mui/icons-material/Sync';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import StarIcon from '@mui/icons-material/Star';
import CloudIcon from '@mui/icons-material/Cloud';
import SyncConfirmDialog from '../components/SyncConfirmDialog';
import { mockPhotos, MockPhoto, mockSyncStatus } from '../data/mockData';
import { colors } from '../theme';

interface Props {
  scopeKey: string;
  propertyId: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PhotosTab({ scopeKey, propertyId }: Props) {
  const initial = mockPhotos[scopeKey] || [];
  const [photos, setPhotos] = useState<MockPhoto[]>(() =>
    [...initial].sort((a, b) => a.priority - b.priority),
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedPendingSync, setSavedPendingSync] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncSnackOpen, setSyncSnackOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const channels = mockSyncStatus[propertyId] || [];

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback(
    (index: number) => {
      if (dragIndex === null || dragIndex === index) {
        setDragIndex(null);
        setDragOverIndex(null);
        return;
      }
      setPhotos((prev) => {
        const next = [...prev];
        const [dragged] = next.splice(dragIndex, 1);
        next.splice(index, 0, dragged);
        return next.map((p, i) => ({ ...p, priority: i }));
      });
      setDragIndex(null);
      setDragOverIndex(null);
      setHasUnsavedChanges(true);
    },
    [dragIndex],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  const handleSave = () => {
    mockPhotos[scopeKey] = photos.map((p) => ({ ...p }));
    setHasUnsavedChanges(false);
    setSavedPendingSync(true);
  };

  const handleSync = () => {
    setSyncDialogOpen(false);
    setSavedPendingSync(false);
    setSyncSnackOpen(true);
  };

  if (photos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ mb: 1, color: colors.neutral[700] }}>
          No photos loaded
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral[500], mb: 2 }}>
          Photos are managed in Contentful and will appear here once uploaded.
        </Typography>
        <Link href="#" underline="hover" sx={{ fontSize: '0.875rem', fontWeight: 700 }}>
          Open in Contentful <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5, verticalAlign: 'middle' }} />
        </Link>
      </Box>
    );
  }

  return (
    <Box>
      {/* Info banner */}
      <Alert
        severity="info"
        sx={{ mb: 2, alignItems: 'center' }}
        action={
          <Link href="#" underline="hover" sx={{ fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Open in Contentful <OpenInNewIcon sx={{ fontSize: 14 }} />
          </Link>
        }
      >
        Photos are managed in Contentful. Drag to reorder for channel distribution.
      </Alert>

      {/* Top bar: count + view toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ color: colors.neutral[700] }}>
          {photos.length} photos
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
          size="small"
        >
          <ToggleButton value="grid" sx={{ px: 1.5 }}>
            <GridViewIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton value="list" sx={{ px: 1.5 }}>
            <ViewListIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Save bar */}
      {savedPendingSync && !hasUnsavedChanges ? (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<SyncIcon />}
              onClick={() => setSyncDialogOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Sync to channels
            </Button>
          }
        >
          Photo order saved. Push changes to enabled channels?
        </Alert>
      ) : hasUnsavedChanges ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save Order
          </Button>
        </Box>
      ) : null}

      {/* Grid view */}
      {viewMode === 'grid' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 2,
          }}
        >
          {photos.map((photo, index) => {
            const isHero = photo.priority === 0;
            const isDragging = dragIndex === index;
            const isDragOver = dragOverIndex === index;

            return (
              <Box
                key={photo.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                sx={{
                  bgcolor: colors.neutral[50],
                  borderRadius: '12px',
                  border: `2px solid ${isHero ? colors.orange[300] : isDragOver ? colors.blue[300] : colors.neutral[200]}`,
                  overflow: 'hidden',
                  opacity: isDragging ? 0.4 : 1,
                  cursor: 'grab',
                  transition: 'border-color 0.15s, opacity 0.15s, transform 0.15s',
                  transform: isDragOver ? 'scale(1.02)' : 'none',
                  '&:active': { cursor: 'grabbing' },
                  '&:hover': { borderColor: isHero ? colors.orange[300] : colors.blue[200] },
                }}
              >
                {/* Placeholder image */}
                <Box
                  sx={{
                    height: isHero ? 160 : 130,
                    background: photo.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 600 }}>
                    {photo.imageTypeLabel}
                  </Typography>

                  {/* Priority badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: isHero ? colors.orange[300] : 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      borderRadius: '6px',
                      px: 0.75,
                      py: 0.25,
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                    }}
                  >
                    {isHero && <StarIcon sx={{ fontSize: 10 }} />}
                    {isHero ? 'Hero' : photo.priority}
                  </Box>

                  {/* Drag handle */}
                  <DragIndicatorIcon
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontSize: 16,
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  />
                </Box>

                {/* Card info */}
                <Box sx={{ px: 1.5, py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                    <Chip
                      label={photo.imageTypeLabel}
                      size="small"
                      sx={{
                        bgcolor: colors.neutral[200],
                        color: colors.neutral[600],
                        fontWeight: 700,
                        fontSize: '0.625rem',
                        height: 18,
                      }}
                    />
                    <CloudIcon sx={{ fontSize: 12, color: colors.neutral[400] }} titleAccess="Source: Contentful" />
                  </Box>
                  {photo.caption && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: colors.neutral[500],
                        display: 'block',
                        lineHeight: 1.3,
                        mt: 0.25,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {photo.caption}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, width: 60 }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 80 }}>Thumbnail</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Caption</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Last Updated</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 40 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {photos.map((photo, index) => {
                const isHero = photo.priority === 0;
                const isDragOver = dragOverIndex === index;
                return (
                  <TableRow
                    key={photo.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      cursor: 'grab',
                      opacity: dragIndex === index ? 0.4 : 1,
                      bgcolor: isDragOver ? colors.blue[100] : 'transparent',
                      '&:active': { cursor: 'grabbing' },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DragIndicatorIcon sx={{ fontSize: 14, color: colors.neutral[400] }} />
                        {isHero ? (
                          <Chip
                            icon={<StarIcon sx={{ fontSize: 12 }} />}
                            label="Hero"
                            size="small"
                            sx={{ bgcolor: colors.orange[100], color: colors.orange[600], fontWeight: 700, fontSize: '0.675rem', height: 22 }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{photo.priority}</Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          width: 56,
                          height: 40,
                          borderRadius: '6px',
                          background: photo.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.5rem', fontWeight: 600 }}>
                          {photo.imageTypeLabel}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={photo.imageTypeLabel}
                        size="small"
                        sx={{ bgcolor: colors.neutral[200], color: colors.neutral[600], fontWeight: 700, fontSize: '0.675rem', height: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
                        {photo.caption || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                        {formatDate(photo.lastUpdated)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CloudIcon sx={{ fontSize: 14, color: colors.neutral[400] }} titleAccess="Source: Contentful" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <SyncConfirmDialog
        open={syncDialogOpen}
        channels={channels}
        contentType="descriptions"
        onClose={() => setSyncDialogOpen(false)}
        onConfirm={handleSync}
      />
      <Snackbar
        open={syncSnackOpen}
        autoHideDuration={4000}
        onClose={() => setSyncSnackOpen(false)}
        message="Sync triggered. Photo ordering is being pushed to enabled channels via NextPax."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
}
