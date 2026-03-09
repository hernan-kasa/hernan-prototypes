import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { useProperties } from "../../hooks/usePromoCodes";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export default function PropertySelector({ selected, onChange }: Props) {
  const properties = useProperties();
  const allSelected = selected.length === 0;

  const toggleAll = () => {
    onChange([]);
  };

  const toggleProperty = (id: string) => {
    if (allSelected) {
      // switching from "all" to specific — select everything except this one
      onChange(properties.filter((p) => p.id !== id).map((p) => p.id));
    } else if (selected.includes(id)) {
      const next = selected.filter((s) => s !== id);
      // if none selected, revert to "all"
      onChange(next.length === 0 ? [] : next);
    } else {
      const next = [...selected, id];
      // if all individually selected, switch to "all" (empty array)
      onChange(next.length === properties.length ? [] : next);
    }
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox checked={allSelected} onChange={toggleAll} />
        }
        label="All Properties"
        sx={{ "& .MuiFormControlLabel-label": { fontWeight: 500 } }}
      />
      <Box sx={{ ml: 3 }}>
        {properties.map((p) => (
          <FormControlLabel
            key={p.id}
            control={
              <Checkbox
                size="small"
                checked={allSelected || selected.includes(p.id)}
                onChange={() => toggleProperty(p.id)}
              />
            }
            label={p.name}
            sx={{ display: "block" }}
          />
        ))}
      </Box>
    </Box>
  );
}
