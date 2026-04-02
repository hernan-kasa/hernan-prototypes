import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import BlockIcon from '@mui/icons-material/Block';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { properties, mockDescriptions, mockPropertyAmenities, mockSyncStatus } from '../data/mockData';
import { descriptionTypes } from '../data/descriptionTypes';
import { Property, ChannelSyncStatus } from '../types';
import { colors } from '../theme';

interface Props {
  propertyId: string;
  onNavigate: (nav: string, scope?: string) => void;
}

// Count authored descriptions for a given scope key
function countDescriptions(scopeKey: string): number {
  const entries = mockDescriptions[scopeKey] || [];
  return entries.filter((e) => e.text.trim().length > 0).length;
}

// Count core descriptions authored
function countCoreDescriptions(scopeKey: string): number {
  const entries = mockDescriptions[scopeKey] || [];
  const coreTypeCodes = new Set(descriptionTypes.filter((dt) => dt.priority === 'core').map((dt) => dt.typeCode));
  return entries.filter((e) => coreTypeCodes.has(e.typeCode) && e.text.trim().length > 0).length;
}

// Count enabled amenities for a given scope key
function countAmenities(scopeKey: string): number {
  return (mockPropertyAmenities[scopeKey] || []).length;
}

// Check if any descriptions have unsaved changes (isDirty)
function countDirtyDescriptions(scopeKey: string): number {
  const entries = mockDescriptions[scopeKey] || [];
  return entries.filter((e) => e.isDirty).length;
}

function channelStatusIcon(status: ChannelSyncStatus) {
  if (!status.contentEnabled) return <BlockIcon sx={{ fontSize: 16, color: colors.neutral[400] }} />;
  if (status.lastSyncStatus === 'success') return <CheckCircleIcon sx={{ fontSize: 16, color: colors.green[300] }} />;
  if (status.lastSyncStatus === 'failure') return <ErrorIcon sx={{ fontSize: 16, color: colors.red[400] }} />;
  return <WarningAmberIcon sx={{ fontSize: 16, color: colors.orange[300] }} />;
}

const coreCount = descriptionTypes.filter((dt) => dt.priority === 'core').length;
const totalDescriptionTypes = descriptionTypes.length;

