import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import AppHeader from "../components/AppHeader";
import PlanSelector from "../components/PlanSelector";
import ContractUpload from "../components/ContractUpload";
import DiffViewer from "../components/DiffViewer";
import { extractionToForm, computeDiffs } from "../hooks/useExtractionToForm";
import { colors } from "../theme";
import {
  uploadContractPdf,
  fetchProperties,
  fetchCancellationPolicies,
  fetchBookingBehaviorProfiles,
  fetchExistingRatePlans,
} from "../api/client";
import type {
  Property,
  CancellationPolicy,
  BookingBehaviorProfile,
  ExistingRatePlan,
  ContractExtraction,
  FieldDiff,
} from "../types";

const STEPS = ["Select Rate Plan", "Upload Amendment", "Review Changes", "Confirm"];

const DIFF_LABELS: Record<string, string> = {
  name: "Rate Plan Name",
  description: "Description",
  cancellationPolicyId: "Cancellation Policy",
  bookingBehaviorProfileId: "Booking Behavior",
  effectiveDateRange: "Effective Date Range",
  applicableDateRange: "Applicable Date Range",
  blockedDateRanges: "Blocked Date Ranges",
  "eventCode.accountName": "Account Name",
  "eventCode.salesManager": "Sales Manager",
  "marketSegmentation.segment": "Market Segment",
};

const EXTRACTION_MESSAGES = [
  "Uploading amendment PDF...",
  "Analyzing changes...",
  "Extracting amended fields...",
  "Comparing against existing rate plan...",
  "Building diff view...",
];

type PageState =
  | { step: "select-plan" }
  | { step: "upload" }
  | { step: "extracting" }
  | { step: "diff"; extraction: ContractExtraction; diffs: FieldDiff[]; pdfUrl: string | null };

