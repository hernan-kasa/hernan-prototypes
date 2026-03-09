import { useState } from "react";
import { Switch } from "@mui/material";
import api from "../../api/client";

interface Props {
  id: string;
  isActive: boolean;
  onToggle: () => void;
}

export default function StatusToggle({ id, isActive, onToggle }: Props) {
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      await api.patch(`/promo-codes/${id}/status`, { is_active: !isActive });
      onToggle();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={isActive}
      onChange={toggle}
      disabled={loading}
      size="small"
      color="success"
    />
  );
}
