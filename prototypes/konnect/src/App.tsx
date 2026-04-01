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
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import theme, { colors } from './theme';
import PropertySelector from './components/PropertySelector';
import PropertyOverviewTab from './pages/PropertyOverviewTab';
import DescriptionsTab from './pages/DescriptionsTab';
import AmenitiesTab from './pages/AmenitiesTab';
import FeesTab from './pages/FeesTab';
import TaxesTab from './pages/TaxesTab';
import SyncStatusTab from './pages/SyncStatusTab';
import { properties, mockDescriptions, mockPropertyAmenities } from './data/mockData';
import { descriptionTypes } from './data/descriptionTypes';

const SIDEBAR_WIDTH = 240;

type NavItem =
  | 'property-details'
  | 'overview'
  | 'descriptions'
  | 'amenities'
  | 'fees'
  | 'taxes'
  | 'sync-statuses';

const pageTitle: Record<NavItem, string> = {
  'property-details': 'Property Details',
  overview: 'Overview',
  descriptions: 'Descriptions',
  amenities: 'Amenities',
  fees: 'Fees',
  taxes: 'Taxes',
  'sync-statuses': 'Sync Statuses',
};

const totalDescTypes = descriptionTypes.length;

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('overview');
  const [channelMgmtOpen, setChannelMgmtOpen] = useState(true);
  const [channelSettingsOpen, setChannelSettingsOpen] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0].propertyId);
  const [selectedScope, setSelectedScope] = useState('property');

  const property = properties.find((p) => p.propertyId === selectedPropertyId);
  const scopeKey = selectedScope === 'property' ? selectedPropertyId : selectedScope;

  // Sidebar badges
  const descCount = useMemo(() => {
    const entries = mockDescriptions[selectedPropertyId] || [];
    return entries.filter((e) => e.text.trim().length > 0).length;
  }, [selectedPropertyId]);

  const amenityCount = useMemo(() => {
    return (mockPropertyAmenities[selectedPropertyId] || []).length;
  }, [selectedPropertyId]);

  const handlePropertyChange = (e: SelectChangeEvent) => {
    setSelectedPropertyId(e.target.value);
    setSelectedScope('property');
  };

  const showRoomTypeToggle = activeNav === 'descriptions' || activeNav === 'amenities';

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

            <List disablePadding sx={{ px: 1 }}>
              {/* Property details — Portfolio Manager */}
              <ListItemButton
                selected={activeNav === 'property-details'}
                onClick={() => setActiveNav('property-details')}
                sx={navItemSx(activeNav === 'property-details')}
              >
                <ListItemText
                  primary="Property details"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: activeNav === 'property-details' ? 700 : 400 }}
                />
              </ListItemButton>

              {/* Channel management — Konnect */}
              <ListItemButton
                onClick={() => setChannelMgmtOpen(!channelMgmtOpen)}
                sx={sectionHeaderSx}
              >
                <ListItemText
                  primary="Channel management"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }}
                />
                {channelMgmtOpen ? (
                  <ExpandLess sx={{ fontSize: 18, color: colors.neutral[400] }} />
                ) : (
                  <ExpandMore sx={{ fontSize: 18, color: colors.neutral[400] }} />
                )}
              </ListItemButton>
              <Collapse in={channelMgmtOpen}>
                <List disablePadding>
                  <ListItemButton
                    selected={activeNav === 'overview'}
                    onClick={() => setActiveNav('overview')}
                    sx={subNavItemSx(activeNav === 'overview')}
                  >
                    <ListItemText
                      primary="Overview"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: activeNav === 'overview' ? 700 : 400 }}
                    />
                  </ListItemButton>
                  <ListItemButton
                    selected={activeNav === 'descriptions'}
                    onClick={() => setActiveNav('descriptions')}
                    sx={subNavItemSx(activeNav === 'descriptions')}
                  >
                    <ListItemText
                      primary="Descriptions"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: activeNav === 'descriptions' ? 700 : 400 }}
                    />
                    <NavBadge label={`${descCount}/${totalDescTypes}`} active={descCount > 0} />
                  </ListItemButton>
                  <ListItemButton
                    selected={activeNav === 'amenities'}
                    onClick={() => setActiveNav('amenities')}
                    sx={subNavItemSx(activeNav === 'amenities')}
                  >
                    <ListItemText
                      primary="Amenities"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: activeNav === 'amenities' ? 700 : 400 }}
                    />
                    <NavBadge label={`${amenityCount}`} active={amenityCount > 0} />
                  </ListItemButton>
                  <ListItemButton
                    selected={activeNav === 'fees'}
                    onClick={() => setActiveNav('fees')}
                    sx={subNavItemSx(activeNav === 'fees')}
                  >
                    <ListItemText
                      primary="Fees"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: activeNav === 'fees' ? 700 : 400 }}
                    />
                    <RefBadge />
                  </ListItemButton>
                  <ListItemButton
                    selected={activeNav === 'taxes'}
                    onClick={() => setActiveNav('taxes')}
                    sx={subNavItemSx(activeNav === 'taxes')}
                  >
                    <ListItemText
                      primary="Taxes"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: activeNav === 'taxes' ? 700 : 400 }}
                    />
                    <RefBadge />
                  </ListItemButton>
                </List>
              </Collapse>

              {/* Channel settings */}
              <ListItemButton
                onClick={() => setChannelSettingsOpen(!channelSettingsOpen)}
                sx={sectionHeaderSx}
              >
                <ListItemText
                  primary="Channel settings"
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }}
                />
                {channelSettingsOpen ? (
                  <ExpandLess sx={{ fontSize: 18, color: colors.neutral[400] }} />
                ) : (
                  <ExpandMore sx={{ fontSize: 18, color: colors.neutral[400] }} />
                )}
              </ListItemButton>
              <Collapse in={channelSettingsOpen}>
                <List disablePadding>
                  <ListItemButton
                    selected={activeNav === 'sync-statuses'}
                    onClick={() => setActiveNav('sync-statuses')}
                    sx={subNavItemSx(activeNav === 'sync-statuses')}
                  >
                    <ListItemText
                      primary="Sync statuses"
                      primaryTypographyProps={{ variant: 'body2', fontWeight: activeNav === 'sync-statuses' ? 700 : 400 }}
                    />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Box>

          {/* Main content */}
          <Box
            sx={{
              ml: `${SIDEBAR_WIDTH}px`,
              flex: 1,
              minHeight: 'calc(100vh - 56px)',
            }}
          >
            <Box sx={{ maxWidth: 960, px: 4, py: 3 }}>
              {/* Page heading */}
              <Typography variant="h2" sx={{ color: colors.neutral[800], mb: 0.5 }}>
                {pageTitle[activeNav]}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.neutral[500], mb: 3 }}>
                {property?.propertyName}
              </Typography>

              {/* Scope tab bar — only on descriptions/amenities */}
              {showRoomTypeToggle && (
                <Box sx={{ mb: 3 }}>
                  <PropertySelector
                    selectedPropertyId={selectedPropertyId}
                    selectedScope={selectedScope}
                    onScopeChange={setSelectedScope}
                    contentType={activeNav as 'descriptions' | 'amenities'}
                  />
                </Box>
              )}

              {/* Page content */}
              {activeNav === 'property-details' && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="body1" sx={{ color: colors.neutral[500] }}>
                    Property details are managed by the Portfolio Manager.
                  </Typography>
                </Box>
              )}
              {activeNav === 'overview' && (
                <PropertyOverviewTab
                  propertyId={selectedPropertyId}
                  onNavigate={(nav, scope) => {
                    setActiveNav(nav as NavItem);
                    if (scope) setSelectedScope(scope);
                    else setSelectedScope('property');
                  }}
                />
              )}
              {activeNav === 'descriptions' && <DescriptionsTab key={scopeKey} scopeKey={scopeKey} propertyId={selectedPropertyId} />}
              {activeNav === 'amenities' && <AmenitiesTab key={scopeKey} scopeKey={scopeKey} propertyId={selectedPropertyId} />}
              {activeNav === 'fees' && <FeesTab />}
              {activeNav === 'taxes' && <TaxesTab />}
              {activeNav === 'sync-statuses' && <SyncStatusTab propertyId={selectedPropertyId} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// Small count badge for sidebar nav items
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

// "Ref" badge for read-only reference items
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

// Style helpers
const navItemSx = (selected: boolean) => ({
  borderRadius: '8px',
  mb: 0.25,
  py: 0.75,
  px: 1.5,
  bgcolor: selected ? colors.neutral[100] : 'transparent',
  '&:hover': { bgcolor: colors.neutral[100] },
  '&.Mui-selected': { bgcolor: colors.neutral[100] },
});

const sectionHeaderSx = {
  borderRadius: '8px',
  mb: 0.25,
  py: 0.75,
  px: 1.5,
  mt: 0.5,
  '&:hover': { bgcolor: colors.neutral[100] },
};

const subNavItemSx = (selected: boolean) => ({
  borderRadius: '8px',
  mb: 0.25,
  py: 0.5,
  pl: 3,
  pr: 1.5,
  bgcolor: selected ? colors.neutral[100] : 'transparent',
  color: selected ? colors.blue[400] : colors.neutral[600],
  '&:hover': { bgcolor: colors.neutral[100] },
  '&.Mui-selected': { bgcolor: colors.neutral[100], color: colors.blue[400] },
});
