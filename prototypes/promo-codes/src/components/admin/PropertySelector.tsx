import { useState, useMemo } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useProperties } from "../../hooks/usePromoCodes";
import { Property } from "../../types";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function PropertySelector({ selected, onChange }: Props) {
  const properties = useProperties();

  // Search/filter state for the autocomplete
  const [searchOpen, setSearchOpen] = useState(false);

  // Track checked items in each column
  const [availableChecked, setAvailableChecked] = useState<string[]>([]);
  const [assignedChecked, setAssignedChecked] = useState<string[]>([]);

  const assigned = useMemo(
    () => properties.filter((p) => selected.includes(p.id)),
    [properties, selected]
  );

  const available = useMemo(
    () => properties.filter((p) => !selected.includes(p.id)),
    [properties, selected]
  );

  // Move checked items from available → assigned
  const handleAdd = () => {
    if (availableChecked.length === 0) return;
    onChange([...selected, ...availableChecked]);
    setAvailableChecked([]);
  };

  // Move checked items from assigned → available
  const handleRemove = () => {
    if (assignedChecked.length === 0) return;
    onChange(selected.filter((id) => !assignedChecked.includes(id)));
    setAssignedChecked([]);
  };

  // Select from autocomplete dropdown
  const handleAutocompleteSelect = (
    _: unknown,
    value: Property | null
  ) => {
    if (!value) return;
    if (!selected.includes(value.id)) {
      onChange([...selected, value.id]);
    }
    setSearchOpen(false);
  };

  const toggleAvailableCheck = (id: string) => {
    setAvailableChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAssignedCheck = (id: string) => {
    setAssignedChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAllAvailable = () => {
    if (availableChecked.length === available.length) {
      setAvailableChecked([]);
    } else {
      setAvailableChecked(available.map((p) => p.id));
    }
  };

  const toggleAllAssigned = () => {
    if (assignedChecked.length === assigned.length) {
      setAssignedChecked([]);
    } else {
      setAssignedChecked(assigned.map((p) => p.id));
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderRadius: "12px !important" }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">Property group #1</Typography>
        <Typography
          component="button"
          onClick={() => onChange([])}
          sx={{
            color: "primary.main",
            cursor: "pointer",
            background: "none",
            border: "none",
            fontSize: "0.875rem",
            fontWeight: 700,
            fontFamily: "inherit",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Clear
        </Typography>
      </Box>

      {/* Search autocomplete */}
      <Autocomplete
        open={searchOpen}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
        options={available}
        getOptionLabel={(option) => option.name}
        onChange={handleAutocompleteSelect}
        value={null}
        blurOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search in properties"
            size="small"
            sx={{ mb: 2 }}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            key={option.id}
            sx={{
              py: 0.75,
              px: 2,
              fontSize: "0.875rem",
              fontWeight: 700,
              borderRadius: 1,
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            {option.name}
          </Box>
        )}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "10px",
              p: 1,
              boxShadow: "6px 6px 20px rgba(26, 56, 101, 0.1)",
            },
          },
        }}
      />

      {/* Transfer list */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "stretch" }}>
        {/* Available column */}
        <TransferColumn
          title="Available"
          count={available.length}
          selectedCount={availableChecked.length}
          items={available}
          checkedIds={availableChecked}
          onToggle={toggleAvailableCheck}
          onToggleAll={toggleAllAvailable}
        />

        {/* +/- buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            onClick={handleAdd}
            disabled={availableChecked.length === 0}
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: "8px",
              width: 32,
              height: 32,
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleRemove}
            disabled={assignedChecked.length === 0}
            sx={{
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: "8px",
              width: 32,
              height: 32,
            }}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Assigned column */}
        <TransferColumn
          title="Assigned"
          count={assigned.length}
          selectedCount={assignedChecked.length}
          items={assigned}
          checkedIds={assignedChecked}
          onToggle={toggleAssignedCheck}
          onToggleAll={toggleAllAssigned}
        />
      </Box>
    </Paper>
  );
}

function TransferColumn({
  title,
  count,
  selectedCount,
  items,
  checkedIds,
  onToggle,
  onToggleAll,
}: {
  title: string;
  count: number;
  selectedCount: number;
  items: Property[];
  checkedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 1,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        borderRadius: "12px !important",
      }}
    >
      {/* Column header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Checkbox
          size="small"
          checked={items.length > 0 && selectedCount === items.length}
          indeterminate={selectedCount > 0 && selectedCount < items.length}
          onChange={onToggleAll}
          disabled={items.length === 0}
          sx={{ p: 0.5, mr: 1 }}
        />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ lineHeight: 1.3 }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: "0.6875rem", color: "grey.500" }}
          >
            {selectedCount}/{count} selected
          </Typography>
        </Box>
      </Box>

      {/* Item list */}
      <Box sx={{ flex: 1, overflow: "auto", maxHeight: 220 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            onClick={() => onToggle(item.id)}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              cursor: "pointer",
              "&:hover": { backgroundColor: "grey.100" },
            }}
          >
            <Checkbox
              size="small"
              checked={checkedIds.includes(item.id)}
              sx={{ p: 0.5, mr: 1 }}
              tabIndex={-1}
            />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {item.name}
            </Typography>
          </Box>
        ))}
        {items.length === 0 && (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No properties
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
