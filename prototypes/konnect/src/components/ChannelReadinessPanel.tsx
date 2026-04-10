import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SyncIcon from '@mui/icons-material/Sync';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { colors } from '../theme';
import { descriptionTypes } from '../data/descriptionTypes';
import { mockDescriptions, mockPropertyAmenities, mockPhotos, mockSyncStatus } from '../data/mockData';
import { Property } from '../types';

// Core description type codes (required)
const CORE_TYPE_CODES = new Set(
  descriptionTypes.filter((dt) => dt.priority === 'core').map((dt) => dt.typeCode),
);

type CheckStatus = 'complete' | 'warning' | 'incomplete';

interface CheckItem {
  label: string;
  status: CheckStatus;
  detail: string;
  scope: 'property' | string; // 'property' or room type id
  section: string; // nav section to jump to
}

interface CheckGroup {
  title: string;
  items: CheckItem[];
}

// ─── Status logic ────────────────────────────────────────────────────────────

function countCoreDescriptions(scopeKey: string): number {
  const entries = mockDescriptions[scopeKey] || [];
  return entries.filter((e) => CORE_TYPE_CODES.has(e.typeCode) && e.text.trim().length > 0).length;
}

function countAllDescriptions(scopeKey: string): number {
  const entries = mockDescriptions[scopeKey] || [];
  return entries.filter((e) => e.text.trim().length > 0).length;
}

function countAmenities(scopeKey: string): number {
  return (mockPropertyAmenities[scopeKey] || []).length;
}

function countPhotos(scopeKey: string): number {
  return (mockPhotos[scopeKey] || []).length;
}

function hasHeroPhoto(scopeKey: string): boolean {
  const photos = mockPhotos[scopeKey] || [];
  return photos.some((p) => p.priority === 0);
}

