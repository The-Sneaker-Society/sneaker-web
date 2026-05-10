import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from "@mui/material";
import { FiZoomIn } from "react-icons/fi";
import { useFormikContext } from "formik";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";

const ConfirmationStep = () => {
  const { values } = useFormikContext();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    console.log("ConfirmStep form values:", JSON.stringify(values, null, 2));
  }, [values]);

  return (
    <Box sx={{ height: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Confirm Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        Please review the following information carefully. If everything is
        correct, click the "Submit" button to finalize your request.
      </Typography>

      <List>
        <Typography variant="h6" gutterBottom>
          Shoe Information
        </Typography>
        <Divider />
        <ListItem>
          <ListItemText primary="Brand" secondary={values.shoeDetails.brand} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Model" secondary={values.shoeDetails.model} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Color" secondary={values.shoeDetails.color} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Size (US)"
            secondary={values.shoeDetails.size}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Client Notes"
            secondary={values.shoeDetails.clientNotes}
          />
        </ListItem>
        <Divider />
      </List>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Uploaded Images
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(values.shoeDetails.photos).map(
          ([section, photos]) =>
            photos.length > 0 && (
              <Grid item xs={12} sm={6} md={4} key={section}>
                <Typography variant="subtitle1" sx={{ mb: 1, textTransform: "capitalize" }}>
                  {section}
                </Typography>
                {photos.map((photo, idx) => (
                  <Card key={idx} sx={{ mb: 1, position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={photo.url}
                      alt={`${section} ${idx + 1}`}
                    />
                    <IconButton
                      onClick={() => setPreviewUrl(photo.url)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        borderRadius: "50%",
                        p: 0.5,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                    >
                      <FiZoomIn size={16} />
                    </IconButton>
                    <CardContent>
                      {photo.note && (
                        <Typography variant="body2" color="text.secondary">
                          Note: {photo.note}
                        </Typography>
                      )}
                      {photos.length > 1 && (
                        <Typography variant="caption" color="text.secondary">
                          Image {idx + 1} of {photos.length}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            )
        )}
      </Grid>
      <ImagePreviewDialog
        open={!!previewUrl}
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </Box>
  );
};

export default ConfirmationStep;
