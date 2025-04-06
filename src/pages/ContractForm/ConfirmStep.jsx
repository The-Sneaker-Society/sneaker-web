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
          ([section, images]) =>
            images.length > 0 && (
              <Grid item xs={12} sm={6} md={4} key={section}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={images[0]} // Display the first image
                    alt={section}
                  />
                  <CardContent>
                    <Typography variant="body2">
                      {section}: {images.length} image
                      {images.length > 1 ? "s" : ""}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
        )}
      </Grid>
    </Box>
  );
};

export default ConfirmationStep;