function buildChecklist(property: Property, draftScopes?: Set<string>): { groups: CheckGroup[]; completed: number; total: number } {
  const groups: CheckGroup[] = [];
  const propId = property.propertyId;

  // --- Property-level content ---
  const propItems: CheckItem[] = [];

  // Property descriptions
  const propCoreCount = countCoreDescriptions(propId);
  const coreTotal = CORE_TYPE_CODES.size;
  const propAllDescs = countAllDescriptions(propId);
  const optionalFilled = propAllDescs - propCoreCount;
  const optionalTotal = descriptionTypes.length - coreTotal;

  if (propCoreCount >= coreTotal) {
    if (optionalFilled < optionalTotal) {
      propItems.push({
        label: 'Descriptions',
        status: 'warning',
        detail: `${optionalTotal - optionalFilled} optional types unfilled`,
        scope: 'property',
        section: 'descriptions',
      });
    } else {
      propItems.push({
        label: 'Descriptions',
        status: 'complete',
        detail: `${propAllDescs} descriptions filled`,
        scope: 'property',
        section: 'descriptions',
      });
    }
  } else {
    propItems.push({
      label: 'Descriptions',
      status: 'incomplete',
      detail: `${coreTotal - propCoreCount} core descriptions missing`,
      scope: 'property',
      section: 'descriptions',
    });
  }

  // Property amenities
  const propAmenities = countAmenities(propId);
  if (propAmenities >= 20) {
    propItems.push({
      label: 'Amenities',
      status: 'complete',
      detail: `${propAmenities} amenities enabled`,
      scope: 'property',
      section: 'amenities',
    });
  } else if (propAmenities > 0) {
    propItems.push({
      label: 'Amenities',
      status: 'warning',
      detail: `${propAmenities} enabled — needs review`,
      scope: 'property',
      section: 'amenities',
    });
  } else {
    propItems.push({
      label: 'Amenities',
      status: 'incomplete',
      detail: 'Not started',
      scope: 'property',
      section: 'amenities',
    });
  }

  // Property photos
  const propPhotos = countPhotos(propId);
  const propHasHero = hasHeroPhoto(propId);
  if (propPhotos >= 5 && propHasHero) {
    propItems.push({
      label: 'Photos',
      status: 'complete',
      detail: `${propPhotos} photos, hero set`,
      scope: 'property',
      section: 'photos',
    });
  } else if (propPhotos > 0 && !propHasHero) {
    propItems.push({
      label: 'Photos',
      status: 'warning',
      detail: `${propPhotos} photos — no hero set`,
      scope: 'property',
      section: 'photos',
    });
  } else if (propPhotos > 0) {
    propItems.push({
      label: 'Photos',
      status: 'warning',
      detail: `${propPhotos} photos — need at least 5`,
      scope: 'property',
      section: 'photos',
    });
  } else {
    propItems.push({
      label: 'Photos',
      status: 'incomplete',
      detail: 'No photos loaded',
      scope: 'property',
      section: 'photos',
    });
  }

  // Fees — reference only, always complete (configured elsewhere)
  propItems.push({
    label: 'Fees configured',
    status: 'complete',
    detail: 'Managed via CMB pipeline',
    scope: 'property',
    section: 'fees',
  });

  // Taxes — reference only, always complete
  propItems.push({
    label: 'Taxes configured',
    status: 'complete',
    detail: 'Managed via CMB pipeline',
    scope: 'property',
    section: 'taxes',
  });

  groups.push({ title: 'Property-Level Content', items: propItems });

  // --- Room type content ---
  for (const rt of property.roomTypes) {
    const rtItems: CheckItem[] = [];
    const descIsDraft = draftScopes?.has(`${rt.id}:descriptions`);
    const amenIsDraft = draftScopes?.has(`${rt.id}:amenities`);

    // RT descriptions
    const rtCoreCount = countCoreDescriptions(rt.id);
    const rtAllDescs = countAllDescriptions(rt.id);
    const rtOptionalFilled = rtAllDescs - rtCoreCount;

    if (descIsDraft) {
      rtItems.push({
        label: 'Descriptions',
        status: 'warning',
        detail: 'Draft — inherited, needs review',
        scope: rt.id,
        section: 'descriptions',
      });
    } else if (rtCoreCount >= coreTotal) {
      if (rtOptionalFilled < optionalTotal) {
        rtItems.push({
          label: 'Descriptions',
          status: 'warning',
          detail: `${optionalTotal - rtOptionalFilled} optional unfilled`,
          scope: rt.id,
          section: 'descriptions',
        });
      } else {
        rtItems.push({
          label: 'Descriptions',
          status: 'complete',
          detail: `${rtAllDescs} descriptions filled`,
          scope: rt.id,
          section: 'descriptions',
        });
      }
    } else {
      const missing = coreTotal - rtCoreCount;
      rtItems.push({
        label: 'Descriptions',
        status: 'incomplete',
        detail: `${missing} core description${missing !== 1 ? 's' : ''} missing`,
        scope: rt.id,
        section: 'descriptions',
      });
    }

    // RT amenities
    const rtAmenities = countAmenities(rt.id);
    if (amenIsDraft) {
      rtItems.push({
        label: 'Amenities',
        status: 'warning',
        detail: 'Draft — inherited, needs review',
        scope: rt.id,
        section: 'amenities',
      });
    } else if (rtAmenities >= 10) {
      rtItems.push({
        label: 'Amenities',
        status: 'complete',
        detail: `${rtAmenities} enabled`,
        scope: rt.id,
        section: 'amenities',
      });
    } else if (rtAmenities > 0) {
      rtItems.push({
        label: 'Amenities',
        status: 'warning',
        detail: `${rtAmenities} enabled — needs review`,
        scope: rt.id,
        section: 'amenities',
      });
    } else {
      rtItems.push({
        label: 'Amenities',
        status: 'incomplete',
        detail: 'Not started',
        scope: rt.id,
        section: 'amenities',
      });
    }

    // RT photos
    const rtPhotos = countPhotos(rt.id);
    const rtHasHero = hasHeroPhoto(rt.id);
    if (rtPhotos >= 5 && rtHasHero) {
      rtItems.push({ label: 'Photos', status: 'complete', detail: `${rtPhotos} photos, hero set`, scope: rt.id, section: 'photos' });
    } else if (rtPhotos > 0 && !rtHasHero) {
      rtItems.push({ label: 'Photos', status: 'warning', detail: `${rtPhotos} photos — no hero set`, scope: rt.id, section: 'photos' });
    } else if (rtPhotos > 0) {
      rtItems.push({ label: 'Photos', status: 'warning', detail: `${rtPhotos} photos — need at least 5`, scope: rt.id, section: 'photos' });
    } else {
      rtItems.push({ label: 'Photos', status: 'incomplete', detail: 'No photos loaded', scope: rt.id, section: 'photos' });
    }

    // RT fees — reference only
    rtItems.push({
      label: 'Fees configured',
      status: 'complete',
      detail: 'Managed via CMB pipeline',
      scope: rt.id,
      section: 'fees',
    });

    groups.push({ title: `Room Type: ${rt.name}`, items: rtItems });
  }

  // --- Channel sync ---
  const channels = mockSyncStatus[propId] || [];
  const channelItems: CheckItem[] = channels.map((ch) => {
    let status: CheckStatus;
    let detail: string;
    if (ch.contentEnabled) {
      status = 'complete';
      detail = 'Content sync enabled';
    } else if (ch.enabled && ch.disableReason) {
      status = 'warning';
      detail = ch.disableReason;
    } else {
      status = 'incomplete';
      detail = 'Not yet enabled';
    }
    return {
      label: ch.channelName,
      status,
      detail,
      scope: 'property',
      section: 'sync-status',
    };
  });

  if (channelItems.length > 0) {
    groups.push({ title: 'Channel Sync', items: channelItems });
  }

  // Count totals
  const allItems = groups.flatMap((g) => g.items);
  const completed = allItems.filter((i) => i.status === 'complete').length;
  const total = allItems.length;

  return { groups, completed, total };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  property: Property;
  collapsed: boolean;
  draftScopes?: Set<string>;
  onToggle: () => void;
  onNavigate: (scope: 'property' | string, section: string) => void;
}

const PANEL_WIDTH = 280;

