import { useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PeopleIcon from '@mui/icons-material/People';
import theme, { colors } from './theme';
import ChannelReadinessPanel, { PANEL_WIDTH } from './components/ChannelReadinessPanel';
import PropertyOverviewTab from './pages/PropertyOverviewTab';
import DescriptionsTab from './pages/DescriptionsTab';
import AmenitiesTab from './pages/AmenitiesTab';
import PhotosTab from './pages/PhotosTab';
import FeesTab from './pages/FeesTab';
import TaxesTab from './pages/TaxesTab';
import SyncStatusTab from './pages/SyncStatusTab';
import { properties, mockDescriptions, mockPropertyAmenities, mockPhotos, mockSyncStatus } from './data/mockData';
import { descriptionTypes } from './data/descriptionTypes';
import { RoomType, Channel, ChannelSyncStatus } from './types';

const SIDEBAR_WIDTH = 288;

type NavSection = 'overview' | 'descriptions' | 'amenities' | 'photos' | 'fees' | 'taxes' | 'sync-status';

const ROOM_TYPE_SECTIONS: NavSection[] = ['overview', 'descriptions', 'amenities', 'photos', 'fees'];

const sectionLabels: Record<NavSection, string> = {
  overview: 'Overview',
  descriptions: 'Descriptions',
  amenities: 'Amenities',
  photos: 'Photos',
  fees: 'Fees',
  taxes: 'Taxes',
  'sync-status': 'Sync Status',
};

const totalDescTypes = descriptionTypes.length;

// Channel colors for small link badges in sidebar
const channelLinkColors: Record<Channel, { bg: string; text: string }> = {
  BDC: { bg: colors.blue[100], text: colors.blue[600] },
  Airbnb: { bg: colors.red[100], text: colors.red[500] },
  Expedia: { bg: colors.orange[100], text: colors.orange[600] },
};

const channelAbbrev: Record<Channel, string> = {
  BDC: 'B',
  Airbnb: 'A',
  Expedia: 'E',
};

export default function App() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0].propertyId);
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [activeScope, setActiveScope] = useState<'property' | string>('property');
  const [expandedRoomTypes, setExpandedRoomTypes] = useState<Set<string>>(new Set());
  const [readinessPanelCollapsed, setReadinessPanelCollapsed] = useState(false);
  const [draftScopes, setDraftScopes] = useState<Set<string>>(new Set());
  const [channelNameOverrides, setChannelNameOverrides] = useState<Record<string, Record<string, string>>>({});
  const [amenitiesVersion, setAmenitiesVersion] = useState(0);

  const property = properties.find((p) => p.propertyId === selectedPropertyId);
  const scopeKey = activeScope === 'property' ? selectedPropertyId : activeScope;
  const activeRoomType =
    activeScope !== 'property' ? property?.roomTypes.find((rt) => rt.id === activeScope) : null;

  // Sidebar badges
  const descCount = useMemo(() => {
    const entries = mockDescriptions[selectedPropertyId] || [];
    return entries.filter((e) => e.text.trim().length > 0).length;
  }, [selectedPropertyId]);

  const amenityCount = useMemo(() => {
    return (mockPropertyAmenities[selectedPropertyId] || []).length;
    // amenitiesVersion is a force-recompute signal fired when amenities mutate.
  }, [selectedPropertyId, amenitiesVersion]);

  const photoCount = useMemo(() => {
    return (mockPhotos[selectedPropertyId] || []).length;
  }, [selectedPropertyId]);

  const navigateProperty = (section: NavSection) => {
    setActiveScope('property');
    setActiveSection(section);
  };

  const navigateRoomType = (roomTypeId: string, section: NavSection) => {
    setActiveScope(roomTypeId);
    setActiveSection(section);
    setExpandedRoomTypes((prev) => new Set(prev).add(roomTypeId));
  };

  const toggleRoomType = (roomTypeId: string) => {
    setExpandedRoomTypes((prev) => {
      const next = new Set(prev);
      if (next.has(roomTypeId)) next.delete(roomTypeId);
      else next.add(roomTypeId);
      return next;
    });
  };

  const handlePropertyChange = (e: SelectChangeEvent) => {
    setSelectedPropertyId(e.target.value);
    setActiveScope('property');
    setActiveSection('overview');
    setExpandedRoomTypes(new Set());
  };

  const handleCascade = (roomTypeIds: string[], contentType: string) => {
    setDraftScopes((prev) => {
      const next = new Set(prev);
      roomTypeIds.forEach((id) => next.add(`${id}:${contentType}`));
      return next;
    });
  };

  const handleClearDraft = (scopeKey: string, contentType: string) => {
    setDraftScopes((prev) => {
      const next = new Set(prev);
      next.delete(`${scopeKey}:${contentType}`);
      return next;
    });
  };

  // Check if a property-level nav item is active
  const isPropertyNavActive = (section: NavSection) =>
    activeScope === 'property' && activeSection === section;

  // Check if a room-type nav item is active
  const isRoomTypeNavActive = (roomTypeId: string, section: NavSection) =>
    activeScope === roomTypeId && activeSection === section;

  // Breadcrumb parts
  const breadcrumbParts: string[] = [property?.propertyName || ''];
  if (activeRoomType) breadcrumbParts.push(activeRoomType.name);
  breadcrumbParts.push(sectionLabels[activeSection]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: colors.neutral[100] }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: colors.neutral[50],
            borderBottom: `1px solid ${colors.neutral[200]}`,
            zIndex: (t) => t.zIndex.drawer + 2,
          }}
        >
          <Toolbar sx={{ height: 56, gap: 1 }}>
            <IconButton size="small" sx={{ color: colors.neutral[600] }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  bgcolor: colors.blue[400],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>K</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: colors.neutral[800] }}>
                Kontrol
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                maxWidth: 480,
                mx: 'auto',
                bgcolor: colors.neutral[100],
                borderRadius: '12px',
                border: `1px solid ${colors.neutral[200]}`,
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                height: 36,
              }}
            >
              <SearchIcon sx={{ fontSize: 18, color: colors.neutral[400], mr: 1 }} />
              <InputBase
                placeholder="Search for Reservations, Listings, or Guests"
                sx={{ flex: 1, fontSize: '0.8rem', color: colors.neutral[600] }}
                readOnly
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: colors.blue[400] }} />
              <Typography variant="body2" sx={{ color: colors.blue[400], fontWeight: 700 }}>
                Full portfolio
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Layout: sidebar + content */}
        <Box sx={{ display: 'flex', pt: '56px' }}>
          {/* Left Sidebar */}
          <Box
            sx={{
              width: SIDEBAR_WIDTH,
              flexShrink: 0,
              bgcolor: colors.neutral[50],
              borderRight: `1px solid ${colors.neutral[200]}`,
              height: 'calc(100vh - 56px)',
              position: 'fixed',
              top: 56,
              left: 0,
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-thumb': { bgcolor: colors.neutral[300], borderRadius: 2 },
            }}
          >
            {/* Property selector */}
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedPropertyId}
                  onChange={handlePropertyChange}
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: colors.neutral[800],
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    '& .MuiSelect-select': { px: 0, py: 0.5 },
                  }}
                >
                  {properties.map((p) => (
                    <MenuItem key={p.propertyId} value={p.propertyId}>
                      {p.propertyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Property-level nav items */}
            <List disablePadding sx={{ px: 1 }}>
              <ListItemButton
                selected={isPropertyNavActive('overview')}
                onClick={() => navigateProperty('overview')}
                sx={navItemSx(isPropertyNavActive('overview'))}
              >
                <ListItemText
                  primary="Overview"
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isPropertyNavActive('overview') ? 700 : 400,
                  }}
                />
              </ListItemButton>

              <ListItemButton
                selected={isPropertyNavActive('descriptions')}
                onClick={() => navigateProperty('descriptions')}
                sx={navItemSx(isPropertyNavActive('descriptions'))}
              >
                <ListItemText
                  primary="Descriptions"
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isPropertyNavActive('descriptions') ? 700 : 400,
                  }}
                />
                <NavBadge label={`${descCount}/${totalDescTypes}`} active={descCount > 0} />
              </ListItemButton>

              <ListItemButton
                selected={isPropertyNavActive('amenities')}
                onClick={() => navigateProperty('amenities')}
                sx={navItemSx(isPropertyNavActive('amenities'))}
              >
                <ListItemText
                  primary="Amenities"
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isPropertyNavActive('amenities') ? 700 : 400,
                  }}
                />
                <NavBadge label={`${amenityCount}`} active={amenityCount > 0} />
              </ListItemButton>

              <ListItemButton
                selected={isPropertyNavActive('photos')}
                onClick={() => navigateProperty('photos')}
                sx={navItemSx(isPropertyNavActive('photos'))}
              >
                <ListItemText
                  primary="Photos"
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isPropertyNavActive('photos') ? 700 : 400,
                  }}
                />
                <NavBadge label={`${photoCount}`} active={photoCount > 0} />
              </ListItemButton>

              <ListItemButton
                selected={isPropertyNavActive('fees')}
                onClick={() => navigateProperty('fees')}
                sx={navItemSx(isPropertyNavActive('fees'))}
              >
                <ListItemText
                  primary="Fees"
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isPropertyNavActive('fees') ? 700 : 400,
                  }}
                />
                <RefBadge />
              </ListItemButton>

              <ListItemButton
                selected={isPropertyNavActive('taxes')}
                onClick={() => navigateProperty('taxes')}
                sx={navItemSx(isPropertyNavActive('taxes'))}
              >
                <ListItemText
                  primary="Taxes"
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isPropertyNavActive('taxes') ? 700 : 400,
                  }}
                />
                <RefBadge />
              </ListItemButton>

              <ListItemButton
                selected={isPropertyNavActive('sync-status')}
                onClick={() => navigateProperty('sync-status')}
                sx={navItemSx(isPropertyNavActive('sync-status'))}
              >
                <ListItemText
                  primary="Sync Status"
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: isPropertyNavActive('sync-status') ? 700 : 400,
                  }}
                />
              </ListItemButton>
            </List>

            {/* Divider before room types */}
            <Divider sx={{ mx: 2, my: 1.5 }} />

            {/* Room Types section */}
            <Box sx={{ px: 2, mb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{ color: colors.neutral[400], fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Room Types
              </Typography>
            </Box>

            <List disablePadding sx={{ px: 1, pb: 2 }}>
              {property?.roomTypes.map((rt) => {
                const isExpanded = expandedRoomTypes.has(rt.id);
                const isActiveRt = activeScope === rt.id;

                return (
                  <Box key={rt.id}>
                    {/* Room type header — click to toggle expand/collapse */}
                    <ListItemButton
                      onClick={() => toggleRoomType(rt.id)}
                      sx={{
                        borderRadius: '8px',
                        mb: 0.25,
                        py: 0.75,
                        px: 1.5,
                        bgcolor: isActiveRt ? colors.neutral[100] : 'transparent',
                        '&:hover': { bgcolor: colors.neutral[100] },
                      }}
                    >
                      {isExpanded ? (
                        <ExpandLess sx={{ fontSize: 16, color: colors.neutral[400], mr: 0.75 }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: 16, color: colors.neutral[400], mr: 0.75 }} />
                      )}
                      <ListItemText
                        primary={rt.name}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: isActiveRt ? 700 : 500,
                          color: isActiveRt ? colors.blue[400] : colors.neutral[700],
                          noWrap: true,
                        }}
                      />
                    </ListItemButton>

                    {/* Collapsed: summary card */}
                    {!isExpanded && (
                      <Box onClick={() => toggleRoomType(rt.id)} sx={{ cursor: 'pointer' }}>
                        <RoomTypeSummaryCard rt={rt} />
                      </Box>
                    )}

                    {/* Expanded: sub-nav items */}
                    <Collapse in={isExpanded}>
                      <List disablePadding>
                        {ROOM_TYPE_SECTIONS.map((section) => (
                          <ListItemButton
                            key={section}
                            selected={isRoomTypeNavActive(rt.id, section)}
                            onClick={() => navigateRoomType(rt.id, section)}
                            sx={subNavItemSx(isRoomTypeNavActive(rt.id, section))}
                          >
                            <ListItemText
                              primary={sectionLabels[section]}
                              primaryTypographyProps={{
                                variant: 'body2',
                                fontWeight: isRoomTypeNavActive(rt.id, section) ? 700 : 400,
                              }}
                            />
                            {section === 'fees' && <RefBadge />}
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </Box>
                );
              })}
            </List>
          </Box>

          {/* Main content */}
          <Box
            sx={{
              ml: `${SIDEBAR_WIDTH}px`,
              mr: `${readinessPanelCollapsed ? 40 : PANEL_WIDTH}px`,
              flex: 1,
              minHeight: 'calc(100vh - 56px)',
              transition: 'margin-right 0.2s ease',
            }}
          >
            <Box sx={{ maxWidth: 960, px: 4, py: 3 }}>
              {/* Breadcrumb */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                {breadcrumbParts.map((part, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {i > 0 && (
                      <ChevronRightIcon sx={{ fontSize: 14, color: colors.neutral[400] }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: i === breadcrumbParts.length - 1 ? colors.neutral[600] : colors.neutral[400],
                        fontWeight: i === breadcrumbParts.length - 1 ? 600 : 400,
                      }}
                    >
                      {part}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Page heading */}
              <Typography variant="h2" sx={{ color: colors.neutral[800], mb: 0.5 }}>
                {sectionLabels[activeSection]}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.neutral[500], mb: 3 }}>
                {activeRoomType
                  ? `${activeRoomType.name} — ${property?.propertyName}`
                  : property?.propertyName}
              </Typography>

              {/* Page content */}
              {activeScope === 'property' && activeSection === 'overview' && (
                <PropertyOverviewTab
                  propertyId={selectedPropertyId}
                  onNavigate={(nav, scope) => {
                    if (scope) {
                      navigateRoomType(scope, nav as NavSection);
                    } else {
                      navigateProperty(nav as NavSection);
                    }
                  }}
                />
              )}
              {activeScope !== 'property' && activeSection === 'overview' && activeRoomType && (
                <RoomTypeOverview
                  roomType={activeRoomType}
                  propertyId={selectedPropertyId}
                  channelNameOverrides={channelNameOverrides[activeRoomType.id] || {}}
                  onChannelNameChange={(channel, value) => {
                    setChannelNameOverrides((prev) => ({
                      ...prev,
                      [activeRoomType.id]: {
                        ...(prev[activeRoomType.id] || {}),
                        [channel]: value,
                      },
                    }));
                  }}
                  onNavigate={(section) => navigateRoomType(activeRoomType.id, section)}
                />
              )}
              {activeSection === 'descriptions' && (
                <DescriptionsTab
                  key={scopeKey}
                  scopeKey={scopeKey}
                  propertyId={selectedPropertyId}
                  isPropertyScope={activeScope === 'property'}
                  roomTypes={property?.roomTypes}
                  isDraft={draftScopes.has(`${scopeKey}:descriptions`)}
                  onCascade={(rtIds) => handleCascade(rtIds, 'descriptions')}
                  onClearDraft={() => handleClearDraft(scopeKey, 'descriptions')}
                />
              )}
              {activeSection === 'amenities' && (
                <AmenitiesTab
                  key={scopeKey}
                  scopeKey={scopeKey}
                  propertyId={selectedPropertyId}
                  isPropertyScope={activeScope === 'property'}
                  roomTypes={property?.roomTypes}
                  isDraft={draftScopes.has(`${scopeKey}:amenities`)}
                  onCascade={(rtIds) => handleCascade(rtIds, 'amenities')}
                  onClearDraft={() => handleClearDraft(scopeKey, 'amenities')}
                  onAmenitiesChange={() => setAmenitiesVersion((v) => v + 1)}
                />
              )}
              {activeSection === 'photos' && (
                <PhotosTab key={scopeKey} scopeKey={scopeKey} propertyId={selectedPropertyId} />
              )}
              {activeSection === 'fees' && <FeesTab />}
              {activeSection === 'taxes' && activeScope === 'property' && <TaxesTab />}
              {activeSection === 'sync-status' && activeScope === 'property' && (
                <SyncStatusTab propertyId={selectedPropertyId} />
              )}
            </Box>
          </Box>

          {/* Right rail — Channel Readiness */}
          {property && (
            <ChannelReadinessPanel
              property={property}
              collapsed={readinessPanelCollapsed}
              draftScopes={draftScopes}
              amenitiesVersion={amenitiesVersion}
              onToggle={() => setReadinessPanelCollapsed((v) => !v)}
              onNavigate={(scope, section) => {
                if (scope === 'property') {
                  navigateProperty(section as NavSection);
                } else {
                  navigateRoomType(scope, section as NavSection);
                }
              }}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// ─── Room Type Summary Card (collapsed sidebar view) ─────────────────────────

function RoomTypeSummaryCard({ rt }: { rt: RoomType }) {
  return (
    <Box
      sx={{
        mx: 1.5,
        mb: 1,
        px: 1.5,
        py: 1,
        bgcolor: colors.neutral[100],
        borderRadius: '8px',
        border: `1px solid ${colors.neutral[200]}`,
      }}
    >
      {/* Internal title / nickname */}
      {rt.internalTitle && (
        <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block', lineHeight: 1.3 }}>
          {rt.internalTitle}
        </Typography>
      )}
      {rt.nickname && rt.nickname !== rt.name && (
        <Typography variant="caption" sx={{ color: colors.neutral[400], display: 'block', lineHeight: 1.3 }}>
          aka "{rt.nickname}"
        </Typography>
      )}

      {/* Setup + occupancy */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
        <Typography variant="caption" sx={{ color: colors.neutral[600], fontWeight: 600 }}>
          {rt.setupInfo}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
          <PeopleIcon sx={{ fontSize: 12, color: colors.neutral[400] }} />
          <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
            Max {rt.maxOccupancy}
          </Typography>
        </Box>
      </Box>

      {/* Channel listing links */}
      {rt.channelLinks.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.75, flexWrap: 'wrap' }}>
          {rt.channelLinks.map((link) => {
            const c = channelLinkColors[link.channel];
            const channelDisplay = link.channel === 'BDC' ? 'Booking.com' : link.channel;
            const tooltip = link.listingId
              ? `${channelDisplay} · ${link.listingId}`
              : channelDisplay;
            return (
              <Tooltip key={link.channel} title={tooltip} arrow>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: c.bg,
                    color: c.text,
                    borderRadius: '4px',
                    width: 18,
                    height: 18,
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    '&:hover': { opacity: 0.8 },
                  }}
                >
                  {channelAbbrev[link.channel]}
                </Link>
              </Tooltip>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

// ─── Room Type Overview (content area) ───────────────────────────────────────

function RoomTypeOverview({
  roomType,
  propertyId,
  channelNameOverrides,
  onChannelNameChange,
  onNavigate,
}: {
  roomType: RoomType;
  propertyId: string;
  channelNameOverrides: Record<string, string>;
  onChannelNameChange: (channel: string, value: string) => void;
  onNavigate: (section: NavSection) => void;
}) {
  const descEntries = mockDescriptions[roomType.id] || [];
  const descCount = descEntries.filter((e) => e.text.trim().length > 0).length;
  const amenityCount = (mockPropertyAmenities[roomType.id] || []).length;
  const channels = mockSyncStatus[propertyId] || [];

  return (
    <Box>
      {/* Room type info card */}
      <Box
        sx={{
          bgcolor: colors.neutral[50],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: '12px',
          p: 3,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ color: colors.neutral[800], mb: 0.5 }}>
              {roomType.name}
            </Typography>
            {roomType.internalTitle && (
              <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
                {roomType.internalTitle}
              </Typography>
            )}
            {roomType.nickname && roomType.nickname !== roomType.name && (
              <Typography variant="caption" sx={{ color: colors.neutral[400] }}>
                Nickname: {roomType.nickname}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={roomType.setupInfo}
              size="small"
              sx={{ bgcolor: colors.neutral[200], color: colors.neutral[600], fontWeight: 700, fontSize: '0.75rem' }}
            />
            <Chip
              icon={<PeopleIcon sx={{ fontSize: 14 }} />}
              label={`Max ${roomType.maxOccupancy}`}
              size="small"
              sx={{ bgcolor: colors.neutral[200], color: colors.neutral[600], fontWeight: 700, fontSize: '0.75rem' }}
            />
          </Box>
        </Box>

        {/* Channel listing links */}
        {roomType.channelLinks.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {roomType.channelLinks.map((link) => {
              const c = channelLinkColors[link.channel];
              const label =
                link.channel === 'BDC'
                  ? 'Booking.com'
                  : link.channel === 'Airbnb' && link.listingId
                    ? `Airbnb (${link.listingId})`
                    : link.channel;
              return (
                <Link
                  key={link.channel}
                  href={link.url}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                >
                  <Chip
                    label={label}
                    size="small"
                    clickable
                    sx={{
                      bgcolor: c.bg,
                      color: c.text,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      '&:hover': { opacity: 0.85 },
                    }}
                  />
                </Link>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Channel Name Overrides */}
      <Box
        sx={{
          bgcolor: colors.neutral[50],
          border: `1px solid ${colors.neutral[200]}`,
          borderRadius: '12px',
          p: 3,
          mb: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: colors.neutral[800], mb: 0.5 }}>
          Room Type Name
        </Typography>
        <Typography variant="body2" sx={{ color: colors.neutral[500], mb: 2.5 }}>
          {roomType.name}
          <Typography component="span" variant="caption" sx={{ color: colors.neutral[400], ml: 1 }}>
            from Kontrol — read only
          </Typography>
        </Typography>

        <Typography variant="subtitle2" sx={{ color: colors.neutral[800], mb: 1.5 }}>
          Channel Name Overrides
        </Typography>
        <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block', mb: 2 }}>
          Override the room type name on specific channels. Leave empty to use the default Kontrol name.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {channels.map((ch: ChannelSyncStatus) => {
            const channelKey = ch.channelName === 'Booking.com' ? 'BDC' : ch.channelName;
            const value = channelNameOverrides[channelKey] || '';
            const maxLen = ch.channelName === 'Booking.com' ? 100 : ch.channelName === 'Airbnb' ? 50 : undefined;
            return (
              <Box key={ch.channelId}>
                <Typography variant="caption" sx={{ color: colors.neutral[600], fontWeight: 600, display: 'block', mb: 0.5 }}>
                  {ch.channelName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InputBase
                    value={value}
                    onChange={(e) => onChannelNameChange(channelKey, e.target.value)}
                    placeholder="Uses default name if empty"
                    sx={{
                      flex: 1,
                      border: `1px solid ${colors.neutral[300]}`,
                      borderRadius: '12px',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '0.875rem',
                      color: colors.neutral[700],
                      '&:focus-within': {
                        borderColor: colors.blue[400],
                        boxShadow: '0px 0px 0px 4px #B0D1FC',
                      },
                    }}
                  />
                  {maxLen && value.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: value.length > maxLen ? colors.red[400] : colors.neutral[400],
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {value.length}/{maxLen}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Content coverage cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <Box
          onClick={() => onNavigate('descriptions')}
          sx={{
            bgcolor: colors.neutral[50],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '12px',
            p: 2.5,
            cursor: 'pointer',
            '&:hover': { borderColor: colors.blue[200] },
          }}
        >
          <Typography variant="subtitle2" sx={{ color: colors.neutral[600], mb: 1 }}>
            Descriptions
          </Typography>
          <Typography variant="h3" sx={{ color: colors.neutral[800] }}>
            {descCount}
            <Typography component="span" variant="body2" sx={{ color: colors.neutral[400], ml: 0.5 }}>
              / {totalDescTypes}
            </Typography>
          </Typography>
          <Typography variant="caption" sx={{ color: descCount > 0 ? colors.green[300] : colors.orange[400] }}>
            {descCount > 0 ? 'Content authored' : 'No descriptions yet'}
          </Typography>
        </Box>

        <Box
          onClick={() => onNavigate('amenities')}
          sx={{
            bgcolor: colors.neutral[50],
            border: `1px solid ${colors.neutral[200]}`,
            borderRadius: '12px',
            p: 2.5,
            cursor: 'pointer',
            '&:hover': { borderColor: colors.blue[200] },
          }}
        >
          <Typography variant="subtitle2" sx={{ color: colors.neutral[600], mb: 1 }}>
            Amenities
          </Typography>
          <Typography variant="h3" sx={{ color: colors.neutral[800] }}>
            {amenityCount}
            <Typography component="span" variant="body2" sx={{ color: colors.neutral[400], ml: 0.5 }}>
              enabled
            </Typography>
          </Typography>
          <Typography variant="caption" sx={{ color: amenityCount > 0 ? colors.green[300] : colors.orange[400] }}>
            {amenityCount > 0 ? 'Amenities configured' : 'No amenities set'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Sidebar badge helpers ───────────────────────────────────────────────────

function NavBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: active ? colors.blue[100] : colors.neutral[200],
        color: active ? colors.blue[400] : colors.neutral[500],
        fontSize: '0.625rem',
        fontWeight: 700,
        height: 18,
        minWidth: 0,
        '& .MuiChip-label': { px: 0.75 },
      }}
    />
  );
}

function RefBadge() {
  return (
    <Chip
      label="ref"
      size="small"
      sx={{
        bgcolor: colors.neutral[200],
        color: colors.neutral[500],
        fontSize: '0.6rem',
        fontWeight: 700,
        height: 16,
        '& .MuiChip-label': { px: 0.5 },
      }}
    />
  );
}

// ─── Style helpers ───────────────────────────────────────────────────────────

const navItemSx = (selected: boolean) => ({
  borderRadius: '8px',
  mb: 0.25,
  py: 0.75,
  px: 1.5,
  bgcolor: selected ? colors.neutral[100] : 'transparent',
  color: selected ? colors.blue[400] : colors.neutral[600],
  '&:hover': { bgcolor: colors.neutral[100] },
  '&.Mui-selected': { bgcolor: colors.neutral[100], color: colors.blue[400] },
});

const subNavItemSx = (selected: boolean) => ({
  borderRadius: '8px',
  mb: 0.25,
  py: 0.5,
  pl: 4.5,
  pr: 1.5,
  bgcolor: selected ? colors.neutral[100] : 'transparent',
  color: selected ? colors.blue[400] : colors.neutral[600],
  '&:hover': { bgcolor: colors.neutral[100] },
  '&.Mui-selected': { bgcolor: colors.neutral[100], color: colors.blue[400] },
});
