import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import PromoCodeForm from "./pages/admin/PromoCodeForm";
import PromoCodeList from "./pages/admin/PromoCodeList";
import RatePlanPolicy from "./pages/admin/RatePlanPolicy";
import CheckoutPage from "./pages/checkout/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<PromoCodeList />} />
          <Route path="create" element={<PromoCodeForm />} />
          <Route path="edit/:id" element={<PromoCodeForm />} />
          <Route path="rate-plans" element={<RatePlanPolicy />} />
        </Route>

        {/* Checkout demo */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
