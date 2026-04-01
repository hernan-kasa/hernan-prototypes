import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputBase from '@mui/material/InputBase';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { imageCategories } from '../data/imageCategories';
import { colors } from '../theme';

export default function PhotosTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return imageCategories;
    return imageCategories.filter(
      (ic) => ic.names.en.toLowerCase().includes(q) || ic.code.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        Photo management is planned for V2. This reference shows the {imageCategories.length} image categories available from the NextPax Supply API for tagging property photos.
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
          placeholder="Search image categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, fontSize: '0.8rem', color: colors.neutral[700] }}
        />
        {searchQuery && (
          <Typography variant="caption" sx={{ color: colors.neutral[400], ml: 1, whiteSpace: 'nowrap' }}>
            {filtered.length} results
          </Typography>
        )}
      </Box>

      {/* Category grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 1.5,
        }}
      >
        {filtered.map((ic) => (
          <Card
            key={ic.code}
            sx={{
              border: `1px solid ${colors.neutral[200]}`,
              '&:hover': { borderColor: colors.blue[200], bgcolor: colors.blue[100] },
              transition: 'all 0.15s',
            }}
          >
            <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PhotoLibraryIcon sx={{ fontSize: 20, color: colors.neutral[400] }} />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
                  {ic.names.en}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.neutral[400], fontFamily: 'monospace' }}>
                  {ic.code}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {filtered.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="body2" sx={{ color: colors.neutral[500] }}>
            No image categories match "{searchQuery}"
          </Typography>
        </Box>
      )}

      {/* Summary */}
      <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`${imageCategories.length} categories total`}
          size="small"
          sx={{ bgcolor: colors.neutral[200], color: colors.neutral[600], fontWeight: 700 }}
        />
        <Chip
          label="V2 scope"
          size="small"
          sx={{ bgcolor: colors.orange[100], color: colors.orange[600], fontWeight: 700 }}
        />
      </Box>
    </Box>
  );
}
