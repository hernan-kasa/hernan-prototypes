import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { colors } from "../theme";

interface ContractUploadProps {
  onFileSelected: (file: File) => void;
  isExtracting: boolean;
  extractionProgress: string;
  error: string | null;
  selectedFile: File | null;
}

export default function ContractUpload({
  onFileSelected,
  isExtracting,
  extractionProgress,
  error,
  selectedFile,
}: ContractUploadProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onFileSelected(accepted[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isExtracting,
  });

  if (isExtracting) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          border: `2px solid ${colors.blue[400]}`,
          bgcolor: colors.blue[100],
          borderRadius: 3,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <PictureAsPdfIcon sx={{ fontSize: 40, color: colors.blue[400] }} />
          <Typography variant="subtitle2">{selectedFile?.name}</Typography>
          <LinearProgress
            sx={{
              height: 4,
              borderRadius: 2,
              width: "100%",
              maxWidth: 360,
              bgcolor: colors.blue[200],
              "& .MuiLinearProgress-bar": { bgcolor: colors.blue[400] },
            }}
          />
          <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
            {extractionProgress}
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error">{error}</Alert>}
      <Paper
        {...getRootProps()}
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          border: "2px dashed",
          borderColor: isDragActive ? colors.blue[400] : colors.neutral[300],
          bgcolor: isDragActive ? colors.blue[100] : colors.neutral[50],
          cursor: "pointer",
          borderRadius: 3,
          transition: "all 0.2s",
          "&:hover": {
            borderColor: colors.blue[300],
            bgcolor: colors.blue[100],
          },
        }}
      >
        <input {...getInputProps()} />
        <Stack spacing={1.5} alignItems="center">
          <CloudUploadIcon
            sx={{ fontSize: 40, color: isDragActive ? colors.blue[400] : colors.neutral[400] }}
          />
          <Typography variant="subtitle2">
            {isDragActive ? "Drop your contract here" : "Upload signed contract PDF"}
          </Typography>
          <Typography variant="body2" sx={{ color: colors.neutral[600] }}>
            Drag & drop or click to select. Supports Corporate Rate Agreements and Group Contracts.
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  );
}
