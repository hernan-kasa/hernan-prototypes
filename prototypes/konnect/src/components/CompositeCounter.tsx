import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '../theme';
import { BDC_COMPOSITE_LIMIT, compositeLabels, descriptionTypes } from '../data/descriptionTypes';
import { DescriptionEntry } from '../types';

interface Props {
  compositeKey: string;
  totalChars: number;
  entries: Record<string, DescriptionEntry>;
}

export default function CompositeCounter({ compositeKey, totalChars, entries }: Props) {
  const [open, setOpen] = useState(false);
  const pct = (totalChars / BDC_COMPOSITE_LIMIT) * 100;
  const isWarning = pct > 90;
  const isError = pct > 100;

  const barColor = isError
    ? colors.red[400]
    : isWarning
      ? colors.orange[300]
      : colors.blue[400];

  // Get the description types that feed into this composite
  const contributingTypes = descriptionTypes.filter((dt) => dt.bdcComposite === compositeKey);

  return (
    <Box sx={{ mb: 1 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0.5,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setOpen(!open)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            sx={{
              p: 0,
              transition: 'transform 0.2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 16, color: colors.neutral[400] }} />
          </IconButton>
          <Typography variant="caption" sx={{ fontWeight: 700, color: colors.neutral[600] }}>
            Booking {compositeLabels[compositeKey]}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: isError ? colors.red[400] : isWarning ? colors.orange[400] : colors.neutral[600],
          }}
        >
          {totalChars.toLocaleString()} / {BDC_COMPOSITE_LIMIT.toLocaleString()} chars
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(pct, 100)}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: colors.neutral[200],
          '& .MuiLinearProgress-bar': {
            bgcolor: barColor,
            borderRadius: 3,
          },
        }}
      />
      <Collapse in={open}>
        <Box sx={{ mt: 1, pl: 2.5 }}>
          {contributingTypes.map((dt) => {
            const charCount = entries[dt.typeCode]?.text?.length || 0;
            return (
              <Box
                key={dt.typeCode}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.25,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography variant="caption" sx={{ color: charCount > 0 ? colors.neutral[700] : colors.neutral[400] }}>
                    {dt.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.neutral[400], fontFamily: 'monospace', fontSize: '0.625rem' }}>
                    {dt.typeCode}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    color: charCount > 0 ? colors.neutral[600] : colors.neutral[400],
                    fontSize: '0.625rem',
                  }}
                >
                  {charCount > 0 ? `${charCount} chars` : '—'}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
}
