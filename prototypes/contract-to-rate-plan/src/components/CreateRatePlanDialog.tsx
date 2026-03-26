import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteIcon from "@mui/icons-material/EditNote";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme";

interface CreateRatePlanDialogProps {
  open: boolean;
  onClose: () => void;
}

const OPTIONS = [
  {
    title: "Create from Scratch",
    description: "Open the standard wizard to manually configure a rate plan step by step.",
    icon: <EditNoteIcon sx={{ fontSize: 28 }} />,
    chipLabel: "Existing Wizard",
    chipBg: colors.neutral[200],
    chipColor: colors.neutral[800],
    iconBg: colors.neutral[200],
    iconColor: colors.neutral[500],
    path: null,
    disabled: true,
  },
  {
    title: "Create from Contract",
    description: "Upload a signed contract PDF. AI extracts the fields, you review and confirm.",
    icon: <UploadFileIcon sx={{ fontSize: 28 }} />,
    chipLabel: "New",
    chipBg: colors.blue[100],
    chipColor: colors.blue[600],
    iconBg: colors.blue[100],
    iconColor: colors.blue[400],
    path: "/create",
    disabled: false,
  },
  {
    title: "Amend Existing Rate Plan",
    description: "Upload an amendment PDF and see a diff of what changed before confirming.",
    icon: <CompareArrowsIcon sx={{ fontSize: 28 }} />,
    chipLabel: "New",
    chipBg: colors.blue[100],
    chipColor: colors.blue[600],
    iconBg: colors.blue[100],
    iconColor: colors.blue[400],
    path: "/amend",
    disabled: false,
  },
];

export default function CreateRatePlanDialog({ open, onClose }: CreateRatePlanDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 0 }}>
        <Typography variant="h3">Create Rate Plan</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon sx={{ fontSize: 20, color: colors.neutral[500] }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1, pb: 3 }}>
        <Typography variant="body2" sx={{ color: colors.neutral[600], mb: 2.5 }}>
          Choose how you'd like to create or update a rate plan.
        </Typography>
        <Stack spacing={1.5}>
          {OPTIONS.map((opt) => (
            <Card
              key={opt.title}
              elevation={0}
              sx={{
                border: `1px solid ${colors.neutral[200]}`,
                opacity: opt.disabled ? 0.45 : 1,
                transition: "border-color 0.15s, box-shadow 0.15s",
                "&:hover": opt.disabled
                  ? {}
                  : { borderColor: colors.blue[300], boxShadow: "6px 6px 20px rgba(26, 56, 101, 0.08)" },
              }}
            >
              <CardActionArea
                disabled={opt.disabled}
                onClick={() => {
                  if (opt.path) {
                    onClose();
                    navigate(opt.path);
                  }
                }}
              >
                <CardContent sx={{ py: 2, px: 2.5 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: opt.iconBg,
                        color: opt.iconColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {opt.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.25 }}>
                        <Typography variant="subtitle2">{opt.title}</Typography>
                        <Chip
                          label={opt.chipLabel}
                          size="small"
                          sx={{
                            bgcolor: opt.chipBg,
                            color: opt.chipColor,
                            fontWeight: 700,
                            fontSize: "0.5625rem",
                            height: 18,
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" sx={{ color: colors.neutral[600], fontSize: "0.8125rem" }}>
                        {opt.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