export default function AmendRatePlanPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ step: "select-plan" });
  const [properties, setProperties] = useState<Property[]>([]);
  const [cancellationPolicies, setCancellationPolicies] = useState<CancellationPolicy[]>([]);
  const [bookingBehaviorProfiles, setBookingBehaviorProfiles] = useState<BookingBehaviorProfile[]>([]);
  const [existingPlans, setExistingPlans] = useState<ExistingRatePlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ExistingRatePlan | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [extractionProgress, setExtractionProgress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchProperties(),
      fetchCancellationPolicies(),
      fetchBookingBehaviorProfiles(),
      fetchExistingRatePlans(),
    ]).then(([props, policies, profiles, plans]) => {
      setProperties(props);
      setCancellationPolicies(policies);
      setBookingBehaviorProfiles(profiles);
      setExistingPlans(plans);
    });
  }, []);

  const handleFileSelected = useCallback(
    async (file: File) => {
      if (!selectedPlan) return;
      const property = properties.find((p) => p.id === selectedPlan.propertyId);
      if (!property) return;

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

        const { form: proposedForm } = extractionToForm(
          result.extraction, property, cancellationPolicies, bookingBehaviorProfiles
        );

        const existingFlat: Record<string, unknown> = {
          name: selectedPlan.name,
          description: selectedPlan.description,
          cancellationPolicyId: selectedPlan.cancellationPolicy,
          bookingBehaviorProfileId: selectedPlan.bookingBehaviorProfileId,
          effectiveDateRange: selectedPlan.applicabilityConfiguration.effectiveDateRange,
          applicableDateRange: selectedPlan.applicabilityConfiguration.applicableDateRange,
          blockedDateRanges: selectedPlan.applicabilityConfiguration.blockedDateRanges,
          "eventCode.accountName": selectedPlan.eventCode?.accountName,
          "eventCode.salesManager": selectedPlan.eventCode?.salesManager,
          "marketSegmentation.segment": selectedPlan.marketSegmentation?.segment,
        };

        const proposedFlat: Record<string, unknown> = {
          name: proposedForm.name,
          description: proposedForm.description,
          cancellationPolicyId: proposedForm.cancellationPolicyId,
          bookingBehaviorProfileId: proposedForm.bookingBehaviorProfileId,
          effectiveDateRange: proposedForm.effectiveDateRange,
          applicableDateRange: proposedForm.applicableDateRange,
          blockedDateRanges: proposedForm.blockedDateRanges,
          "eventCode.accountName": proposedForm.eventCode?.accountName,
          "eventCode.salesManager": proposedForm.eventCode?.salesManager,
          "marketSegmentation.segment": proposedForm.marketSegmentation?.segment,
        };

        const diffs = computeDiffs(existingFlat, proposedFlat, DIFF_LABELS);
        const pdfUrl = URL.createObjectURL(file);
        setState({ step: "diff", extraction: result.extraction, diffs, pdfUrl });
      } catch (err) {
        clearInterval(interval);
        setExtractionError(err instanceof Error ? err.message : "Extraction failed. Please try again.");
        setState({ step: "upload" });
      }
    },
    [selectedPlan, properties, cancellationPolicies, bookingBehaviorProfiles]
  );

  const handleToggleDiff = (index: number) => {
    if (state.step !== "diff") return;
    const updated = [...state.diffs];
    updated[index] = { ...updated[index], accepted: !updated[index].accepted };
    setState({ ...state, diffs: updated });
  };

  const handleConfirmAmendment = async () => {
    if (state.step !== "diff" || !selectedPlan) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    navigate("/", {
      state: {
        created: true,
        ratePlan: { code: selectedPlan.code, name: selectedPlan.name, planType: selectedPlan.planType },
        isAmendment: true,
      },
    });
  };

  const activeStep =
    state.step === "select-plan" ? 0
    : state.step === "upload" || state.step === "extracting" ? 1
    : state.step === "diff" ? 2
    : 3;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: colors.neutral[100] }}>
      <AppHeader />
      <Box sx={{ px: 3, py: 4, maxWidth: state.step === "diff" ? 1120 : 960, mx: "auto" }}>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h2">Amend Existing Rate Plan</Typography>
          <Stepper activeStep={activeStep} sx={{ maxWidth: 560 }}>
            {STEPS.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        </Stack>

        {/* Step 1: Select plan */}
        {state.step === "select-plan" && (
          <Box sx={{ maxWidth: 520 }}>
            <Typography variant="body2" sx={{ color: colors.neutral[600], mb: 2 }}>
              Select the rate plan you want to amend. After selecting, you'll upload the amendment
              contract and see a diff of what changed.
            </Typography>
            <PlanSelector
              plans={existingPlans}
              selectedPlanId={selectedPlan?.id ?? null}
              onSelect={setSelectedPlan}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate("/")}>Cancel</Button>
              <Button variant="contained" disabled={!selectedPlan} onClick={() => selectedPlan && setState({ step: "upload" })}>
                Continue
              </Button>
            </Stack>
          </Box>
        )}

        {/* Step 2: Upload */}
        {(state.step === "upload" || state.step === "extracting") && (
          <Box sx={{ maxWidth: 480 }}>
            {selectedPlan && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Amending: <strong>{selectedPlan.name}</strong> ({selectedPlan.code})
              </Alert>
            )}
            <ContractUpload
              onFileSelected={handleFileSelected}
              isExtracting={state.step === "extracting"}
              extractionProgress={extractionProgress}
              error={extractionError}
              selectedFile={selectedFile}
            />
          </Box>
        )}

        {/* Step 3: Diff */}
        {state.step === "diff" && (
          <Stack direction="row" spacing={3} alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {selectedPlan && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Comparing amendment against: <strong>{selectedPlan.name}</strong> ({selectedPlan.code})
                </Alert>
              )}
              <DiffViewer diffs={state.diffs} onToggle={handleToggleDiff} />

              <Card
                elevation={0}
                sx={{
                  mt: 2,
                  position: "sticky",
                  bottom: 16,
                  boxShadow: "6px 6px 20px rgba(26, 56, 101, 0.1)",
                }}
              >
                <CardContent sx={{ py: 2, px: 3, "&:last-child": { pb: 2 } }}>
                  <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                    <Button variant="outlined" onClick={() => navigate("/")} disabled={isSubmitting}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleConfirmAmendment}
                      disabled={isSubmitting || state.diffs.filter((d) => d.accepted).length === 0}
                      sx={{ minWidth: 160 }}
                    >
                      {isSubmitting
                        ? "Updating..."
                        : `Confirm & Update (${state.diffs.filter((d) => d.accepted).length} changes)`}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            {state.pdfUrl && (
              <Box
                sx={{
                  width: 360,
                  flexShrink: 0,
                  position: "sticky",
                  top: 72,
                  height: "calc(100vh - 88px)",
                  display: { xs: "none", lg: "block" },
                }}
              >
                <Card elevation={0} sx={{ height: "100%", overflow: "hidden" }}>
                  <Box sx={{ p: 1.5, borderBottom: `1px solid ${colors.neutral[200]}` }}>
                    <Typography variant="subtitle2">Amendment PDF</Typography>
                  </Box>
                  <Box
                    component="object"
                    data={state.pdfUrl}
                    type="application/pdf"
                    sx={{ width: "100%", height: "calc(100% - 44px)" }}
                  />
                </Card>
              </Box>
            )}
          </Stack>
        )}

      </Box>
    </Box>
  );
}
