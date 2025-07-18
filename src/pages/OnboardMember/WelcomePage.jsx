import React from "react";
import { Box, Typography, Button } from "@mui/material";

const WelcomePage = ({ onContinue }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    justifyItems="center"
    height="100%"
  >
    <Typography variant="h4" gutterBottom>
      Welcome to Sneaker Society!
    </Typography>
    <Typography variant="body1" align="center" mb={3}>
      We're excited to have you join our community. Let's get you set up in just
      a few quick steps.
    </Typography>
    <Button variant="contained" color="primary" onClick={onContinue}>
      Get Started
    </Button>
  </Box>
);

export default WelcomePage;
