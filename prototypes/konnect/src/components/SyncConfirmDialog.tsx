import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import { ChannelSyncStatus } from '../types';
import { colors } from '../theme';

interface Props {
  open: boolean;
  channels: ChannelSyncStatus[];
  contentType: 'descriptions' | 'amenities' | 'all';
  onClose: () => void;
  onConfirm: () => void;
}

const contentLabel: Record<string, string> = {
  descriptions: 'descriptions',
  amenities: 'amenities',
  all: 'all saved content',
};

export default function SyncConfirmDialog({ open, channels, contentType, onClose, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Content Sync</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          This will push {contentLabel[contentType]} to enabled channels via NextPax. Channels with sync disabled will not be affected.
        </Typography>
        <Alert severity="warning" sx={{ mt: 2, mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            Full replace — the API sends the complete {contentLabel[contentType]} set. Any items not included in the payload will be deleted on the channel.
          </Typography>
        </Alert>
        <Box sx={{ mt: 1.5 }}>
          {channels.map((ch) => (
            <Box key={ch.channelId} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              {ch.contentEnabled ? (
                <CheckCircleIcon sx={{ fontSize: 16, color: colors.green[300] }} />
              ) : (
                <BlockIcon sx={{ fontSize: 16, color: colors.neutral[400] }} />
              )}
              <Typography variant="body2">
                {ch.channelName} — {ch.contentEnabled ? 'will sync' : ch.enabled ? 'content sync off' : 'channel disabled'}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained">
          Sync Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
