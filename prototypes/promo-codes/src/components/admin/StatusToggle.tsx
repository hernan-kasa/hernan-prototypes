import { useState } from "react";
import { Switch } from "@mui/material";
import api from "../../api/client";

interface Props {
  id: string;
  status: "active" | "inactive";
  onToggle: () => void;
}

export default function StatusToggle({ id, status, onToggle }: Props) {
  const [loading, setLoading] = useState(false);
  const isActive = status === "active";

  const toggle = async () => {
    setLoading(true);
    try {
      await api.patch(`/promo-codes/${id}/status`, {
        status: isActive ? "inactive" : "active",
      });
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