export { PANEL_WIDTH };

export default function ChannelReadinessPanel({ property, collapsed, draftScopes, onToggle, onNavigate }: Props) {
  const { groups, completed, total } = useMemo(() => buildChecklist(property, draftScopes), [property, draftScopes]);
  const pct = total > 0 ? (completed / total) * 100 : 0;
  const allRequired = groups
    .flatMap((g) => g.items)
    .filter((i) => i.status === 'incomplete').length === 0;

  if (collapsed) {
    return (
      <Box
        sx={{
          width: 40,
          flexShrink: 0,
          bgcolor: colors.neutral[50],
          borderLeft: `1px solid ${colors.neutral[200]}`,
          height: 'calc(100vh - 56px)',
          position: 'fixed',
          top: 56,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 1.5,
          zIndex: 10,
        }}
      >
        <Tooltip title="Show Channel Readiness" placement="left" arrow>
          <IconButton size="small" onClick={onToggle} sx={{ color: colors.neutral[500] }}>
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        {/* Mini progress indicator */}
        <Box
          sx={{
            mt: 1,
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: `2px solid ${pct === 100 ? colors.green[300] : pct >= 60 ? colors.blue[400] : colors.orange[300]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: colors.neutral[600] }}>
            {completed}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: PANEL_WIDTH,
        flexShrink: 0,
        bgcolor: colors.neutral[50],
        borderLeft: `1px solid ${colors.neutral[200]}`,
        height: 'calc(100vh - 56px)',
        position: 'fixed',
        top: 56,
        right: 0,
        overflowY: 'auto',
        zIndex: 10,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: colors.neutral[300], borderRadius: 2 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1.5,
          borderBottom: `1px solid ${colors.neutral[200]}`,
          position: 'sticky',
          top: 0,
          bgcolor: colors.neutral[50],
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: colors.neutral[800] }}>
            Channel Readiness
          </Typography>
          <IconButton size="small" onClick={onToggle} sx={{ color: colors.neutral[400] }}>
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
          <Typography variant="caption" sx={{ color: colors.neutral[600], fontWeight: 600 }}>
            {completed} of {total} complete
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: colors.neutral[200],
            '& .MuiLinearProgress-bar': {
              bgcolor: pct === 100 ? colors.green[300] : pct >= 60 ? colors.blue[400] : colors.orange[300],
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Checklist groups */}
      <Box sx={{ px: 1.5, py: 1.5 }}>
        {groups.map((group, gi) => (
          <Box key={gi} sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: colors.neutral[400],
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                px: 0.5,
                mb: 0.5,
                display: 'block',
              }}
            >
              {group.title}
            </Typography>

            {group.items.map((item, ii) => (
              <ChecklistRow
                key={ii}
                item={item}
                onClick={() => onNavigate(item.scope, item.section)}
              />
            ))}
          </Box>
        ))}
      </Box>

      {/* Bottom action */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          borderTop: `1px solid ${colors.neutral[200]}`,
          position: 'sticky',
          bottom: 0,
          bgcolor: colors.neutral[50],
        }}
      >
        <Tooltip
          title={allRequired ? '' : 'Complete all required content sections before enabling sync'}
          placement="top"
          arrow
        >
          <span>
            <Button
              variant="contained"
              fullWidth
              startIcon={<SyncIcon />}
              disabled={!allRequired}
              sx={{ fontSize: '0.8rem' }}
            >
              Enable Content Sync
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
}

// ─── Checklist row ───────────────────────────────────────────────────────────

function ChecklistRow({ item, onClick }: { item: CheckItem; onClick: () => void }) {
  const isClickable = item.status !== 'complete';

  const icon =
    item.status === 'complete' ? (
      <CheckCircleIcon sx={{ fontSize: 16, color: colors.green[300], flexShrink: 0 }} />
    ) : item.status === 'warning' ? (
      <WarningAmberIcon sx={{ fontSize: 16, color: colors.orange[300], flexShrink: 0 }} />
    ) : (
      <ErrorOutlineIcon sx={{ fontSize: 16, color: colors.red[300], flexShrink: 0 }} />
    );

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        px: 1,
        py: 0.75,
        borderRadius: '8px',
        cursor: 'pointer',
        '&:hover': { bgcolor: colors.neutral[100] },
        opacity: item.status === 'complete' ? 0.75 : 1,
      }}
    >
      {icon}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8rem',
            fontWeight: item.status !== 'complete' ? 600 : 400,
            color: item.status === 'complete' ? colors.neutral[500] : colors.neutral[700],
            lineHeight: 1.3,
          }}
        >
          {item.label}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: item.status === 'incomplete'
              ? colors.red[400]
              : item.status === 'warning'
                ? colors.orange[400]
                : colors.neutral[400],
            lineHeight: 1.3,
            display: 'block',
          }}
        >
          {item.detail}
        </Typography>
      </Box>
      {isClickable && (
        <ChevronRightIcon sx={{ fontSize: 14, color: colors.neutral[400], mt: 0.25, flexShrink: 0 }} />
      )}
    </Box>
  );
}
