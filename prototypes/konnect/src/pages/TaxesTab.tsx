import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { taxTypes } from '../data/feeTypes';
import { colors } from '../theme';

export default function TaxesTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTaxes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return taxTypes;
    return taxTypes.filter(
      (t) => t.names.en.toLowerCase().includes(q) || t.code.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Taxes are managed via the CMB pipeline. This is a read-only reference of the {taxTypes.length} tax types available from the NextPax Supply API.
      </Alert>

      <Box
        sx={{
          bgcolor: colors.neutral[50],
          borderRadius: '8px',
          border: `1px solid ${colors.neutral[200]}`,
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          height: 36,
          mb: 3,
          maxWidth: 480,
        }}
      >
        <SearchIcon sx={{ fontSize: 18, color: colors.neutral[400], mr: 1 }} />
        <InputBase
          placeholder="Search taxes by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, fontSize: '0.8rem', color: colors.neutral[700] }}
        />
        {searchQuery && (
          <Typography variant="caption" sx={{ color: colors.neutral[400], ml: 1, whiteSpace: 'nowrap' }}>
            {filteredTaxes.length} results
          </Typography>
        )}
      </Box>

      {filteredTaxes.map((tax) => (
        <Box
          key={tax.code}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.25,
            bgcolor: colors.neutral[50],
            borderBottom: `1px solid ${colors.neutral[200]}`,
            '&:first-of-type': { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
            '&:last-of-type': { borderBottom: 'none', borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
            '&:hover': { bgcolor: colors.neutral[100] },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">{tax.names.en}</Typography>
            <Typography variant="caption" sx={{ color: colors.neutral[400], fontFamily: 'monospace' }}>
              {tax.code}
            </Typography>
          </Box>
          {tax.classifications && tax.classifications.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {tax.classifications.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  size="small"
                  sx={{ bgcolor: colors.neutral[200], color: colors.neutral[600], fontSize: '0.625rem', height: 18 }}
                />
              ))}
            </Box>
          )}
        </Box>
      ))}

      {filteredTaxes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
            No taxes match "{searchQuery}"
          </Typography>
        </Box>
      )}
    </Box>
  );
}
