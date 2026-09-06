import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider, Box } from "@mui/material";

/**
 * First-visit completion modal — pops once per browser session per contract
 * (sessionStorage). Celebrates with the right name on each side.
 */
export default function CompletedModal({ contract, role }) {
  const key = contract?.orderRef ? `completed-notice-seen:${contract.orderRef}` : null;
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

  const isMember = role === "member";
  const otherName = isMember
    ? contract?.client?.firstName
    : contract?.member?.firstName;
  const [copied, setCopied] = useState(false);

  const shareText = `Just got my ${[contract?.shoeDetails?.brand, contract?.shoeDetails?.model].filter(Boolean).join(" ") || "sneakers"} restored by @thesneakerssociety 👟✨`;

  const copyTag = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Dialog open={open} onClose={dismiss} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Order complete 🎉</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {isMember ? (
            <>Congratulations — {otherName || "your client"} was satisfied with your work. Thank you for restoring with Sneaker Society.</>
          ) : (
            <>Thanks for trusting Sneaker Society{otherName ? ` and ${otherName}` : ""} with your pair. Enjoy them out there.</>
          )}
        </Typography>
        {!isMember && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
              Show off the results 📸
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Tag <strong>@thesneakerssociety</strong> in your post — we feature our favorites.
            </Typography>
            <Typography
              variant="body2"
              sx={{ p: 1.5, mb: 1.5, borderRadius: 2, bgcolor: "action.hover" }}
            >
              {shareText}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button onClick={copyTag} variant="outlined" fullWidth sx={{ textTransform: "none", fontWeight: 600 }}>
                {copied ? "Copied ✓" : "Copy caption"}
              </Button>
              <Button
                href="https://instagram.com/thesneakerssociety"
                target="_blank"
                rel="noopener"
                variant="contained"
                fullWidth
                sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}
              >
                Instagram
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={dismiss} variant="contained" fullWidth sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
