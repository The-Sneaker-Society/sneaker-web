import React, { useState } from "react";
import { Box, Typography, Paper, Button, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useMutation } from "@apollo/client";
import { CONFIRM_RECEIPT } from "../context/graphql/escrowMutations";
import { GET_CONTRACT_BY_ORDER_REF } from "../context/graphql/getContractDetails";
import { FlagContractModal } from "./FlagIssue";

function parseDate(v) {
  if (v == null || v === "") return null;
  const d = new Date(Number(v) || v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => new Date());
  React.useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

function formatCountdown(ms) {
  if (ms <= 0) return "Available now";
  const totalMin = Math.floor(ms / 60000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${mins}m remaining`;
  return `${mins}m remaining`;
}

/**
 * Client DELIVERED_TO_USER view: 72h countdown from payoutEligibleAt with only
 * two primary actions — "Accept work" (confirmReceipt) and "Report a problem" (flag).
 */
export default function DeliveredReviewActions({ contract }) {
  const [flagOpen, setFlagOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const now = useNow();
  const [confirm, { loading }] = useMutation(CONFIRM_RECEIPT, {
    refetchQueries: contract?.orderRef
      ? [{ query: GET_CONTRACT_BY_ORDER_REF, variables: { orderRef: contract.orderRef } }]
      : [],
  });

  if (!contract || contract.status !== "DELIVERED_TO_USER") return null;

  const eligibleAt = parseDate(contract.payoutEligibleAt);
  const remaining = eligibleAt ? eligibleAt.getTime() - now.getTime() : null;

  const handleAccept = async () => {
    setErrorMsg(null);
    try {
      await confirm({ variables: { contractId: contract.id } });
      setConfirmOpen(false);
    } catch (err) {
      setErrorMsg(err.message || "Could not accept work.");
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: "#14B8A6" }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Your shoes are back — how did {contract?.member?.firstName || "your restorer"} do?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {eligibleAt ? (
          remaining <= 0 ? (
            <>Completing shortly — thanks for your patience.</>
          ) : (
            <>This order completes automatically in {formatCountdown(remaining)}.</>
          )
        ) : (
          <>This order completes automatically after review.</>
        )}
      </Typography>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={() => setConfirmOpen(true)}
          sx={{
            bgcolor: "#FFD100",
            color: "#000",
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1rem",
            py: 1.25,
            borderRadius: "4px",
            "&:hover": { bgcolor: "#E6BC00" },
          }}
        >
          {loading ? <CircularProgress size={22} sx={{ color: "#000" }} /> : "Accept work"}
        </Button>
        <Button variant="outlined" color="warning" fullWidth onClick={() => setFlagOpen(true)} sx={{ textTransform: "none", fontWeight: 700 }}>
          Report a problem
        </Button>
      </Box>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Accept the work?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            By accepting, you confirm you&apos;re satisfied with the work you received.
            We&apos;ll take it from here and proceed with next steps with your restorer as required.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" fullWidth sx={{ textTransform: "none", fontWeight: 600 }}>
            Keep reviewing
          </Button>
          <Button
            onClick={handleAccept}
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: "#000" }} /> : "Confirm acceptance"}
          </Button>
        </DialogActions>
      </Dialog>
      <FlagContractModal open={flagOpen} onClose={() => setFlagOpen(false)} contract={contract} />
    </Paper>
  );
}
