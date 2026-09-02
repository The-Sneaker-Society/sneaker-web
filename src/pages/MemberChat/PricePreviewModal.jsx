import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, Divider, CircularProgress } from "@mui/material";
import { FiInfo, FiAlertCircle } from "react-icons/fi";
import { useColors } from "../../theme/colors";

const PLATFORM_FEE_RATE = 0.15;

const PricePreviewModal = ({ open, price, onConfirm, onClose, isProposing, hasPendingProposal }) => {
  const colors = useColors();
  if (!price) return null;
  const gross = price;
  const platformFee = gross ? Math.round(gross * PLATFORM_FEE_RATE * 100) / 100 : 0;
  const netPayout = gross ? gross - platformFee : 0;

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
            <Typography sx={{ fontSize: "0.875rem", color: colors.textSecondary }}>Platform fee</Typography>
            <Typography sx={{ fontSize: "0.875rem", color: colors.status.error, fontWeight: 500 }}>
              -${platformFee.toFixed(2)}
            </Typography>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: colors.textPrimary }}>Your Guaranteed Payout</Typography>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: colors.status.completed }}>
              ${netPayout.toFixed(2)}
            </Typography>
          </Box>

          {hasPendingProposal && (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mt: 1, p: 1.5, bgcolor: "rgba(239,68,68,0.1)", borderRadius: 2, border: "1px solid rgba(239,68,68,0.25)" }}>
              <FiAlertCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <Typography sx={{ fontSize: "0.75rem", color: "#EF4444", fontWeight: 600, lineHeight: 1.4 }}>
                This will expire the existing pending price proposal. The previous proposal will no longer be valid for payment.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mt: 0.5, px: 0.5 }}>
            <FiInfo size={13} color={colors.textSecondary} style={{ flexShrink: 0, marginTop: 2 }} />
            <Typography sx={{ fontSize: "0.7rem", color: colors.textSecondary }}>
              Shipping, insurance, and applicable taxes are handled separately and billed directly to the client.
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
