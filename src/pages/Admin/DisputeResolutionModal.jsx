import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import {
  RESOLVE_DISPUTE_FOR_USER,
  RESOLVE_DISPUTE_FOR_MEMBER,
  RESOLVE_DISPUTE_INCONCLUSIVE,
} from "./graphql";

const DisputeResolutionModal = ({
  open,
  onClose,
  contract,
  pnl,
  actionType, // "USER" | "MEMBER" | "INCONCLUSIVE"
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const [banActor, setBanActor] = useState(false);
  const [refundDollars, setRefundDollars] = useState("");
  const [payoutDollars, setPayoutDollars] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const [resolveUser, { loading: loadingUser }] = useMutation(RESOLVE_DISPUTE_FOR_USER);
  const [resolveMember, { loading: loadingMember }] = useMutation(RESOLVE_DISPUTE_FOR_MEMBER);
  const [resolveInconclusive, { loading: loadingInconclusive }] = useMutation(RESOLVE_DISPUTE_INCONCLUSIVE);

  const loading = loadingUser || loadingMember || loadingInconclusive;

  const totalCaptured =
    (contract?.price || 0) +
    (contract?.shippingFee || 0) +
    (contract?.insuranceFee || 0) +
    (contract?.taxFee || 0);

  const handleExecute = async () => {
    setErrorMsg(null);
    try {
      if (actionType === "USER") {
        await resolveUser({
          variables: {
            contractId: contract.id,
            banMember: banActor,
            reason: reason.trim() || "Admin ruled in favor of customer",
          },
        });
      } else if (actionType === "MEMBER") {
        await resolveMember({
          variables: {
            contractId: contract.id,
            banUser: banActor,
            reason: reason.trim() || "Admin ruled in favor of restorer",
          },
        });
      } else if (actionType === "INCONCLUSIVE") {
        const refCents = Math.round(Number(refundDollars || 0) * 100);
        const payCents = Math.round(Number(payoutDollars || 0) * 100);
        const maxCents = Math.round(totalCaptured * 100);

        if (refCents < 0 || payCents < 0) {
          setErrorMsg("Refund and payout amounts must be non-negative.");
          return;
        }
        if (refCents + payCents > maxCents) {
          setErrorMsg(
            `Total split ($${((refCents + payCents) / 100).toFixed(2)}) cannot exceed total captured ($${totalCaptured.toFixed(2)}).`
          );
          return;
        }

        await resolveInconclusive({
          variables: {
            contractId: contract.id,
            refundCents: refCents,
            payoutCents: payCents,
            banBoth: banActor,
            reason: reason.trim() || "Admin resolved dispute as inconclusive",
          },
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to execute dispute resolution.");
    }
  };

  const getTitle = () => {
    if (actionType === "USER") return "Rule for Customer (100% Refund)";
    if (actionType === "MEMBER") return "Rule for Restorer (Release Payout)";
    return "Inconclusive / Split Resolution";
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{getTitle()}</DialogTitle>
      <DialogContent dividers>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {actionType === "USER" && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              This will issue a <strong>100% refund (${totalCaptured.toFixed(2)})</strong> to the customer via Stripe,
              cancel the restorer's payout, and mark the contract as <strong>CANCELED</strong>.
            </Alert>
            <FormControlLabel
              control={
                <Checkbox
                  checked={banActor}
                  onChange={(e) => setBanActor(e.target.checked)}
                  color="error"
                />
              }
              label="Ban Restorer account (deactivate profile & prevent future contracts)"
            />
          </Box>
        )}

        {actionType === "MEMBER" && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              This will immediately transfer <strong>${(contract?.payoutAmount || 0).toFixed(2)}</strong> to the restorer's
              Stripe Connect account and mark the contract as <strong>COMPLETED</strong>.
            </Alert>
            <FormControlLabel
              control={
                <Checkbox
                  checked={banActor}
                  onChange={(e) => setBanActor(e.target.checked)}
                  color="error"
                />
              }
              label="Ban Customer account (deactivate client profile & dispute privileges)"
            />
          </Box>
        )}

        {actionType === "INCONCLUSIVE" && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Enter partial amounts to refund the customer and/or payout the restorer. Maximum combined total:{" "}
              <strong>${totalCaptured.toFixed(2)}</strong>.
            </Alert>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Customer Refund ($)"
                type="number"
                size="small"
                fullWidth
                value={refundDollars}
                onChange={(e) => setRefundDollars(e.target.value)}
                placeholder="0.00"
              />
              <TextField
                label="Restorer Payout ($)"
                type="number"
                size="small"
                fullWidth
                value={payoutDollars}
                onChange={(e) => setPayoutDollars(e.target.value)}
                placeholder="0.00"
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={banActor}
                  onChange={(e) => setBanActor(e.target.checked)}
                  color="error"
                />
              }
              label="Ban both accounts (bad-faith mutual dispute)"
            />
          </Box>
        )}

        <TextField
          label="Internal Admin Adjudication Notes / Reason"
          multiline
          rows={3}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Document the rationale (e.g. verified carrier drop-off weight mismatch, visible damage in unboxing, etc.)"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleExecute}
          variant="contained"
          disabled={loading}
          color={actionType === "USER" ? "primary" : actionType === "MEMBER" ? "success" : "warning"}
          sx={{ fontWeight: 700, px: 3 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm Adjudication"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisputeResolutionModal;
