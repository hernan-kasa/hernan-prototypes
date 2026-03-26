import { useForm, useFieldArray, Controller, type UseFormReturn } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
  Divider,
  Alert,
  Chip,
  IconButton,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ConfidenceBadge from "./ConfidenceBadge";
import RoomTypeMapperRow from "./RoomTypeMapperRow";
import { colors } from "../theme";
import type {
  RatePlanForm,
  ContractExtraction,
  Property,
  CancellationPolicy,
  BookingBehaviorProfile,
  Confidence,
} from "../types";

interface ReviewFormProps {
  defaultValues: RatePlanForm;
  extraction: ContractExtraction;
  property: Property;
  cancellationPolicies: CancellationPolicy[];
  bookingBehaviorProfiles: BookingBehaviorProfile[];
  warnings: string[];
  onSubmit: (data: RatePlanForm) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  pdfUrl: string | null;
  submitLabel?: string;
}

export default function ReviewForm({
  defaultValues,
  extraction,
  property,
  cancellationPolicies,
  bookingBehaviorProfiles,
  warnings,
  onSubmit,
  onCancel,
  isSubmitting,
  pdfUrl,
  submitLabel = "Confirm & Create",
}: ReviewFormProps) {
  const form = useForm<RatePlanForm>({ defaultValues });
  const { control, handleSubmit, formState: { errors }, watch } = form;

  const { fields: roomTypeGroupFields, append: addRoomTypeGroup, remove: removeRoomTypeGroup } =
    useFieldArray({ control, name: "roomTypeGroups" });

  const { fields: blockedDateFields, append: addBlockedDate, remove: removeBlockedDate } =
    useFieldArray({ control, name: "blockedDateRanges" });

  const conf = (field: string): Confidence => extraction.confidence[field] ?? "medium";

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}
    >
      {/* Main form — max 564px per Kontrol wizard pattern */}
      <Box sx={{ flex: 1, minWidth: 0, maxWidth: 640 }}>
        {warnings.map((w, i) => (
          <Alert key={i} severity="warning" sx={{ mb: 2 }}>
            {w}
          </Alert>
        ))}

        {/* Detection banner */}
        <Alert severity="info" sx={{ mb: 3 }} icon={false}>
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            <Typography variant="subtitle2">Detected:</Typography>
            <Chip
              label={extraction.contract_type === "corporate" ? "Corporate Rate Agreement" : "Group Agreement"}
              size="small"
              sx={{ bgcolor: colors.blue[100], color: colors.blue[600], fontWeight: 700, fontSize: "0.625rem", height: 20 }}
            />
            <Chip
              label={
                extraction.rate_type === "fixed_seasonal"
                  ? "Fixed Seasonal Rates"
                  : extraction.rate_type === "bar_discount"
                  ? "% Off BAR"
                  : "Group Block Rates"
              }
              size="small"
              sx={{ bgcolor: colors.neutral[200], color: colors.neutral[800], fontWeight: 700, fontSize: "0.625rem", height: 20 }}
            />
            <Chip
              label={extraction.client_name}
              size="small"
              sx={{ bgcolor: colors.neutral[200], color: colors.neutral[800], fontWeight: 700, fontSize: "0.625rem", height: 20 }}
            />
          </Stack>
        </Alert>

        {/* --- Section 1: General Information --- */}
        <SectionCard title="General Information" step={1}>
          <Stack spacing={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <LabeledField label="Rate Plan Name" confidence={conf("client_name")}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required", maxLength: 50 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message as string}
                    />
                  )}
                />
              </LabeledField>

              <LabeledField label="Plan Type" confidence="high">
                <Controller
                  name="planType"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth disabled />
                  )}
                />
              </LabeledField>

              <LabeledField label="Rate Code" confidence="low" required>
                <Controller
                  name="code"
                  control={control}
                  rules={{ required: "Rate code is required", maxLength: 25 }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="e.g. CORP-ACME26"
                      error={!!errors.code}
                      helperText={errors.code?.message as string ?? "Not in contract — enter manually"}
                    />
                  )}
                />
              </LabeledField>

              <LabeledField label="Reporting Rate Code" confidence="low" required>
                <Controller
                  name="rateCode"
                  control={control}
                  rules={{ required: "Reporting rate code is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder="e.g. ACME26"
                      error={!!errors.rateCode}
                      helperText={errors.rateCode?.message as string ?? "Not in contract — enter manually"}
                    />
                  )}
                />
              </LabeledField>
            </Box>

            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={2}
                  label="Description"
                  error={!!errors.description}
                  helperText={errors.description?.message as string}
                />
              )}
            />

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <LabeledField label="Cancellation Policy" confidence={conf("cancellation")}>
                <Controller
                  name="cancellationPolicyId"
                  control={control}
                  rules={{ required: "Cancellation policy is required" }}
                  render={({ field }) => (
                    <FormControl fullWidth size="small" error={!!errors.cancellationPolicyId}>
                      <Select {...field} displayEmpty>
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        {cancellationPolicies.map((cp) => (
                          <MenuItem key={cp.id} value={cp.id}>{cp.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </LabeledField>

              <LabeledField label="Booking Behavior" confidence={conf("deposit_schedule")}>
                <Controller
                  name="bookingBehaviorProfileId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <Select {...field} displayEmpty>
                        <MenuItem value=""><em>Select...</em></MenuItem>
                        {bookingBehaviorProfiles.map((bp) => (
                          <MenuItem key={bp.id} value={bp.id}>{bp.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </LabeledField>
            </Box>

            {/* Event Code */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Event Code</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                <Controller
                  name="eventCode.code"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Event Code" placeholder="e.g. ACME-2026" fullWidth />
                  )}
                />
                <LabeledField label="Account Name" confidence={conf("client_name")}>
                  <Controller
                    name="eventCode.accountName"
                    control={control}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                </LabeledField>
                <LabeledField label="Sales Manager" confidence={conf("property_contact")}>
                  <Controller
                    name="eventCode.salesManager"
                    control={control}
                    render={({ field }) => <TextField {...field} fullWidth />}
                  />
                </LabeledField>
              </Box>
            </Box>

            {/* Market Segmentation */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Market Segmentation</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
                <Controller
                  name="marketSegmentation.category"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Category" fullWidth />}
                />
                <Controller
                  name="marketSegmentation.segment"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Segment" fullWidth />}
                />
                <Controller
                  name="marketSegmentation.subSegment"
                  control={control}
                  render={({ field }) => <TextField {...field} label="Sub-Segment" fullWidth />}
                />
              </Box>
            </Box>

            {/* Extracted concessions */}
            {extraction.concessions.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Extracted Concessions</Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                  {extraction.concessions.map((c, i) => (
                    <Chip
                      key={i}
                      label={c.description}
                      size="small"
                      sx={{
                        bgcolor: c.maps_to_waiver ? colors.green[100] : colors.neutral[200],
                        color: c.maps_to_waiver ? colors.green[500] : colors.neutral[800],
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {extraction.cancellation.type === "tiered_scale" && extraction.cancellation.tiers && (
              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>Contract Cancellation Tiers (reference)</Typography>
                {extraction.cancellation.tiers.map((t, i) => (
                  <Typography key={i} variant="body2">
                    {t.days_range}: {(t.pct_of_revenue * 100).toFixed(0)}% of anticipated revenue
                  </Typography>
                ))}
              </Alert>
            )}

            {extraction.deposit_schedule && extraction.deposit_schedule.length > 0 && (
              <Alert severity="info">
                <Typography variant="subtitle2" gutterBottom>Contract Deposit Schedule (reference)</Typography>
                {extraction.deposit_schedule.map((d, i) => (
                  <Typography key={i} variant="body2">
                    {d.type}: {d.amount_or_pct} — {d.due_date_description}
                  </Typography>
                ))}
              </Alert>
            )}
          </Stack>
        </SectionCard>

        {/* --- Section 2: Price Modifiers --- */}
        <SectionCard title="Price Modifiers" step={2}>
          <Stack spacing={2}>
            {watch("appliesToAllCurrentAndFutureRoomTypes") && (
              <Alert severity="info">
                This rate plan applies to all current and future room types (% off BAR).
              </Alert>
            )}

            {roomTypeGroupFields.map((field, groupIndex) => (
              <Accordion key={field.id} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">
                      Room Type Group {groupIndex + 1}
                    </Typography>
                    {roomTypeGroupFields.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); removeRoomTypeGroup(groupIndex); }}
                      >
                        <DeleteIcon fontSize="small" sx={{ color: colors.red[400] }} />
                      </IconButton>
                    )}
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <RoomTypeGroupEditor
                    form={form}
                    groupIndex={groupIndex}
                    property={property}
                    extraction={extraction}
                  />
                </AccordionDetails>
              </Accordion>
            ))}

            <Button
              startIcon={<AddIcon />}
              variant="text"
              onClick={() =>
                addRoomTypeGroup({
                  roomTypes: [],
                  roomTypeMappings: [],
                  rateModifierLevel: "universal",
                  rateModifier: { type: "none" },
                  waiveEarlyCheckIn: false,
                  waiveLateCheckOut: false,
                  waiveParkingFee: false,
                  waiveCleaningFee: false,
                  waiveResortFee: false,
                  taxExempt: false,
                  compedAddOns: [],
                })
              }
              sx={{ alignSelf: "flex-start" }}
            >
              Add Room Type Group
            </Button>
          </Stack>
        </SectionCard>

        {/* --- Section 3: Availability & Restrictions --- */}
        <SectionCard title="Availability & Restrictions" step={3}>
          <Stack spacing={2}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <LabeledField label="Effective Start" confidence={conf("valid_dates")}>
                <Controller
                  name="effectiveDateRange.start"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="date" fullWidth InputLabelProps={{ shrink: true }} />
                  )}
                />
              </LabeledField>
              <LabeledField label="Effective End" confidence={conf("valid_dates")}>
                <Controller
                  name="effectiveDateRange.end"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="date" fullWidth InputLabelProps={{ shrink: true }} />
                  )}
                />
              </LabeledField>
              <LabeledField label="Applicable Start" confidence={conf("valid_dates")}>
                <Controller
                  name="applicableDateRange.start"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="date" fullWidth InputLabelProps={{ shrink: true }} />
                  )}
                />
              </LabeledField>
              <LabeledField label="Applicable End" confidence={conf("valid_dates")}>
                <Controller
                  name="applicableDateRange.end"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="date" fullWidth InputLabelProps={{ shrink: true }} />
                  )}
                />
              </LabeledField>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
              <Controller
                name="minimumNights"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TextField
                    {...rest}
                    type="number"
                    label="Min Nights"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="maximumNights"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TextField
                    {...rest}
                    type="number"
                    label="Max Nights"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="minimumLeadTimeHours"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TextField
                    {...rest}
                    type="number"
                    label="Min Lead (hrs)"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="maximumLeadTimeHours"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TextField
                    {...rest}
                    type="number"
                    label="Max Lead (hrs)"
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                    fullWidth
                  />
                )}
              />
            </Box>

            {/* Blackout dates */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2">Blocked Date Ranges</Typography>
                {extraction.blackout_dates.length > 0 && <ConfidenceBadge level={conf("blackout_dates")} />}
              </Stack>
              <Stack spacing={1}>
                {blockedDateFields.map((field, index) => (
                  <Stack key={field.id} direction="row" spacing={1} alignItems="center">
                    <Controller
                      name={`blockedDateRanges.${index}.label`}
                      control={control}
                      render={({ field: f }) => (
                        <TextField {...f} label="Event" size="small" sx={{ flex: 1 }} />
                      )}
                    />
                    <Controller
                      name={`blockedDateRanges.${index}.start`}
                      control={control}
                      render={({ field: f }) => (
                        <TextField {...f} type="date" label="Start" size="small" InputLabelProps={{ shrink: true }} />
                      )}
                    />
                    <Controller
                      name={`blockedDateRanges.${index}.end`}
                      control={control}
                      render={({ field: f }) => (
                        <TextField {...f} type="date" label="End" size="small" InputLabelProps={{ shrink: true }} />
                      )}
                    />
                    <IconButton size="small" onClick={() => removeBlockedDate(index)}>
                      <DeleteIcon fontSize="small" sx={{ color: colors.red[400] }} />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  variant="text"
                  onClick={() => addBlockedDate({ start: "", end: "", label: "" })}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Add Blocked Date Range
                </Button>
              </Stack>
            </Box>
          </Stack>
        </SectionCard>

        {/* Action bar */}
        <Card
          elevation={0}
          sx={{
            position: "sticky",
            bottom: 16,
            zIndex: 10,
            boxShadow: "6px 6px 20px rgba(26, 56, 101, 0.1)",
          }}
        >
          <CardContent sx={{ py: 2, px: 3, "&:last-child": { pb: 2 } }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
              <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minWidth: 160 }}>
                {isSubmitting ? "Creating..." : submitLabel}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* PDF side panel */}
      {pdfUrl && (
        <Box
          sx={{
            width: 360,
            flexShrink: 0,
            position: "sticky",
            top: 72,
            height: "calc(100vh - 88px)",
            display: { xs: "none", lg: "block" },
            bgcolor: colors.neutral[100],
          }}
        >
          <Card elevation={0} sx={{ height: "100%", overflow: "hidden" }}>
            <Box sx={{ p: 1.5, borderBottom: `1px solid ${colors.neutral[200]}` }}>
              <Typography variant="subtitle2">Contract PDF</Typography>
            </Box>
            <Box
              component="object"
              data={pdfUrl}
              type="application/pdf"
              sx={{ width: "100%", height: "calc(100% - 44px)" }}
            >
              <Typography sx={{ p: 2 }} variant="body2" color="text.secondary">
                PDF preview not available in this browser.
              </Typography>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
}

// --- Sub-components ---

function SectionCard({ title, step, children }: { title: string; step: number; children: React.ReactNode }) {
  return (
    <Card elevation={0} sx={{ mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: colors.blue[400],
              color: colors.neutral[50],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {step}
          </Box>
          <Typography variant="h4">{title}</Typography>
        </Stack>
        <Divider sx={{ mb: 2.5 }} />
        {children}
      </CardContent>
    </Card>
  );
}

function LabeledField({
  label,
  confidence,
  children,
  required,
}: {
  label: string;
  confidence: Confidence;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Box>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontSize: "0.8125rem" }}>
          {label}
          {required && <span style={{ color: colors.red[400] }}> *</span>}
        </Typography>
        <ConfidenceBadge level={confidence} />
      </Stack>
      {children}
    </Box>
  );
}

function RoomTypeGroupEditor({
  form,
  groupIndex,
  property,
  extraction,
}: {
  form: UseFormReturn<RatePlanForm>;
  groupIndex: number;
  property: Property;
  extraction: ContractExtraction;
}) {
  const { control, watch } = form;
  const group = watch(`roomTypeGroups.${groupIndex}`);
  const conf = (f: string): Confidence => extraction.confidence[f] ?? "medium";

  return (
    <Stack spacing={2}>
      {/* Room type mapping */}
      {group.roomTypeMappings?.map((mapping, i) => (
        <RoomTypeMapperRow
          key={i}
          contractName={mapping.contractName}
          confidence={mapping.confidence}
          property={property}
          selectedId={mapping.internalId}
          onChange={(id, name) => {
            form.setValue(`roomTypeGroups.${groupIndex}.roomTypeMappings.${i}.internalId`, id);
            form.setValue(`roomTypeGroups.${groupIndex}.roomTypeMappings.${i}.internalName`, name);
            const currentTypes = [...(group.roomTypes || [])];
            if (id && !currentTypes.includes(id)) {
              currentTypes.push(id);
              form.setValue(`roomTypeGroups.${groupIndex}.roomTypes`, currentTypes);
            }
          }}
        />
      ))}

      {/* Rate modifier display */}
      <LabeledField
        label="Rate Modifier"
        confidence={conf(extraction.rate_type === "bar_discount" ? "bar_discount" : "seasonal_rates")}
      >
        {group.rateModifier.type === "set" && (
          <Box>
            {group.seasons?.length ? (
              <Stack spacing={1}>
                {group.seasons.map((season, si) => (
                  <Stack key={si} direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={`${season.dateRange.start} — ${season.dateRange.end}`}
                      size="small"
                      sx={{ bgcolor: colors.neutral[200], color: colors.neutral[800], fontWeight: 700, fontSize: "0.625rem", minWidth: 180 }}
                    />
                    <Controller
                      name={`roomTypeGroups.${groupIndex}.seasons.${si}.amountInCents`}
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <TextField
                          {...rest}
                          type="number"
                          label="Nightly Rate ($)"
                          size="small"
                          value={((value ?? 0) / 100).toFixed(2)}
                          onChange={(e) => onChange(Math.round(Number(e.target.value) * 100))}
                          sx={{ width: 140 }}
                        />
                      )}
                    />
                  </Stack>
                ))}
              </Stack>
            ) : (
              <Controller
                name={`roomTypeGroups.${groupIndex}.rateModifier.amountInCents`}
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <TextField
                    {...rest}
                    type="number"
                    label="Set Rate ($)"
                    value={((value as number) / 100).toFixed(2)}
                    onChange={(e) => onChange(Math.round(Number(e.target.value) * 100))}
                    fullWidth
                  />
                )}
              />
            )}
          </Box>
        )}
        {group.rateModifier.type === "percentage" && (
          <Controller
            name={`roomTypeGroups.${groupIndex}.rateModifier.percentageAmount`}
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <TextField
                {...rest}
                type="number"
                label="Discount %"
                value={((value as number) * 100).toFixed(1)}
                onChange={(e) => onChange(Number(e.target.value) / 100)}
                fullWidth
                helperText="Percentage off BAR"
              />
            )}
          />
        )}
        {group.rateModifier.type === "none" && (
          <Typography variant="body2" sx={{ color: colors.neutral[600] }}>No rate modifier applied</Typography>
        )}
      </LabeledField>

      {/* Waivers */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Comped / Waivers</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
          {(["waiveEarlyCheckIn", "waiveLateCheckOut", "waiveParkingFee", "waiveCleaningFee", "waiveResortFee", "taxExempt"] as const).map(
            (flag) => (
              <Controller
                key={flag}
                name={`roomTypeGroups.${groupIndex}.${flag}`}
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <FormControlLabel
                    control={<Switch {...rest} checked={!!value} onChange={(e) => onChange(e.target.checked)} size="small" />}
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
                        {flag.replace("waive", "Waive ").replace("taxExempt", "Tax Exempt").replace(/([A-Z])/g, " $1").trim()}
                      </Typography>
                    }
                  />
                )}
              />
            )
          )}
        </Box>
      </Box>
    </Stack>
  );
}
