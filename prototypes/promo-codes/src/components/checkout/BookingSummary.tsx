import { Box, Divider, Typography } from "@mui/material";
import type { ValidateResponse } from "../../types";

/** Must match the constant in CheckoutPage */
const KASA_DISCOUNT_PCT = 10;

interface Props {
  nights: number;
  baseNightlyRate: number; // OTA parity rate — before kasa.com discount
  kasaDiscount: boolean; // Whether kasa.com 10% off is active
  appliedPromo: ValidateResponse | null;
  promoCode: string;
}

export default function BookingSummary({
  nights,
  baseNightlyRate,
  kasaDiscount,
  appliedPromo,
  promoCode,
}: Props) {
  // 1. Gross subtotal (base rate x nights, before any discounts)
  const grossSubtotal = nights * baseNightlyRate;

  // 2. kasa.com discount (applied per-night then multiplied, so card prices match)
  const effectivePerNight = kasaDiscount
    ? Math.round(baseNightlyRate * (1 - KASA_DISCOUNT_PCT / 100))
    : baseNightlyRate;
  const kasaAmount = kasaDiscount
    ? grossSubtotal - effectivePerNight * nights
    : 0;
  const afterKasa = grossSubtotal - kasaAmount;

  // 3. Promo code discount (applied to post-kasa amount)
  // Use calculated_discount from server when available, otherwise compute locally
  let promoDiscount = 0;
  let promoLabel = "";
  if (appliedPromo?.valid) {
    if (appliedPromo.calculated_discount != null) {
      promoDiscount = appliedPromo.calculated_discount;
    } else if (appliedPromo.discount_type === "percentage") {
      promoDiscount = afterKasa * (appliedPromo.discount_value! / 100);
    } else {
      promoDiscount = Math.min(appliedPromo.discount_value!, afterKasa);
    }

    promoLabel =
      appliedPromo.discount_type === "percentage"
        ? `${appliedPromo.discount_value}% off`
        : `$${appliedPromo.discount_value?.toFixed(2)} off`;
  }

  const afterAllDiscounts = afterKasa - promoDiscount;
  const totalDiscount = kasaAmount + promoDiscount;

  // 4. Fees & taxes
  const cleaningFee = 75;
  const taxRate = 0.12;
  const taxableAmount = afterAllDiscounts + cleaningFee;
  const taxes = taxableAmount * taxRate;
  const total = taxableAmount + taxes;

  // 5. Original total (no discounts at all)
  const originalTotal = (grossSubtotal + cleaningFee) * (1 + taxRate);

  // 6. Savings label
  let savingsLabel = "";
  if (kasaAmount > 0 && promoDiscount > 0) {
    savingsLabel = `kasa.com + ${promoCode.toUpperCase()}`;
  } else if (kasaAmount > 0) {
    savingsLabel = "kasa.com discount";
  } else if (promoDiscount > 0) {
    savingsLabel = promoCode.toUpperCase();
  }

  return (
    <Box>
      {/* Nightly rate x nights */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          ${baseNightlyRate.toFixed(0)} &times; {nights} night
          {nights > 1 ? "s" : ""}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${grossSubtotal.toFixed(2)}
        </Typography>
      </Box>

      {/* kasa.com discount */}
      {kasaAmount > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="body2"
            color="success.main"
            fontWeight={500}
            sx={{ fontSize: "0.8rem" }}
          >
            kasa.com discount ({KASA_DISCOUNT_PCT}% off)
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight={500}>
            &minus;${kasaAmount.toFixed(2)}
          </Typography>
        </Box>
      )}

      {/* Promo code discount */}
      {promoDiscount > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography
            variant="body2"
            color="success.main"
            fontWeight={500}
            sx={{ fontSize: "0.8rem" }}
          >
            Promo: {promoCode.toUpperCase()} ({promoLabel})
          </Typography>
          <Typography variant="body2" color="success.main" fontWeight={500}>
            &minus;${promoDiscount.toFixed(2)}
          </Typography>
        </Box>
      )}

      {/* Cleaning fee */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Cleaning fee
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${cleaningFee.toFixed(2)}
        </Typography>
      </Box>

      {/* Taxes & fees */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          Taxes &amp; fees
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ${taxes.toFixed(2)}
        </Typography>
      </Box>

      <Divider />

      {/* Total */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Total
        </Typography>
        <Box sx={{ textAlign: "right" }}>
          {totalDiscount > 0 && (
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ textDecoration: "line-through", fontSize: "0.75rem" }}
            >
              ${originalTotal.toFixed(2)}
            </Typography>
          )}
          <Typography variant="subtitle1" fontWeight={700}>
            ${total.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      {/* Savings badge */}
      {totalDiscount > 0 && (
        <Box
          sx={{
            mt: 2,
            py: 0.75,
            px: 1.5,
            textAlign: "center",
            bgcolor: "rgba(46, 125, 50, 0.08)",
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            color="success.main"
            fontWeight={600}
            sx={{ fontSize: "0.8rem" }}
          >
            You save ${(totalDiscount + totalDiscount * taxRate).toFixed(2)}{" "}
            with {savingsLabel}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
