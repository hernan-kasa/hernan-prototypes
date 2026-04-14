import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { colors } from '../theme';

interface RoomTypeOption {
  id: string;
  name: string;
  hasExistingContent: boolean;
}

interface Props {
  open: boolean;
  contentType: 'descriptions' | 'amenities';
  roomTypes: RoomTypeOption[];
  onConfirm: (selectedIds: string[]) => void;
  onClose: () => void;
}

export default function CascadeDialog({ open, contentType, roomTypes, onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(roomTypes.map((rt) => rt.id)));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected));
  };

  const hasConflicts = roomTypes.some((rt) => rt.hasExistingContent && selected.has(rt.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountTreeIcon sx={{ color: colors.blue[400] }} />
        Apply {contentType} to room types
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: colors.neutral[600], mb: 2 }}>
          Property-level {contentType} will be copied to the selected room types as a draft baseline.
          Each room type can then be customized independently.
        </Typography>

        {hasConflicts && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Room types with existing content will be overwritten. Their current {contentType} will be replaced with the property-level content.
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {roomTypes.map((rt) => (
            <Box
              key={rt.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1,
                py: 0.5,
                borderRadius: '8px',
                bgcolor: selected.has(rt.id) ? colors.blue[100] : 'transparent',
                '&:hover': { bgcolor: selected.has(rt.id) ? colors.blue[100] : colors.neutral[100] },
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selected.has(rt.id)}
                    onChange={() => toggle(rt.id)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {rt.name}
                  </Typography>
                }
              />
              {rt.hasExistingContent && selected.has(rt.id) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WarningAmberIcon sx={{ fontSize: 14, color: colors.orange[400] }} />
                  <Typography variant="caption" sx={{ color: colors.orange[400] }}>
                    Will overwrite
                  </Typography>
                </Box>
              )}
              {rt.hasExistingContent && !selected.has(rt.id) && (
                <Typography variant="caption" sx={{ color: colors.neutral[400] }}>
                  Has content — skipped
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text" sx={{ color: colors.neutral[600] }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selected.size === 0}
          startIcon={<AccountTreeIcon />}
        >
          Apply to {selected.size} room type{selected.size !== 1 ? 's' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
