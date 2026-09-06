import React from "react";
import { Box, Typography, Card, CardMedia, IconButton, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FiZoomIn, FiChevronDown } from "react-icons/fi";

/**
 * Shared evidence strip — renders the SAME timeline-ordered sections on both
 * parties' contract views with no role filtering (plan-escrow-dispute §5):
 * intake → packaging → unboxing → completion.
 */
export default function EvidenceStrip({ contract, onPreview }) {
  const intakePhotos = React.useMemo(() => {
    const groups = contract?.shoeDetails?.photos;
    if (!groups || typeof groups !== "object") return [];
    return Object.entries(groups).flatMap(([section, photos]) =>
      Array.isArray(photos)
        ? photos
            .map((p) => (typeof p === "string" ? p : p?.url))
            .filter(Boolean)
            .map((url) => ({ url, section }))
        : []
    );
  }, [contract]);

  const sections = [
    { label: "Intake (pre-ship condition)", photos: intakePhotos.map((p) => p.url) },
    { label: "Packaging (as shipped)", photos: contract?.packagingPhotos ?? [] },
    { label: "Unboxing (as arrived)", photos: contract?.unboxingPhotos ?? [] },
    { label: "Return packing (as returned)", photos: contract?.returnPackagingPhotos ?? [] },
    { label: "Finished work", photos: contract?.completionPhotos ?? [] },
  ].filter((s) => s.photos?.length > 0);

  if (sections.length === 0) return null;

  return (
    <Accordion variant="outlined" sx={{ mb: 2 }} defaultExpanded>
      <AccordionSummary expandIcon={<FiChevronDown />}>
        <Typography variant="h6" fontWeight={600}>
          Shared evidence
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {sections.map(({ label, photos }) => (
          <Box key={label} sx={{ mb: 1.5, "&:last-child": { mb: 0 } }}>
            <Typography variant="body1" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
              {label}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
              {photos.map((url, idx) => (
                <Card key={`${label}-${idx}`} sx={{ width: 160, position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={url}
                    alt={`${label} ${idx + 1}`}
                    sx={{ objectFit: "cover" }}
                  />
                  {onPreview && (
                    <IconButton
                      onClick={() => onPreview(url)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        bgcolor: "rgba(0,0,0,0.45)",
                        color: "common.white",
                      }}
                    >
                      <FiZoomIn size={14} />
                    </IconButton>
                  )}
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
