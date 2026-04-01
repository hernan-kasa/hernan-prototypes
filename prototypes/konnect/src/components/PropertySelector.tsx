import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { properties, mockDescriptions, mockPropertyAmenities } from '../data/mockData';
import { Property } from '../types';
import { colors } from '../theme';

interface Props {
  selectedPropertyId: string;
  selectedScope: string; // 'property' or a room type id
  onScopeChange: (scope: string) => void;
  contentType?: 'descriptions' | 'amenities';
}

function hasContent(scopeKey: string, contentType: string): boolean {
  if (contentType === 'descriptions') {
    const entries = mockDescriptions[scopeKey] || [];
    return entries.some((e) => e.text.trim().length > 0);
  }
  return (mockPropertyAmenities[scopeKey] || []).length > 0;
}

export default function PropertySelector({
  selectedPropertyId,
  selectedScope,
  onScopeChange,
  contentType = 'descriptions',
}: Props) {
  const property: Property | undefined = properties.find((p) => p.propertyId === selectedPropertyId);

  const scopes = useMemo(() => {
    if (!property) return [];
    return [
      { id: 'property', label: 'Property', hasContent: hasContent(property.propertyId, contentType) },
      ...property.roomTypes.map((rt) => ({
        id: rt.id,
        label: rt.name,
        hasContent: hasContent(rt.id, contentType),
      })),
    ];
  }, [property, contentType]);

  if (!property) return null;

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${colors.neutral[200]}`,
        bgcolor: colors.neutral[50],
        borderRadius: '12px 12px 0 0',
        mx: -0.5,
      }}
    >
      <Tabs
        value={selectedScope}
        onChange={(_, val) => onScopeChange(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 42,
          '& .MuiTabs-indicator': {
            bgcolor: colors.blue[400],
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {scopes.map((scope) => (
          <Tab
            key={scope.id}
            value={scope.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 8,
                    color: scope.hasContent ? colors.green[300] : colors.orange[300],
                  }}
                />
                {scope.label}
              </Box>
            }
            sx={{
              minHeight: 42,
              py: 1,
              px: 2,
              fontSize: '0.8rem',
              fontWeight: selectedScope === scope.id ? 700 : 400,
              color: selectedScope === scope.id ? colors.blue[400] : colors.neutral[600],
              '&.Mui-selected': { color: colors.blue[400] },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
