import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Divider, CircularProgress } from "@mui/material";
import { FiPercent, FiInfo } from "react-icons/fi";
import { useColors } from "../../theme/colors";

const STRIPE_PERCENT_FEE = 0.029;
const STRIPE_FLAT_FEE = 0.30;
const PLATFORM_FEE = 12;

const PricePreviewModal = ({ open, price, onConfirm, onClose, isProposing }) => {
  const colors = useColors();
  if (!price) return null;
  const gross = price;
  const stripeFee = gross ? Math.round((gross * STRIPE_PERCENT_FEE + STRIPE_FLAT_FEE) * 100) / 100 : 0;
  const netPayout = gross ? gross - stripeFee - PLATFORM_FEE : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 0, fontWeight: 700, fontSize: "1.1rem" }}>
        Price Proposal Preview
      </DialogTitle>

      <DialogContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", color: colors.textSecondary }}>Proposed price</Typography>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: colors.textPrimary }}>${gross.toFixed(2)}</Typography>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <FiPercent size={13} color={colors.textSecondary} />
              <Typography sx={{ fontSize: "0.875rem", color: colors.textSecondary }}>Stripe processing fee (est.)</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.875rem", color: colors.status.error, fontWeight: 500 }}>
              -${stripeFee.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", color: colors.textSecondary }}>Platform fee</Typography>
            <Typography sx={{ fontSize: "0.875rem", color: colors.status.error, fontWeight: 500 }}>
              -${PLATFORM_FEE.toFixed(2)}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: colors.textPrimary }}>Your estimated payout</Typography>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: colors.status.completed }}>
              ${netPayout.toFixed(2)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mt: 0.5, px: 0.5 }}>
            <FiInfo size={13} color={colors.textSecondary} style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: "0.7rem", color: colors.textSecondary }}>
              Stripe fee is estimated at 2.9% + $0.30. Actual fee may vary based on card type and region. You will receive the exact payout after the contract is completed and funds are released.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isProposing}
          fullWidth
          sx={{
            bgcolor: "#FFD100",
            color: "#000",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": { bgcolor: "#E6BC00" },
            "&:disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
          }}
        >
          {isProposing ? <CircularProgress size={18} sx={{ color: "#000" }} /> : "Confirm & Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PricePreviewModal;
