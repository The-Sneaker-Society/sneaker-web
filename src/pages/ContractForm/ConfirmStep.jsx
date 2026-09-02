import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import { FiZoomIn, FiInfo } from "react-icons/fi";
import { useFormikContext } from "formik";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";

const titleCase = (str) => {
  if (!str) return str;
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

const SECTION_LABELS = {
  leftSide: "Left Side",
  rightSide: "Right Side",
  topView: "Top View",
  bottomView: "Bottom View",
  frontView: "Front View",
  backView: "Back View",
  inside: "Inside of Shoe",
  tongue: "Tongue",
  box: "Box Condition",
  other: "Other Areas",
};

const TIMEFRAME_LABELS = {
  standard: "Standard (2-3 weeks)",
  rush: "Rush (1 week)",
  "no-rush": "No rush",
};

const CAPITALIZE_FIELDS = ["brand", "model", "color", "material", "soleCondition", "odorLevel"];

const SHOE_FIELDS = [
  { label: "Brand", key: "brand" },
  { label: "Model", key: "model" },
  { label: "Color", key: "color" },
  { label: "Size (US)", key: "size" },
  { label: "Material", key: "material" },
  { label: "Sole Condition", key: "soleCondition" },
  { label: "Year", key: "year" },
  { label: "Odor Level", key: "odorLevel" },
  { label: "Return Timeframe", key: "returnTimeframe" },
];

const ConfirmationStep = ({ selectedItem, hasMenu }) => {
  const { values } = useFormikContext();
  const theme = useTheme();
  const [previewUrl, setPreviewUrl] = useState(null);

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Review Your Request
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          Please check everything before submitting
        </Typography>
      </Box>

      {hasMenu && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderColor: selectedItem ? "primary.main" : "divider", bgcolor: selectedItem ? "rgba(255,195,28,0.04)" : "background.paper" }}>
          <Typography variant="h4" fontWeight={600} mb={2}>
            Selected Service
          </Typography>
          {selectedItem ? (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                <Typography fontWeight={800} sx={{ fontSize: "1.15rem" }}>
                  {selectedItem.name}
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center" gap={0.35}>
                  <Chip label={`$${selectedItem.price}`} sx={{ fontWeight: 800, fontSize: "1.15rem", bgcolor: "#FFD100", color: "#000", px: 1.5, height: 28 }} />
                  <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary", opacity: 0.65, textAlign: "center" }}>
                    plus taxes and shipping
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={0.75} sx={{ mt: 1.5, px: 1.25, py: 1, borderRadius: 1.5, bgcolor: "rgba(255,195,28,0.08)", border: "1px solid rgba(255,195,28,0.25)" }}>
                <FiInfo size={13} style={{ flexShrink: 0, color: "#E6BC00" }} />
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, lineHeight: 1.4 }}>
                  Estimate — starting at <strong>${selectedItem.price}</strong>. Final price may be higher or lower after member review.
                </Typography>
              </Box>
              {selectedItem.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, fontStyle: "italic" }}>
                  {selectedItem.description}
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 2, border: "1px dashed", borderColor: "divider", borderRadius: 2, textAlign: "center", bgcolor: "rgba(0,0,0,0.02)" }}>
              <Typography variant="h6" fontWeight={700}>
                Custom Request
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                You’ll describe your custom needs — member will provide a tailored quote.
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Declared Value & Box
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">
              Declared Market Value
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {values.declaredMarketValue
                ? `$${parseFloat(values.declaredMarketValue).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "\u2014"}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="body1" fontWeight={700} color="text.secondary">
              Box Included
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {values.boxIncluded ? "Yes" : "No"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Shoe Details
        </Typography>
        <Grid container spacing={2}>
          {SHOE_FIELDS.map(({ label, key }) => {
            let displayValue = values.shoeDetails[key];
            if (key === "returnTimeframe" && displayValue) {
              displayValue = TIMEFRAME_LABELS[displayValue] || displayValue;
            } else if (displayValue && CAPITALIZE_FIELDS.includes(key)) {
              displayValue = titleCase(displayValue);
            }
            return (
              <Grid item xs={6} sm={4} key={key}>
                <Typography variant="body1" fontWeight={700} color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {displayValue || "\u2014"}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {values.shoeDetails.previousRepairs && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" fontWeight={600} mb={1}>
            Previous Repairs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {values.shoeDetails.previousRepairsNotes || "Yes (no details provided)"}
          </Typography>
        </Paper>
      )}

      {values.shoeDetails.clientNotes && (
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" fontWeight={600} mb={1}>
            Additional Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {values.shoeDetails.clientNotes}
          </Typography>
        </Paper>
      )}

      {Object.entries(values.shoeDetails.photos).some(([, photos]) => photos.length > 0) && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h4" fontWeight={600} mb={2}>
            Photos
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(values.shoeDetails.photos).map(
              ([section, photos]) =>
                photos.length > 0 && (
                  <Grid item xs={12} sm={6} md={4} key={section}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      color="text.secondary"
                      textTransform="capitalize"
                      mb={1}
                    >
                      {SECTION_LABELS[section] || section}
                    </Typography>
                    {photos.map((photo, idx) => (
                      <Card
                        key={idx}
                        sx={{
                          mb: 1.5,
                          position: "relative",
                          "&:last-child": { mb: 0 },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="160"
                          image={photo.url}
                          alt={`${SECTION_LABELS[section] || section} ${idx + 1}`}
                          sx={{ objectFit: "cover" }}
                        />
                        <IconButton
                          onClick={() => setPreviewUrl(photo.url)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            bgcolor: "rgba(0,0,0,0.45)",
                            color: "common.white",
                            "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                          }}
                        >
                          <FiZoomIn size={14} />
                        </IconButton>
                        {photo.note && (
                          <CardContent sx={{ py: 1, px: 1.5, "&:last-child": { pb: 1 } }}>
                            <Typography variant="body2" color="text.secondary">
                              {photo.note}
                            </Typography>
                          </CardContent>
                        )}
                        {photos.length > 1 && (
                          <Chip
                            label={`${idx + 1} of ${photos.length}`}
                            size="small"
                            sx={{
                              position: "absolute",
                              bottom: 6,
                              right: 6,
                              bgcolor: "rgba(0,0,0,0.55)",
                              color: "common.white",
                            }}
                          />
                        )}
                      </Card>
                    ))}
                  </Grid>
                )
            )}
          </Grid>
        </Paper>
      )}

      <ImagePreviewDialog
        open={!!previewUrl}
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </Box>
  );
};

export default ConfirmationStep;
