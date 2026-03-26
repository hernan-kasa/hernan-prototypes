import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateFromContractPage from "./pages/CreateFromContractPage";
import AmendRatePlanPage from "./pages/AmendRatePlanPage";

export default function App() {
  return (
    <BrowserRouter basename="/contract-to-rate-plan">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateFromContractPage />} />
        <Route path="/amend" element={<AmendRatePlanPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
