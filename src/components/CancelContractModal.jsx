import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import {
  GET_CONTRACT_BY_ORDER_REF,
  GET_CONTRACT_BY_ID,
} from "../context/graphql/getContractDetails";

export const CANCEL_CONTRACT = gql`
  mutation CancelContract($contractId: ID!, $reason: String) {
    cancelContract(contractId: $contractId, reason: $reason)
  }
`;

const money = (n) =>
  `$${(Number(n) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function CancelContractModal({
  open,
  onClose,
  contract,
  userRole = "client",
  onSuccess,
}) {
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const [cancelContract, { loading }] = useMutation(CANCEL_CONTRACT, {
    refetchQueries: [
      contract?.orderRef
        ? {
            query: GET_CONTRACT_BY_ORDER_REF,
            variables: { orderRef: contract.orderRef },
          }
        : null,
      contract?.id
        ? { query: GET_CONTRACT_BY_ID, variables: { id: contract.id } }
        : null,
    ].filter(Boolean),
  });

  if (!contract) return null;

  const isPostPayment = contract.status === "READY_TO_SHIP";
  const isMemberPostPayment = userRole === "member" && isPostPayment;
  const hasLabels = Boolean(
    contract.inboundShipmentId ||
    contract.inboundTransactionId ||
    contract.outboundShipmentId ||
    contract.outboundTransactionId
  );
  const labelCost = hasLabels
    ? (contract.shippingFee || 0) + (contract.insuranceFee || 0)
    : 0;
  const servicePrice = contract.price ?? contract.proposedPrice ?? 0;
  const taxFee = contract.taxFee || 0;
  const totalPaid =
    servicePrice +
    (contract.shippingFee || 0) +
    (contract.insuranceFee || 0) +
    taxFee;
  // Estimated card processing fee (~2.9% + 30¢)
  const estimatedStripeFee = totalPaid > 0 ? totalPaid * 0.029 + 0.3 : 0;
  const refundEstimate = Math.max(0, totalPaid - labelCost - estimatedStripeFee);

  const handleConfirm = async () => {
    setErrorMsg(null);
    try {
      await cancelContract({
        variables: {
          contractId: contract.id,
          reason: reason.trim() || undefined,
        },
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to cancel contract.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        {isMemberPostPayment
          ? "Cancellation Unavailable"
          : isPostPayment
          ? "Cancel Contract & Refund"
          : "Cancel Contract Request"}
      </DialogTitle>

      <DialogContent>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {isMemberPostPayment ? (
          <Box sx={{ mb: 1 }}>
            <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
              Contracts cannot be canceled by members once payment has been received and shipping labels are generated.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              If you are unable to fulfill this contract or need assistance, please contact Sneaker Society support.
            </Typography>
          </Box>
        ) : isPostPayment ? (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Since payment has already completed, non-recoverable carrier label
              and payment processing fees are deducted.
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(128, 128, 128, 0.04)" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Total Paid:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {money(totalPaid)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Service + Tax:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="success.main"
                >
                  {money(servicePrice + taxFee)} (refundable)
                </Typography>
              </Box>
              {hasLabels && labelCost > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Labels & Insurance:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    -{money(labelCost)} (non-refundable)
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Card Processing Fee:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color="text.secondary"
                >
                  -{money(estimatedStripeFee)} (non-refundable)
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  Estimated Refund:
                </Typography>
                <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                  {money(refundEstimate)}
                </Typography>
              </Box>
            </Paper>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1.5 }}
            >
              Refunds are returned to your original payment method within 5–10
              business days.
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Are you sure you want to cancel this request? No payment has been
            made, and this will close the contract negotiation.
          </Typography>
        )}

        {!isMemberPostPayment && (
          <TextField
            label="Reason for cancellation (optional)"
            placeholder="e.g., Changed mind, no longer needed..."
            fullWidth
            multiline
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            size="small"
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        {isMemberPostPayment ? (
          <>
            <Button
              onClick={onClose}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              href={`mailto:support@thesneakerssociety.com?subject=Contract%20Cancellation%20Request%20${contract.orderRef || contract.id}`}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
              }}
            >
              Contact Support
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onClose}
              disabled={loading}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Keep Contract
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              variant="contained"
              color="error"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                px: 2.5,
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Confirm Cancellation"
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
