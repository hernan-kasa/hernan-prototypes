import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { feeTypes, taxTypes, FEE_CATEGORIES, feeCategoryMap } from '../data/feeTypes';
import { colors } from '../theme';

export default function FeesAndTaxesTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return feeTypes;
    return feeTypes.filter(
      (f) => f.names.en.toLowerCase().includes(q) || f.code.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const filteredTaxes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return taxTypes;
    return taxTypes.filter(
      (t) => t.names.en.toLowerCase().includes(q) || t.code.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const groupedFees = useMemo(() => {
    const groups = new Map<string, typeof feeTypes>();
    filteredFees.forEach((f) => {
      const cat = feeCategoryMap[f.code] || 'Other';
      const list = groups.get(cat) || [];
      list.push(f);
      groups.set(cat, list);
    });
    return groups;
  }, [filteredFees]);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Fees and taxes are managed via the CMB pipeline. This is a read-only reference of available types from the NextPax Supply API.
      </Alert>

      {/* Search */}
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
          placeholder="Search fees or taxes by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, fontSize: '0.8rem', color: colors.neutral[700] }}
        />
        {searchQuery && (
          <Typography variant="caption" sx={{ color: colors.neutral[400], ml: 1, whiteSpace: 'nowrap' }}>
            {filteredFees.length + filteredTaxes.length} results
          </Typography>
        )}
      </Box>

      {/* Fees section */}
      <Typography variant="h4" sx={{ color: colors.neutral[800], mb: 0.5 }}>
        Fee Types
      </Typography>
      <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block', mb: 2 }}>
        {feeTypes.length} fee types available from the NextPax Supply API
      </Typography>

      {FEE_CATEGORIES.map((category) => {
        const items = groupedFees.get(category);
        if (!items || items.length === 0) return null;

        return (
          <Accordion
            key={category}
            defaultExpanded={false}
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
                label={items.length}
                size="small"
                sx={{
                  bgcolor: colors.neutral[200],
                  color: colors.neutral[600],
                  fontWeight: 700,
                  fontSize: '0.675rem',
                  height: 20,
                }}
              />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {items.map((fee) => (
                <Box
                  key={fee.code}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1,
                    borderBottom: `1px solid ${colors.neutral[200]}`,
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { bgcolor: colors.neutral[50] },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{fee.names.en}</Typography>
                    <Typography variant="caption" sx={{ color: colors.neutral[400], fontFamily: 'monospace' }}>
                      {fee.code}
                    </Typography>
                  </Box>
                  {fee.classifications && fee.classifications.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {fee.classifications.map((c) => (
                        <Chip
                          key={c}
                          label={c}
                          size="small"
                          sx={{
                            bgcolor: colors.neutral[200],
                            color: colors.neutral[600],
                            fontSize: '0.625rem',
                            height: 18,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Taxes section */}
      <Typography variant="h4" sx={{ color: colors.neutral[800], mt: 4, mb: 0.5 }}>
        Tax Types
      </Typography>
      <Typography variant="caption" sx={{ color: colors.neutral[500], display: 'block', mb: 2 }}>
        {taxTypes.length} tax types available from the NextPax Supply API
      </Typography>

      <Accordion
        defaultExpanded
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
          <Typography variant="subtitle2">All Taxes</Typography>
          <Chip
            label={filteredTaxes.length}
            size="small"
            sx={{
              bgcolor: colors.neutral[200],
              color: colors.neutral[600],
              fontWeight: 700,
              fontSize: '0.675rem',
              height: 20,
            }}
          />
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          {filteredTaxes.map((tax) => (
            <Box
              key={tax.code}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                borderBottom: `1px solid ${colors.neutral[200]}`,
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { bgcolor: colors.neutral[50] },
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
                      sx={{
                        bgcolor: colors.neutral[200],
                        color: colors.neutral[600],
                        fontSize: '0.625rem',
                        height: 18,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {filteredFees.length === 0 && filteredTaxes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
            No fees or taxes match "{searchQuery}"
          </Typography>
        </Box>
      )}
    </Box>
  );
}
