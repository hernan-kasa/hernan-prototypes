import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import SaveIcon from '@mui/icons-material/Save';
import SyncIcon from '@mui/icons-material/Sync';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ChannelBadge from '../components/ChannelBadge';
import CompositeCounter from '../components/CompositeCounter';
import SyncConfirmDialog from '../components/SyncConfirmDialog';
import { descriptionTypes, compositeLabels, BDC_COMPOSITE_LIMIT, AIRBNB_SUMMARY_LIMIT } from '../data/descriptionTypes';
import { mockDescriptions, mockSyncStatus } from '../data/mockData';
import { DescriptionEntry, DescriptionPriority, Channel } from '../types';
import { colors } from '../theme';

const priorityLabels: Record<DescriptionPriority, string> = {
  core: 'Core Descriptions',
  'bdc-supplementary': 'Booking Supplementary',
  'bdc-specialized': 'Booking Specialized',
};

const prioritySubtitles: Record<DescriptionPriority, string> = {
  core: 'Used by multiple channels — fill these first',
  'bdc-supplementary': 'Additional fields for Booking.com',
  'bdc-specialized': 'Booking.com only — lower priority',
};

interface Props {
  scopeKey: string; // propertyId or roomTypeId
  propertyId: string;
}

export default function DescriptionsTab({ scopeKey, propertyId }: Props) {
  const initial = mockDescriptions[scopeKey] || [];
  const [entries, setEntries] = useState<Record<string, DescriptionEntry>>(() => {
    const map: Record<string, DescriptionEntry> = {};
    initial.forEach((e) => (map[e.typeCode] = { ...e }));
    return map;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedPendingSync, setSavedPendingSync] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncSnackOpen, setSyncSnackOpen] = useState(false);
  const [startedWriting, setStartedWriting] = useState(false);
  const channels = mockSyncStatus[propertyId] || [];

  const handleTextChange = (typeCode: string, text: string) => {
    setEntries((prev) => ({
      ...prev,
      [typeCode]: {
        ...(prev[typeCode] || {
          typeCode,
          language: 'EN',
          text: '',
          lastModifiedBy: '',
          lastModifiedAt: '',
          lastSyncedAt: null,
          lastSyncStatus: null,
        }),
        text,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Compute BDC composite totals
  const compositeTotals = useMemo(() => {
    const totals: Record<string, number> = {
      welcome_message: 0,
      neighborhood_info: 0,
      owner_info: 0,
    };
    descriptionTypes.forEach((dt) => {
      if (dt.bdcComposite && entries[dt.typeCode]) {
        totals[dt.bdcComposite] += entries[dt.typeCode].text.length;
      }
    });
    return totals;
  }, [entries]);

  const handleSave = () => {
    setHasUnsavedChanges(false);
    setSavedPendingSync(true);
  };

  const handleSync = () => {
    setSyncDialogOpen(false);
    setSavedPendingSync(false);
    setSyncSnackOpen(true);
  };

  const isEmpty = !startedWriting && initial.length === 0 && Object.keys(entries).every((k) => !entries[k]?.text);

  if (isEmpty) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ mb: 1, color: colors.neutral[700] }}>
          No descriptions authored yet
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral[500], mb: 3 }}>
          Start with the core types used by all channels: Property Description, House Rules, Fine Print, and Short Introduction.
        </Typography>
        <Button variant="contained" onClick={() => setStartedWriting(true)}>
          Start Writing
        </Button>
      </Box>
    );
  }

  const groups: DescriptionPriority[] = ['core', 'bdc-supplementary', 'bdc-specialized'];

  return (
    <Box>
      {/* BDC Composite counters */}
      <Card sx={{ mb: 3, bgcolor: colors.neutral[100], border: `1px solid ${colors.neutral[200]}` }}>
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Booking Composite Message Limits
          </Typography>
          {Object.keys(compositeTotals).map((key) => (
            <CompositeCounter key={key} compositeKey={key} totalChars={compositeTotals[key]} entries={entries} />
          ))}
        </CardContent>
      </Card>

      {/* Save button bar + post-save sync banner */}
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
          Descriptions saved. Push changes to enabled channels?
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            Save Descriptions
          </Button>
        </Box>
      )}

      {groups.map((priority) => {
        const typesInGroup = descriptionTypes.filter((dt) => dt.priority === priority);
        // Find which composites are in this group
        const compositeKeys = [...new Set(typesInGroup.map((dt) => dt.bdcComposite).filter(Boolean))] as string[];

        return (
          <Box key={priority} sx={{ mb: 4 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" sx={{ color: colors.neutral[800] }}>
                {priorityLabels[priority]}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                {prioritySubtitles[priority]}
              </Typography>
              {priority !== 'core' && (
                <Chip
                  label="Booking only"
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: colors.neutral[200],
                    color: colors.neutral[600],
                    fontWeight: 700,
                    fontSize: '0.625rem',
                    height: 20,
                    verticalAlign: 'middle',
                  }}
                />
              )}
            </Box>

            {/* Show composite running total inline for this group */}
            {compositeKeys.map((ck) => {
              const total = compositeTotals[ck];
              const pct = (total / BDC_COMPOSITE_LIMIT) * 100;
              if (total === 0) return null;
              return (
                <Alert
                  key={ck}
                  severity={pct > 100 ? 'error' : pct > 90 ? 'warning' : 'info'}
                  sx={{ mb: 1.5, py: 0 }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {compositeLabels[ck]}: {total.toLocaleString()} / {BDC_COMPOSITE_LIMIT.toLocaleString()} chars
                    {pct > 100 && ' — content will be truncated by Booking'}
                    {pct > 90 && pct <= 100 && ' — approaching limit'}
                  </Typography>
                </Alert>
              );
            })}

            {typesInGroup.map((dt) => {
              const entry = entries[dt.typeCode];
              const text = entry?.text || '';
              const charCount = text.length;
              const isDirty = entry?.isDirty;
              const isAirbnbSummary = dt.typeCode === 'short-introduction';
              const airbnbWarning = isAirbnbSummary && charCount > AIRBNB_SUMMARY_LIMIT;

              return (
                <Card key={dt.typeCode} sx={{ mb: 2 }}>
                  <CardContent>
                    {/* Header row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">{dt.label}</Typography>
                        <Typography variant="caption" sx={{ color: colors.neutral[400], fontFamily: 'monospace' }}>
                          {dt.typeCode}
                        </Typography>
                        {isDirty && (
                          <FiberManualRecordIcon
                            sx={{ fontSize: 10, color: colors.orange[300] }}
                            titleAccess="Content differs from NextPax"
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip
                          label="EN"
                          size="small"
                          sx={{
                            bgcolor: colors.neutral[200],
                            color: colors.neutral[600],
                            fontWeight: 700,
                            fontSize: '0.625rem',
                            height: 20,
                          }}
                        />
                        {dt.channels.map((ch: Channel) => (
                          <ChannelBadge key={ch} channel={ch} />
                        ))}
                      </Box>
                    </Box>

                    {/* Text area */}
                    <TextField
                      multiline
                      minRows={3}
                      maxRows={8}
                      fullWidth
                      value={text}
                      onChange={(e) => handleTextChange(dt.typeCode, e.target.value)}
                      placeholder={`Enter ${dt.label.toLowerCase()}...`}
                      size="small"
                    />

                    {/* Footer: char count + Airbnb warning */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Box>
                        {airbnbWarning && (
                          <Typography variant="caption" sx={{ color: colors.orange[400] }}>
                            Airbnb Summary: {charCount} / {AIRBNB_SUMMARY_LIMIT} — will be truncated
                          </Typography>
                        )}
                        {isAirbnbSummary && !airbnbWarning && charCount > 0 && (
                          <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                            Airbnb Summary: {charCount} / {AIRBNB_SUMMARY_LIMIT}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                        {charCount > 0 ? `${charCount} chars` : ''}
                      </Typography>
                    </Box>

                    {/* Last modified info */}
                    {entry?.lastModifiedBy && (
                      <Typography variant="caption" sx={{ color: colors.neutral[400], display: 'block', mt: 0.5 }}>
                        Last edited by {entry.lastModifiedBy} on{' '}
                        {new Date(entry.lastModifiedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        );
      })}

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
        message="Sync triggered. Descriptions are being pushed to enabled channels via NextPax."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
}
