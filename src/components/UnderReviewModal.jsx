import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert } from "@mui/material";

/**
 * First-visit "under review" modal — pops once per browser session per
 * contract (sessionStorage), replacing the banner as the primary notice.
 * The banner stays as the persistent reminder. Copy differs per role.
 */
export default function UnderReviewModal({ contract, role }) {
  const key = contract?.orderRef ? `review-notice-seen:${contract.orderRef}` : null;
  const [open, setOpen] = useState(() => {
    try {
      return !!key && !sessionStorage.getItem(key);
    } catch {
      return !!key;
    }
  });

  if (!contract || !key) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // storage unavailable — modal simply shows again next visit
    }
    setOpen(false);
  };

  const dispute = (contract.timeline ?? []).find((t) => t?.event === "DISPUTE_OPENED");
  const isMember = role === "member";

  return (
    <Dialog open={open} onClose={dismiss} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>This order is under review</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          {isMember
            ? "Your payout is paused while our team takes a look."
            : "This order is under review — we'll reach out shortly."}
        </Alert>
        <Typography variant="body1" fontWeight={700} sx={{ mb: 1 }}>
          What to expect
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { mb: 0.75 } }}>
          <Typography component="li" variant="body2">
            Our team is reviewing the photos, chat history, and tracking from both sides.
          </Typography>
          <Typography component="li" variant="body2">
            {isMember
              ? "Keep the shoes safe and untouched — please don't ship anything until the review closes."
              : "There's nothing you need to do right now — we'll contact you if we have questions."}
          </Typography>
          <Typography component="li" variant="body2">
            {isMember
              ? "Once the review closes, you'll see the outcome here and anything owed to you moves automatically."
              : "Once the review closes, you'll see the outcome here with next steps."}
          </Typography>
        </Box>
        {dispute?.reason && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            Flagged reason: “{dispute.reason}”
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={dismiss} variant="contained" fullWidth sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}>
          Understood
        </Button>
      </DialogActions>
    </Dialog>
  );
}
