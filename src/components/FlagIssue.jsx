import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { FLAG_CONTRACT } from "../context/graphql/escrowMutations";
import { GET_CONTRACT_BY_ORDER_REF, GET_CONTRACT_BY_ID } from "../context/graphql/getContractDetails";

// Post-payment states where either party may flag (plan-escrow-dispute §2:
// any post-payment status, READY_TO_SHIP … DELIVERED_TO_USER).
export const FLAGGABLE_STATUSES = [
  "READY_TO_SHIP",
  "INBOUND_SHIPPED",
  "ARRIVED_AT_MEMBER",
  "WORK_IN_PROGRESS",
  "READY_FOR_RETURN",
  "RETURN_SHIPPED",
  "DELIVERED_TO_USER",
];

export const isFrozen = (contract) =>
  contract?.status === "UNDER_MANUAL_REVIEW" || contract?.payoutStatus === "frozen";

/** Freeze banner copy differs by role; visibility is identical. */
export function FreezeBanner({ role = "client" }) {
  return (
    <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
      {role === "member" ? (
        <>Payout paused — order under review. No action needed.</>
      ) : (
        <>Order under review — we&apos;ll reach out shortly. No action needed.</>
      )}
    </Alert>
  );
}

export function FlagContractModal({ open, onClose, contract }) {
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [flagContract, { loading }] = useMutation(FLAG_CONTRACT, {
    refetchQueries: [
      contract?.orderRef
        ? { query: GET_CONTRACT_BY_ORDER_REF, variables: { orderRef: contract.orderRef } }
        : null,
      contract?.id ? { query: GET_CONTRACT_BY_ID, variables: { id: contract.id } } : null,
    ].filter(Boolean),
  });

  if (!contract) return null;

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setErrorMsg("Please describe the problem.");
      return;
    }
    setErrorMsg(null);
    try {
      await flagContract({ variables: { contractId: contract.id, reason: reason.trim() } });
      setReason("");
      onClose();
    } catch (err) {
      setErrorMsg(err.message || "Failed to flag contract.");
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Report an issue</DialogTitle>
      <DialogContent>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Give us a brief description below and our team will reach out if we need more info while reviewing your request.
        </Typography>
        <TextField
          label="What went wrong?"
          placeholder="e.g., Shoes arrived damaged, wrong pair returned..."
          fullWidth
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
          size="small"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} disabled={loading} sx={{ textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color="warning"
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, px: 2.5 }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Flag for review"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Quiet text-button entry point, rendered for both roles in post-payment states. */
export default function ReportIssueEntry({ contract, label = "Report an issue" }) {
  const [open, setOpen] = useState(false);
  if (!contract || isFrozen(contract) || !FLAGGABLE_STATUSES.includes(contract.status)) return null;
  return (
    <Box sx={{ mt: 1, mb: 3, textAlign: "center" }}>
      <Button
        variant="text"
        color="warning"
        size="small"
        onClick={() => setOpen(true)}
        sx={{ textTransform: "none", fontWeight: 600, fontSize: "0.85rem" }}
      >
        {label}
      </Button>
      <FlagContractModal open={open} onClose={() => setOpen(false)} contract={contract} />
    </Box>
  );
}
