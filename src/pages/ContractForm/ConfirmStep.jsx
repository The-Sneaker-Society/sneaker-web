import React from "react";
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
} from "@mui/material";
import { useFormikContext } from "formik";

const ConfirmationStep = () => {
  const { values } = useFormikContext();

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
                  <Card key={idx} sx={{ mb: 1 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={photo.url}
                      alt={`${section} ${idx + 1}`}
                    />
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
    </Box>
  );
};

export default ConfirmationStep;