export default function PropertyOverviewTab({ propertyId, onNavigate }: Props) {
  const property: Property | undefined = properties.find((p) => p.propertyId === propertyId);
  const channels = mockSyncStatus[propertyId] || [];

  const stats = useMemo(() => {
    const propDescs = countDescriptions(propertyId);
    const propCoreDescs = countCoreDescriptions(propertyId);
    const propAmenities = countAmenities(propertyId);
    const propDirty = countDirtyDescriptions(propertyId);
    const enabledChannels = channels.filter((c) => c.contentEnabled).length;

    const roomTypeStats = (property?.roomTypes || []).map((rt) => ({
      id: rt.id,
      name: rt.name,
      descriptions: countDescriptions(rt.id),
      amenities: countAmenities(rt.id),
    }));

    // Action items
    const actions: { label: string; severity: 'warning' | 'info' | 'error'; nav: string; scope?: string }[] = [];

    if (propCoreDescs < coreCount) {
      actions.push({
        label: `${coreCount - propCoreDescs} core description${coreCount - propCoreDescs > 1 ? 's' : ''} missing at property level`,
        severity: 'warning',
        nav: 'descriptions',
      });
    }
    if (propDirty > 0) {
      actions.push({
        label: `${propDirty} description${propDirty > 1 ? 's' : ''} modified since last sync`,
        severity: 'info',
        nav: 'sync-statuses',
      });
    }
    for (const rt of roomTypeStats) {
      if (rt.descriptions === 0) {
        actions.push({
          label: `${rt.name} has no descriptions`,
          severity: 'warning',
          nav: 'descriptions',
          scope: rt.id,
        });
      }
      if (rt.amenities === 0) {
        actions.push({
          label: `${rt.name} has no amenities`,
          severity: 'warning',
          nav: 'amenities',
          scope: rt.id,
        });
      }
    }
    const disabledChannels = channels.filter((c) => !c.contentEnabled);
    for (const ch of disabledChannels) {
      actions.push({
        label: `${ch.channelName} sync disabled${ch.disableReason ? ` — ${ch.disableReason}` : ''}`,
        severity: ch.disableReason?.includes('Never') ? 'info' : 'error',
        nav: 'sync-statuses',
      });
    }

    return { propDescs, propCoreDescs, propAmenities, propDirty, enabledChannels, roomTypeStats, actions };
  }, [propertyId, property, channels]);

  if (!property) return null;

  const descPct = (stats.propDescs / totalDescriptionTypes) * 100;

  return (
    <Box>
      {/* Property header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: colors.neutral[500], fontFamily: 'monospace' }}>
            NextPax {property.nextpaxPropertyId}
          </Typography>
          <Chip
            label={`${property.roomTypes.length} room type${property.roomTypes.length !== 1 ? 's' : ''}`}
            size="small"
            sx={{ bgcolor: colors.neutral[200], color: colors.neutral[600], fontWeight: 700, fontSize: '0.675rem', height: 20 }}
          />
        </Box>
      </Box>

      {/* Summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, mb: 4 }}>
        {/* Descriptions card */}
        <Card sx={{ border: `1px solid ${colors.neutral[200]}` }}>
          <CardActionArea onClick={() => onNavigate('descriptions')}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: colors.neutral[600] }}>Descriptions</Typography>
                <ArrowForwardIcon sx={{ fontSize: 16, color: colors.neutral[400] }} />
              </Box>
              <Typography variant="h3" sx={{ color: colors.neutral[800], mb: 0.5 }}>
                {stats.propDescs}
                <Typography component="span" variant="body2" sx={{ color: colors.neutral[400], ml: 0.5 }}>
                  / {totalDescriptionTypes}
                </Typography>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={descPct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: colors.neutral[200],
                  mb: 1,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: descPct >= 80 ? colors.green[300] : descPct >= 40 ? colors.blue[400] : colors.orange[300],
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                {stats.propCoreDescs} / {coreCount} core filled
                {stats.propDirty > 0 && (
                  <Typography component="span" variant="caption" sx={{ color: colors.orange[400], ml: 1 }}>
                    {stats.propDirty} pending sync
                  </Typography>
                )}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Amenities card */}
        <Card sx={{ border: `1px solid ${colors.neutral[200]}` }}>
          <CardActionArea onClick={() => onNavigate('amenities')}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: colors.neutral[600] }}>Amenities</Typography>
                <ArrowForwardIcon sx={{ fontSize: 16, color: colors.neutral[400] }} />
              </Box>
              <Typography variant="h3" sx={{ color: colors.neutral[800], mb: 0.5 }}>
                {stats.propAmenities}
                <Typography component="span" variant="body2" sx={{ color: colors.neutral[400], ml: 0.5 }}>
                  enabled
                </Typography>
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((stats.propAmenities / 80) * 100, 100)}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: colors.neutral[200],
                  mb: 1,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: stats.propAmenities >= 40 ? colors.green[300] : stats.propAmenities >= 20 ? colors.blue[400] : colors.orange[300],
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
                out of 684 available types
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Channels card */}
        <Card sx={{ border: `1px solid ${colors.neutral[200]}` }}>
          <CardActionArea onClick={() => onNavigate('sync-statuses')}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ color: colors.neutral[600] }}>Channel Sync</Typography>
                <ArrowForwardIcon sx={{ fontSize: 16, color: colors.neutral[400] }} />
              </Box>
              <Typography variant="h3" sx={{ color: colors.neutral[800], mb: 1.5 }}>
                {stats.enabledChannels}
                <Typography component="span" variant="body2" sx={{ color: colors.neutral[400], ml: 0.5 }}>
                  / {channels.length} active
                </Typography>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                {channels.map((ch) => (
                  <Box key={ch.channelId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {channelStatusIcon(ch)}
                      <Typography variant="caption">{ch.channelName}</Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: colors.neutral[400] }}>
                      {ch.contentEnabled ? (ch.lastSyncStatus === 'success' ? 'Synced' : ch.lastSyncStatus || 'Never') : 'Off'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>

      {/* Action items */}
      {stats.actions.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Needs Attention</Typography>
          {stats.actions.map((action, i) => (
            <Alert
              key={i}
              severity={action.severity}
              sx={{
                mb: 1,
                cursor: 'pointer',
                '&:hover': { opacity: 0.85 },
              }}
              onClick={() => onNavigate(action.nav, action.scope)}
            >
              {action.label}
            </Alert>
          ))}
        </Box>
      )}

      {/* Room type coverage */}
      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>Room Type Coverage</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Room Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Descriptions</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Amenities</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.roomTypeStats.map((rt) => {
              const hasContent = rt.descriptions > 0 || rt.amenities > 0;
              return (
                <TableRow
                  key={rt.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onNavigate('descriptions', rt.id)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{rt.name}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={rt.descriptions > 0 ? `${rt.descriptions} / ${totalDescriptionTypes}` : 'None'}
                      size="small"
                      sx={{
                        bgcolor: rt.descriptions > 0 ? colors.blue[100] : colors.neutral[200],
                        color: rt.descriptions > 0 ? colors.blue[400] : colors.neutral[500],
                        fontWeight: 700,
                        fontSize: '0.675rem',
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={rt.amenities > 0 ? `${rt.amenities}` : 'None'}
                      size="small"
                      sx={{
                        bgcolor: rt.amenities > 0 ? colors.blue[100] : colors.neutral[200],
                        color: rt.amenities > 0 ? colors.blue[400] : colors.neutral[500],
                        fontWeight: 700,
                        fontSize: '0.675rem',
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {hasContent ? (
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                        label="Content"
                        size="small"
                        sx={{ bgcolor: colors.green[100], color: colors.green[500], fontWeight: 700, fontSize: '0.675rem', height: 22 }}
                      />
                    ) : (
                      <Chip
                        icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                        label="Empty"
                        size="small"
                        sx={{ bgcolor: colors.orange[100], color: colors.orange[400], fontWeight: 700, fontSize: '0.675rem', height: 22 }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
