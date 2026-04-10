import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { Channel } from '../types';
import { colors } from '../theme';

const channelColors: Record<Channel, { bg: string; text: string }> = {
  BDC: { bg: colors.blue[100], text: colors.blue[600] },
  Airbnb: { bg: colors.red[100], text: colors.red[500] },
  Expedia: { bg: colors.orange[100], text: colors.orange[600] },
};

const channelLabels: Record<Channel, string> = {
  BDC: 'Booking',
  Airbnb: 'Airbnb',
  Expedia: 'Expedia',
};

export default function ChannelBadge({ channel, fieldName }: { channel: Channel; fieldName?: string }) {
  const c = channelColors[channel];
  const chip = (
    <Chip
      label={channelLabels[channel]}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.text,
        fontWeight: 700,
        fontSize: '0.75rem',
        height: 22,
        mr: 0.5,
        cursor: fieldName ? 'help' : undefined,
      }}
    />
  );

  if (fieldName) {
    const channelDisplay = channel === 'BDC' ? 'Booking.com' : channel;
    return (
      <Tooltip title={`Maps to: ${fieldName} on ${channelDisplay}`} arrow placement="top">
        {chip}
      </Tooltip>
    );
  }

  return chip;
}
