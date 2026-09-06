import React, { useState } from "react";
import { Box, Typography, Button, Card, CardMedia, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPLOAD_PACKAGING_PHOTOS, UPLOAD_RETURN_PACKAGING_PHOTOS } from "../context/graphql/escrowMutations";
import { GET_CONTRACT_BY_ORDER_REF } from "../context/graphql/getContractDetails";
import { useImageUploader } from "../hooks/useImageUploader";

const SOFT_MAX = 3;
const STEPS = ["Print your label", "Snap your box", "Drop it off"];

const MODES = {
  outbound: {
    gateStatus: "READY_TO_SHIP",
    mutation: UPLOAD_PACKAGING_PHOTOS,
    photosKey: "packagingPhotos",
    title: "Get your box shipped",
  },
  // Member return leg: same stepped flow (print return label → photo nudge
  // → ship), mirrored copy. Step text below branches on mode where needed.
  return: {
    gateStatus: "READY_FOR_RETURN",
    mutation: UPLOAD_RETURN_PACKAGING_PHOTOS,
    photosKey: "returnPackagingPhotos",
    title: "Get the return shipped",
  },
};

/**
 * Guided label flow. Launched from the Print button:
 * 1) print the Shippo label first (photos of the labeled box are the evidence),
 * 2) optional packaging-photo nudge (skippable, never blocking),
 * 3) drop-off confirmation. `mode="outbound"` (client) or `"return"` (member).
 */
export default function PackagingPhotoCard({ contract, open, onClose, mode = "outbound" }) {
  const cfg = MODES[mode] ?? MODES.outbound;
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const { upload, loading: uploading } = useImageUploader();
  const [savePhotos, { loading: saving }] = useMutation(cfg.mutation, {
    refetchQueries: contract?.orderRef
      ? [{ query: GET_CONTRACT_BY_ORDER_REF, variables: { orderRef: contract.orderRef } }]
      : [],
  });

  if (!contract || contract.status !== cfg.gateStatus) return null;

  const existing = contract[cfg.photosKey] ?? [];
  const busy = uploading || saving;

  const close = () => {
    setStep(0);
    setErrorMsg(null);
    onClose?.();
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? []).slice(0, Math.max(0, SOFT_MAX - existing.length));
    e.target.value = "";
    if (files.length === 0) return;
    setErrorMsg(null);
    try {
      const confirmed = [];
      for (const file of files) {
        const c = await upload(file);
        if (c?.url) confirmed.push(c.url);
        else if (c?.key) confirmed.push(c.key);
      }
      if (confirmed.length > 0) {
        await savePhotos({ variables: { contractId: contract.id, keys: confirmed } });
      }
    } catch (err) {
      setErrorMsg(err.message || "Photo upload failed.");
    }
  };

  const labelUrl = mode === "return" ? contract.outboundLabelUrl : contract.inboundLabelUrl;

  return (
    <Dialog open={!!open} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{cfg.title}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 2.5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Print your {mode === "return" ? "return" : "inbound"} shipping label and stick it on the outside of the box.
              Photos of the <strong>labeled</strong> box are the ones that count as evidence.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              disabled={!labelUrl}
              onClick={() => labelUrl && window.open(labelUrl, "_blank", "noopener")}
              sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}
            >
              Open printable label
            </Button>
          </Box>
        )}

        {step === 1 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
              While you&apos;re sealing it up — snap the box with the label visible?
              Optional, and it strengthens any damage claim.
            </Typography>
            {errorMsg && (
              <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>
                {errorMsg}
              </Alert>
            )}
            {existing.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
                {existing.map((url, idx) => (
                  <Card key={idx} sx={{ width: 120 }}>
                    <CardMedia component="img" height="90" image={url} alt={`Packaging ${idx + 1}`} sx={{ objectFit: "cover" }} />
                  </Card>
                ))}
              </Box>
            )}
            {existing.length < SOFT_MAX && (
              <Button variant="outlined" size="small" component="label" disabled={busy} sx={{ textTransform: "none", fontWeight: 700 }}>
                {busy ? <CircularProgress size={16} /> : existing.length === 0 ? "Add packaging photos" : "Add more"}
                <input type="file" accept="image/*" multiple hidden onChange={handleFiles} />
              </Button>
            )}
          </Box>
        )}

        {step === 2 && (
          <Typography variant="body1">
            You&apos;re set. Drop the box off — tracking starts when the carrier scans it,
            and you&apos;ll see updates here.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        {step === 0 && (
          <Button onClick={() => setStep(1)} variant="contained" fullWidth sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}>
            Continue
          </Button>
        )}
        {step === 1 && (
          <>
            <Button onClick={() => setStep(0)} variant="outlined" fullWidth sx={{ textTransform: "none", fontWeight: 600 }}>
              Back
            </Button>
            <Button onClick={() => setStep(2)} variant="contained" fullWidth sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}>
              {existing.length > 0 ? "Done" : "Skip for now"}
            </Button>
          </>
        )}
        {step === 2 && (
          <Button onClick={close} variant="contained" fullWidth sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#E6BC00" } }}>
            Got it
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
