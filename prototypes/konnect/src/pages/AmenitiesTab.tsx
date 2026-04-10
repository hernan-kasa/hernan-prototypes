import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import InputBase from '@mui/material/InputBase';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import SyncIcon from '@mui/icons-material/Sync';
import SearchIcon from '@mui/icons-material/Search';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SyncConfirmDialog from '../components/SyncConfirmDialog';
import CascadeDialog from '../components/CascadeDialog';
import { amenityTypes, AMENITY_CATEGORIES, AmenityType, amenityCategoryMap } from '../data/amenityTypes';
import { mockPropertyAmenities, mockSyncStatus } from '../data/mockData';
import { RoomType } from '../types';
import { colors } from '../theme';

interface Props {
  scopeKey: string;
  propertyId: string;
  isPropertyScope: boolean;
  roomTypes?: RoomType[];
  isDraft?: boolean;
  onCascade?: (roomTypeIds: string[]) => void;
  onClearDraft?: () => void;
}

interface AmenityState {
  enabled: boolean;
  attributes: string[];
}

export default function AmenitiesTab({
  scopeKey,
  propertyId,
  isPropertyScope,
  roomTypes,
  isDraft,
  onCascade,
  onClearDraft,
}: Props) {
  const [amenityState, setAmenityState] = useState<Record<string, AmenityState>>(() => {
    const state: Record<string, AmenityState> = {};
    const scopeAmenities = mockPropertyAmenities[scopeKey] || [];
    const enabledMap = new Map(scopeAmenities.map((a) => [a.typeCode, a.attributes]));

    amenityTypes.forEach((at) => {
      const attrs = enabledMap.get(at.code);
      state[at.code] =
        attrs !== undefined
          ? { enabled: true, attributes: [...attrs] }
          : { enabled: false, attributes: [] };
    });
    return state;
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedPendingSync, setSavedPendingSync] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncSnackOpen, setSyncSnackOpen] = useState(false);
  const [cascadeDialogOpen, setCascadeDialogOpen] = useState(false);
  const [cascadeSnackOpen, setCascadeSnackOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const channels = mockSyncStatus[propertyId] || [];
  const [showEnabledOnly, setShowEnabledOnly] = useState(false);

  const filteredAmenities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return amenityTypes.filter((at) => {
      if (showEnabledOnly && !amenityState[at.code]?.enabled) return false;
      if (!q) return true;
      const category = amenityCategoryMap[at.code] || '';
      return (
        at.names.en.toLowerCase().includes(q) ||
        at.code.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, showEnabledOnly, amenityState]);

  const groupedAmenities = useMemo(() => {
    const groups = new Map<string, AmenityType[]>();
    filteredAmenities.forEach((at) => {
      const category = amenityCategoryMap[at.code] || 'Other';
      const list = groups.get(category) || [];
      list.push(at);
      groups.set(category, list);
    });
    return groups;
  }, [filteredAmenities]);

  const handleToggle = (code: string) => {
    setAmenityState((prev) => ({
      ...prev,
      [code]: { ...prev[code], enabled: !prev[code].enabled },
    }));
    setHasUnsavedChanges(true);
  };

  const handleAttributeChange = (code: string, attributes: string[]) => {
    setAmenityState((prev) => ({
      ...prev,
      [code]: { ...prev[code], attributes },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Persist to mock data
    const enabledEntries = Object.entries(amenityState)
      .filter(([, s]) => s.enabled)
      .map(([code, s]) => ({ typeCode: code, attributes: s.attributes }));
    mockPropertyAmenities[scopeKey] = enabledEntries;
    setHasUnsavedChanges(false);
    setSavedPendingSync(true);
    if (isDraft && onClearDraft) {
      onClearDraft();
    }
  };

  const handleSync = () => {
    setSyncDialogOpen(false);
    setSavedPendingSync(false);
    setSyncSnackOpen(true);
  };

  // Cascade: copy current amenity state to room types
  const handleCascadeConfirm = (roomTypeIds: string[]) => {
    const enabledEntries = Object.entries(amenityState)
      .filter(([, s]) => s.enabled)
      .map(([code, s]) => ({ typeCode: code, attributes: [...s.attributes] }));
    for (const rtId of roomTypeIds) {
      mockPropertyAmenities[rtId] = enabledEntries.map((e) => ({ ...e }));
    }
    setCascadeDialogOpen(false);
    setCascadeSnackOpen(true);
    if (onCascade) onCascade(roomTypeIds);
  };

  const cascadeRoomTypes = useMemo(() => {
    if (!roomTypes) return [];
    return roomTypes.map((rt) => ({
      id: rt.id,
      name: rt.name,
      hasExistingContent: (mockPropertyAmenities[rt.id] || []).length > 0,
    }));
  }, [roomTypes]);

  const enabledCount = Object.values(amenityState).filter((s) => s.enabled).length;

  return (
    <Box>
      {/* Draft / inherited banner — room-type scope only */}
      {isDraft && !isPropertyScope && (
        <Alert
          severity="warning"
          icon={false}
          sx={{
            mb: 2,
            bgcolor: colors.orange[100],
            border: `1px solid ${colors.orange[200]}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="Draft"
              size="small"
              sx={{
                bgcolor: colors.orange[300],
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.675rem',
                height: 20,
              }}
            />
            <Typography variant="body2" sx={{ color: colors.orange[600] }}>
              Inherited from property — review and save to confirm
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Summary + search bar */}
      <Card
        sx={{ mb: 3, bgcolor: colors.neutral[100], border: `1px solid ${colors.neutral[200]}` }}
      >
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2">
              {enabledCount} amenities enabled out of {amenityTypes.length}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
              Source: NextPax Supply API · {AMENITY_CATEGORIES.length} categories · Shape:{' '}
              {'{ typeCode, attributes[] }'}
            </Typography>
          </Box>

          {savedPendingSync && !hasUnsavedChanges && (
            <Alert
              severity="success"
              sx={{ mb: 1.5 }}
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
              Amenities saved. Push changes to enabled channels?
            </Alert>
          )}

          {/* Search + filter row */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box
              sx={{
                flex: 1,
                bgcolor: colors.neutral[50],
                borderRadius: '8px',
                border: `1px solid ${colors.neutral[200]}`,
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                height: 36,
              }}
            >
              <SearchIcon sx={{ fontSize: 18, color: colors.neutral[400], mr: 1 }} />
              <InputBase
                placeholder="Search amenities by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1, fontSize: '0.8rem', color: colors.neutral[700] }}
              />
              {searchQuery && (
                <Typography
                  variant="caption"
                  sx={{ color: colors.neutral[400], ml: 1, whiteSpace: 'nowrap' }}
                >
                  {filteredAmenities.length} results
                </Typography>
              )}
            </Box>
            <Chip
              label="Enabled only"
              size="small"
              onClick={() => setShowEnabledOnly(!showEnabledOnly)}
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                bgcolor: showEnabledOnly ? colors.blue[400] : colors.neutral[200],
                color: showEnabledOnly ? '#fff' : colors.neutral[600],
                '&:hover': {
                  bgcolor: showEnabledOnly ? colors.blue[400] : colors.neutral[300],
                },
              }}
            />
          </Box>

          {/* Action buttons */}
          {!(savedPendingSync && !hasUnsavedChanges) && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1.5 }}>
              {isPropertyScope && roomTypes && roomTypes.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AccountTreeIcon />}
                  onClick={() => setCascadeDialogOpen(true)}
                  disabled={enabledCount === 0}
                >
                  Save & Apply to Room Types
                </Button>
              )}
              <Button
                variant="contained"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
              >
                Save Amenities
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Category accordions */}
      {AMENITY_CATEGORIES.map((category) => {
        const items = groupedAmenities.get(category);
        if (!items || items.length === 0) return null;

        const enabledInCat = items.filter((a) => amenityState[a.code]?.enabled).length;
        const hasEnabled = enabledInCat > 0;
        const isSearching = searchQuery.trim().length > 0;

        return (
          <Accordion
            key={category}
            defaultExpanded={hasEnabled || isSearching}
            disableGutters
            sx={{ mb: 1, '&:before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: colors.neutral[50],
                borderBottom: `1px solid ${colors.neutral[200]}`,
                '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 },
              }}
            >
              <Typography variant="subtitle2">{category}</Typography>
              <Chip
                label={`${enabledInCat} / ${items.length}`}
                size="small"
                sx={{
                  bgcolor: enabledInCat > 0 ? colors.blue[100] : colors.neutral[200],
                  color: enabledInCat > 0 ? colors.blue[400] : colors.neutral[500],
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  height: 20,
                }}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {items.map((amenity) => {
                const state = amenityState[amenity.code];
                if (!state) return null;

                return (
                  <Box
                    key={amenity.code}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderBottom: `1px solid ${colors.neutral[200]}`,
                      opacity: state.enabled ? 1 : 0.55,
                      '&:last-child': { borderBottom: 'none' },
                      '&:hover': { bgcolor: colors.neutral[50] },
                    }}
                  >
                    <Switch
                      checked={state.enabled}
                      onChange={() => handleToggle(amenity.code)}
                      size="small"
                    />
                    <Box sx={{ flex: 1, ml: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: state.enabled ? 500 : 400 }}
                        >
                          {amenity.names.en}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.neutral[400], fontFamily: 'monospace' }}
                        >
                          {amenity.code}
                        </Typography>
                      </Box>
                    </Box>

                    {state.enabled && (
                      <AmenityAttributeInput
                        amenity={amenity}
                        attributes={state.attributes}
                        onChange={(attrs) => handleAttributeChange(amenity.code, attrs)}
                      />
                    )}
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {filteredAmenities.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
            No amenities match "{searchQuery}"
          </Typography>
        </Box>
      )}

      <SyncConfirmDialog
        open={syncDialogOpen}
        channels={channels}
        contentType="amenities"
        onClose={() => setSyncDialogOpen(false)}
        onConfirm={handleSync}
      />
      <Snackbar
        open={syncSnackOpen}
        autoHideDuration={4000}
        onClose={() => setSyncSnackOpen(false)}
        message="Sync triggered. Amenities are being pushed to enabled channels via NextPax."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />

      {/* Cascade dialog + snackbar */}
      {isPropertyScope && (
        <>
          <CascadeDialog
            open={cascadeDialogOpen}
            contentType="amenities"
            roomTypes={cascadeRoomTypes}
            onConfirm={handleCascadeConfirm}
            onClose={() => setCascadeDialogOpen(false)}
          />
          <Snackbar
            open={cascadeSnackOpen}
            autoHideDuration={4000}
            onClose={() => setCascadeSnackOpen(false)}
            message="Amenities applied to room types as drafts. Review each room type to confirm."
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          />
        </>
      )}
    </Box>
  );
}

function AmenityAttributeInput({
  amenity,
  attributes,
  onChange,
}: {
  amenity: AmenityType;
  attributes: string[];
  onChange: (attrs: string[]) => void;
}) {
  if (amenity.codeType === 'boolean') {
    return null;
  }

  if (amenity.codeType === 'options' && amenity.options) {
    const selected = attributes[0] || '';
    return (
      <FormControl size="small" sx={{ minWidth: 140, mr: 1 }}>
        <Select
          value={selected}
          onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
          displayEmpty
          sx={{ fontSize: '0.8rem', height: 32 }}
        >
          <MenuItem value="" sx={{ fontSize: '0.8rem' }}>
            <em>Select...</em>
          </MenuItem>
          {amenity.options.map((opt) => (
            <MenuItem key={opt.attribute} value={opt.attribute} sx={{ fontSize: '0.8rem' }}>
              {opt.labels.en} ({opt.attribute})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (amenity.codeType === 'number') {
    const numVal = attributes[0] || '';
    return (
      <TextField
        size="small"
        type="number"
        value={numVal}
        onChange={(e) => onChange(e.target.value ? [e.target.value] : [])}
        sx={{ width: 100, mr: 1 }}
        inputProps={{ min: 0, style: { fontSize: '0.8rem' } }}
        placeholder="0"
      />
    );
  }

  return null;
}
