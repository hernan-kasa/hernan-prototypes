import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AMENITY_CATEGORIES } from '../data/amenityTypes';
import {
  buildImportPreview,
  groupProposalsByCategory,
  PmsConfidence,
  ProposedImport,
} from '../data/pmsMapping';
import { colors } from '../theme';

interface Props {
  open: boolean;
  propertyId: string;
  currentlyEnabledCodes: Set<string>;
  onClose: () => void;
  onConfirm: (selected: ProposedImport[]) => void;
}

/**
 * Import from PMS — preview dialog.
 *
 * Shows the operator a grouped list of PMS amenities that would pre-populate
 * Konnect toggles. Checkboxes default to checked — the review step is about
 * excluding wrong mappings, not opting in to each one. Confirm writes the
 * selected entries to the amenity editor with `seededFromPMS: true`.
 */
export default function ImportFromPmsDialog({
  open,
  propertyId,
  currentlyEnabledCodes,
  onClose,
  onConfirm,
}: Props) {
  const { proposals, unmapped } = useMemo(
    () => buildImportPreview(propertyId, currentlyEnabledCodes),
    [propertyId, currentlyEnabledCodes],
  );

  // Group for display in the order the main editor uses.
  const grouped = useMemo(
    () => groupProposalsByCategory(proposals, AMENITY_CATEGORIES),
    [proposals],
  );

  // Track which nextPaxCodes are selected for import — default to all.
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    () => new Set(proposals.map((p) => p.mapping.nextPaxCode)),
  );

  const [unmappedOpen, setUnmappedOpen] = useState(false);

  // Re-seed selection whenever the modal is (re)opened or the underlying
  // proposal set changes (e.g. operator imported once, then opens it again).
  useEffect(() => {
    if (open) {
      setSelectedCodes(new Set(proposals.map((p) => p.mapping.nextPaxCode)));
      setUnmappedOpen(false);
    }
  }, [open, proposals]);

  const toggle = (code: string) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = proposals.filter((p) => selectedCodes.has(p.mapping.nextPaxCode));
    onConfirm(selected);
  };

  const hasProposals = proposals.length > 0;
  const selectedCount = selectedCodes.size;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CloudDownloadIcon sx={{ color: colors.blue[400] }} />
        Import amenities from Portfolio Manager
      </DialogTitle>

      <DialogContent dividers sx={{ px: 0, py: 0 }}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
            Review the amenities Portfolio Manager already has on file for this property.
            Uncheck anything that shouldn't pre-populate the Konnect editor, then confirm.
            Imports are additive — amenities you've already configured are excluded automatically.
          </Typography>
        </Box>

        {!hasProposals && <EmptyState />}

        {hasProposals && (
          <Box sx={{ pb: 1 }}>
            {grouped.map((group) => (
              <Box key={group.category} sx={{ mb: 1 }}>
                <Box
                  sx={{
                    px: 3,
                    py: 1,
                    bgcolor: colors.neutral[100],
                    borderTop: `1px solid ${colors.neutral[200]}`,
                    borderBottom: `1px solid ${colors.neutral[200]}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: colors.neutral[700] }}>
                    {group.category}
                  </Typography>
                  <Chip
                    label={group.items.length}
                    size="small"
                    sx={{
                      bgcolor: colors.blue[100],
                      color: colors.blue[400],
                      fontWeight: 700,
                      fontSize: '0.675rem',
                      height: 20,
                    }}
                  />
                </Box>
                {group.items.map((item) => (
                  <ProposalRow
                    key={item.mapping.nextPaxCode}
                    item={item}
                    checked={selectedCodes.has(item.mapping.nextPaxCode)}
                    onToggle={() => toggle(item.mapping.nextPaxCode)}
                  />
                ))}
              </Box>
            ))}
          </Box>
        )}

        {/* Unmapped summary — always shown when there are unmapped entries */}
        {unmapped.length > 0 && (
          <Box
            sx={{
              mt: hasProposals ? 0 : 2,
              mx: 3,
              mb: 2,
              borderTop: `1px solid ${colors.neutral[200]}`,
              pt: 1.5,
            }}
          >
            <Box
              onClick={() => setUnmappedOpen((v) => !v)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                cursor: 'pointer',
                color: colors.neutral[600],
                '&:hover': { color: colors.neutral[800] },
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {unmapped.length} PMS amenit{unmapped.length === 1 ? 'y' : 'ies'} could not be mapped automatically
              </Typography>
              <IconButton size="small" sx={{ p: 0.25, ml: 0.25 }}>
                {unmappedOpen ? (
                  <ExpandLessIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMoreIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Box>
            <Collapse in={unmappedOpen}>
              <Box
                sx={{
                  mt: 1,
                  pl: 1.5,
                  borderLeft: `2px solid ${colors.neutral[200]}`,
                }}
              >
                {unmapped.map((u, i) => (
                  <Typography
                    key={`${u.pmsLabel}-${i}`}
                    variant="caption"
                    sx={{ color: colors.neutral[500], display: 'block', lineHeight: 1.6 }}
                  >
                    <Box component="span" sx={{ fontWeight: 600, color: colors.neutral[700] }}>
                      {u.pmsLabel}
                    </Box>{' '}
                    — {u.reason}
                  </Typography>
                ))}
              </Box>
            </Collapse>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="text" sx={{ color: colors.neutral[600] }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!hasProposals || selectedCount === 0}
          startIcon={<CloudDownloadIcon />}
        >
          {hasProposals ? `Import Selected (${selectedCount})` : 'Nothing to import'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Row ─────────────────────────────────────────────────────────────────────

function ProposalRow({
  item,
  checked,
  onToggle,
}: {
  item: ProposedImport;
  checked: boolean;
  onToggle: () => void;
}) {
  const { mapping } = item;
  return (
    <Box
      sx={{
        px: 3,
        py: 1.25,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1,
        borderBottom: `1px solid ${colors.neutral[200]}`,
        opacity: checked ? 1 : 0.55,
        '&:hover': { bgcolor: colors.neutral[50] },
      }}
    >
      <Checkbox
        checked={checked}
        onChange={onToggle}
        size="small"
        sx={{ mt: -0.25 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: colors.neutral[800] }}>
            {mapping.nextPaxName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: colors.neutral[400], fontFamily: 'monospace' }}
          >
            {mapping.nextPaxCode}
          </Typography>
          <ConfidenceBadge confidence={mapping.confidence} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.25, flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
            Attribute:{' '}
            <Box component="span" sx={{ color: colors.neutral[700], fontWeight: 600 }}>
              {mapping.attributeLabel}
            </Box>
          </Typography>
          <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
            Source:{' '}
            <Box component="span" sx={{ color: colors.neutral[700], fontWeight: 600 }}>
              {mapping.pmsLabel}
            </Box>
          </Typography>
        </Box>
        {mapping.policyWarning && (
          <Box
            sx={{
              mt: 0.75,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 0.5,
              px: 1,
              py: 0.5,
              bgcolor: colors.orange[100],
              border: `1px solid ${colors.orange[200]}`,
              borderRadius: '6px',
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 14, color: colors.orange[400], mt: 0.1 }} />
            <Typography variant="caption" sx={{ color: colors.orange[600], lineHeight: 1.4 }}>
              This amenity has a corresponding NextPax policy. {mapping.policyWarning}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Confidence badge ────────────────────────────────────────────────────────

function ConfidenceBadge({ confidence }: { confidence: PmsConfidence }) {
  if (confidence === 'high') {
    return (
      <Chip
        label="High"
        size="small"
        sx={{
          bgcolor: colors.green[100],
          color: colors.green[500],
          fontSize: '0.625rem',
          fontWeight: 700,
          height: 18,
          '& .MuiChip-label': { px: 0.75 },
        }}
      />
    );
  }
  return (
    <Chip
      label="Medium"
      size="small"
      sx={{
        bgcolor: colors.orange[100],
        color: colors.orange[600],
        fontSize: '0.625rem',
        fontWeight: 700,
        height: 18,
        '& .MuiChip-label': { px: 0.75 },
      }}
    />
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <Box sx={{ py: 5, px: 3, textAlign: 'center' }}>
      <CheckCircleIcon sx={{ fontSize: 36, color: colors.green[300], mb: 1 }} />
      <Typography variant="subtitle2" sx={{ color: colors.neutral[700], mb: 0.5 }}>
        All mappable PMS amenities are already configured.
      </Typography>
      <Typography variant="caption" sx={{ color: colors.neutral[500] }}>
        There's nothing new to import for this property right now.
      </Typography>
    </Box>
  );
}
