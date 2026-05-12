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
import { FiZoomIn } from "react-icons/fi";
import { useFormikContext } from "formik";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";

const SECTION_LABELS = {
  leftSide: "Left Side",
  rightSide: "Right Side",
  topView: "Top View",
  bottomView: "Bottom View",
  frontView: "Front View",
  backView: "Back View",
  other: "Other Areas",
};

const TIMEFRAME_LABELS = {
  standard: "Standard (2-3 weeks)",
  rush: "Rush (1 week)",
  "no-rush": "No rush",
};

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

const ConfirmationStep = () => {
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

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" fontWeight={600} mb={2}>
          Shoe Details
        </Typography>
        <Grid container spacing={2}>
          {SHOE_FIELDS.map(({ label, key }) => {
            let displayValue = values.shoeDetails[key];
            if (key === "returnTimeframe" && displayValue) {
              displayValue = TIMEFRAME_LABELS[displayValue] || displayValue;
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
