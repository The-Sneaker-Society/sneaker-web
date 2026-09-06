import React, { useState } from "react";
import { Box, Typography, Paper, Button, Card, CardMedia, Alert, CircularProgress } from "@mui/material";
import { useMutation } from "@apollo/client";
import { START_WORK, UPLOAD_UNBOXING_PHOTOS } from "../context/graphql/escrowMutations";
import { GET_CONTRACT_BY_ORDER_REF } from "../context/graphql/getContractDetails";
import { useImageUploader } from "../hooks/useImageUploader";

export const UNBOXING_MIN_PHOTOS = 3;
export const UNBOXING_MAX_PHOTOS = 12;

const SHOT_GUIDE = [
  "1 · Sealed box as received, shipping label visible",
  "2 · Box open, contents as found",
  "3 · Shoes out, condition close-ups",
];

/**
 * Member ARRIVED_AT_MEMBER unboxing checkpoint. "Start Work" stays disabled
 * until unboxingPhotos.length >= 3.
 */
export default function UnboxingCheckpoint({ contract }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const { upload, loading: uploading } = useImageUploader();
  const refetch = contract?.orderRef
    ? [{ query: GET_CONTRACT_BY_ORDER_REF, variables: { orderRef: contract.orderRef } }]
    : [];
  const [savePhotos, { loading: saving }] = useMutation(UPLOAD_UNBOXING_PHOTOS, { refetchQueries: refetch });
  const [doStartWork, { loading: starting }] = useMutation(START_WORK, { refetchQueries: refetch });

  if (!contract || contract.status !== "ARRIVED_AT_MEMBER") return null;

  const photos = contract.unboxingPhotos ?? [];
  const unlocked = photos.length >= UNBOXING_MIN_PHOTOS;
  const busy = uploading || saving || starting;

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? []).slice(
      0,
      Math.max(0, UNBOXING_MAX_PHOTOS - photos.length)
    );
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

  const handleStart = async () => {
    setErrorMsg(null);
    try {
      await doStartWork({ variables: { contractId: contract.id } });
    } catch (err) {
      setErrorMsg(err.message || "Could not start work.");
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: "#F97316" }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        Unboxing photos required
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Photograph the package exactly as it arrived before starting work.
      </Typography>
      <Box component="ol" sx={{ m: 0, pl: 2.5, mb: 2 }}>
        {SHOT_GUIDE.map((tip) => (
          <Typography key={tip} component="li" variant="body2" color="text.secondary">
            {tip}
          </Typography>
        ))}
      </Box>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}
      {photos.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
          {photos.map((url, idx) => (
            <Card key={idx} sx={{ width: 120 }}>
              <CardMedia component="img" height="90" image={url} alt={`Unboxing ${idx + 1}`} sx={{ objectFit: "cover" }} />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", px: 1, py: 0.5 }}>
                {idx < 3 ? SHOT_GUIDE[idx].split("·")[0].trim() + ` · Photo ${idx + 1}` : `Extra · Photo ${idx + 1}`}
              </Typography>
            </Card>
          ))}
        </Box>
      )}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        {photos.length < UNBOXING_MAX_PHOTOS && (
          <Button variant="outlined" size="small" component="label" disabled={busy} sx={{ textTransform: "none", fontWeight: 700 }}>
            {busy ? <CircularProgress size={16} /> : photos.length === 0 ? "Upload unboxing photos" : "Add more"}
            <input type="file" accept="image/*" multiple hidden onChange={handleFiles} />
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          disabled={!unlocked || busy}
          onClick={handleStart}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            bgcolor: unlocked ? "#F97316" : "action.disabledBackground",
            "&:hover": { bgcolor: unlocked ? "#EA6A0A" : undefined },
          }}
        >
          {starting ? "Starting..." : "Start Work"}
        </Button>
      </Box>
      {!unlocked && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Upload 3 unboxing photos to unlock ({photos.length}/3).
        </Typography>
      )}
    </Paper>
  );
}
