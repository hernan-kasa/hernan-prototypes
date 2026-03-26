import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Stepper, Step, StepLabel, Button, Stack } from "@mui/material";
import AppHeader from "../components/AppHeader";
import PropertySelector from "../components/PropertySelector";
import ContractUpload from "../components/ContractUpload";
import ReviewForm from "../components/ReviewForm";
import { extractionToForm } from "../hooks/useExtractionToForm";
import { colors } from "../theme";
import {
  uploadContractPdf,
  fetchProperties,
  fetchCancellationPolicies,
  fetchBookingBehaviorProfiles,
} from "../api/client";
import type {
  Property,
  CancellationPolicy,
  BookingBehaviorProfile,
  ContractExtraction,
  RatePlanForm,
} from "../types";

const STEPS = ["Select Property", "Upload Contract", "Review & Confirm"];

const EXTRACTION_MESSAGES = [
  "Uploading contract PDF...",
  "Analyzing contract type...",
  "Detecting rate structure...",
  "Extracting client and property details...",
  "Parsing rate tables...",
  "Identifying cancellation terms...",
  "Mapping concessions and waivers...",
  "Scoring field confidence...",
  "Assembling rate plan payload...",
];

type PageState =
  | { step: "select-property" }
  | { step: "upload" }
  | { step: "extracting" }
  | { step: "review"; extraction: ContractExtraction; formDefaults: RatePlanForm; warnings: string[]; pdfUrl: string | null };

export default function CreateFromContractPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ step: "select-property" });
  const [properties, setProperties] = useState<Property[]>([]);
  const [cancellationPolicies, setCancellationPolicies] = useState<CancellationPolicy[]>([]);
  const [bookingBehaviorProfiles, setBookingBehaviorProfiles] = useState<BookingBehaviorProfile[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractionProgress, setExtractionProgress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchProperties(),
      fetchCancellationPolicies(),
      fetchBookingBehaviorProfiles(),
    ]).then(([props, policies, profiles]) => {
      setProperties(props);
      setCancellationPolicies(policies);
      setBookingBehaviorProfiles(profiles);
      if (props.length > 0) setSelectedPropertyId(props[0].id);
    });
  }, []);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  const handlePropertyConfirmed = () => {
    if (selectedProperty) setState({ step: "upload" });
  };

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!selectedProperty) return;
      setSelectedFile(file);
      setExtractionError(null);
      setState({ step: "extracting" });

      let msgIndex = 0;
      setExtractionProgress(EXTRACTION_MESSAGES[0]);
      const interval = setInterval(() => {
        msgIndex = Math.min(msgIndex + 1, EXTRACTION_MESSAGES.length - 1);
        setExtractionProgress(EXTRACTION_MESSAGES[msgIndex]);
      }, 2000);

      try {
        const result = await uploadContractPdf(file);
        clearInterval(interval);

        const { form: formDefaults } = extractionToForm(
          result.extraction,
          selectedProperty,
          cancellationPolicies,
          bookingBehaviorProfiles
        );

        const pdfUrl = URL.createObjectURL(file);
        setState({ step: "review", extraction: result.extraction, formDefaults, warnings: result.warnings, pdfUrl });
      } catch (err) {
        clearInterval(interval);
        setExtractionError(
          err instanceof Error ? err.message : "Extraction failed. Please try again or use the manual wizard."
        );
        setState({ step: "upload" });
      }
    },
    [selectedProperty, cancellationPolicies, bookingBehaviorProfiles]
  );

  const handleSubmit = async (data: RatePlanForm) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    navigate("/", {
      state: {
        created: true,
        ratePlan: { code: data.code, name: data.name, planType: data.planType },
      },
    });
  };

  const activeStep =
    state.step === "select-property" ? 0 : state.step === "upload" || state.step === "extracting" ? 1 : 2;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.neutral[100] }}>
      <AppHeader />
      <Box sx={{ px: 3, py: 4, maxWidth: state.step === "review" ? 1120 : 960, mx: "auto" }}>
        <Stack spacing={2} sx={{ mb: 4 }}>
            <Typography variant="h2">Create Rate Plan from Contract</Typography>
            <Stepper activeStep={activeStep} sx={{ maxWidth: 480 }}>
              {STEPS.map((label) => (
                <Step key={label}><StepLabel>{label}</StepLabel></Step>
              ))}
            </Stepper>
          </Stack>

        {/* Step 1: Property */}
        {state.step === "select-property" && (
          <Box sx={{ maxWidth: 420 }}>
            <Typography variant="body2" sx={{ color: colors.neutral[600], mb: 2 }}>
              Select the target property for this rate plan. The property's room types will be
              available for mapping during review.
            </Typography>
            <PropertySelector
              properties={properties}
              selectedPropertyId={selectedPropertyId}
              onChange={setSelectedPropertyId}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate("/")}>Cancel</Button>
              <Button variant="contained" disabled={!selectedProperty} onClick={handlePropertyConfirmed}>
                Continue
              </Button>
            </Stack>
          </Box>
        )}

        {/* Step 2: Upload */}
        {(state.step === "upload" || state.step === "extracting") && (
          <Box sx={{ maxWidth: 480 }}>
            <Box sx={{ mb: 2, opacity: 0.6, pointerEvents: state.step === "extracting" ? "none" : "auto" }}>
              <PropertySelector
                properties={properties}
                selectedPropertyId={selectedPropertyId}
                onChange={setSelectedPropertyId}
                disabled={state.step === "extracting"}
              />
            </Box>
            <ContractUpload
              onFileSelected={handleFileSelected}
              isExtracting={state.step === "extracting"}
              extractionProgress={extractionProgress}
              error={extractionError}
              selectedFile={selectedFile}
            />
          </Box>
        )}

        {/* Step 3: Review */}
        {state.step === "review" && selectedProperty && (
          <ReviewForm
            defaultValues={state.formDefaults}
            extraction={state.extraction}
            property={selectedProperty}
            cancellationPolicies={cancellationPolicies}
            bookingBehaviorProfiles={bookingBehaviorProfiles}
            warnings={state.warnings}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/")}
            isSubmitting={isSubmitting}
            pdfUrl={state.pdfUrl}
          />
        )}

      </Box>
    </Box>
  );
}
