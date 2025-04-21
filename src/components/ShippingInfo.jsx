import React from "react";
import { TextField, Typography, Container, Grid, Box } from "@mui/material";
import StyledButton from "../pages/HomePage/StyledButton";

const ShippingInfo = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h1"
          color="white"
          fontWeight="800"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Shipping Info
        </Typography>
        <TextField
          label="Shipping Carrier"
          variant="outlined"
          fullWidth
          InputLabelProps={{ style: { color: "#aaa" } }}
          sx={{
            mb: 2,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff",
              },
              "&:hover fieldset": {
                borderColor: "#FFD700",
              },
            },
          }}
        />
        <TextField
          label="Tracking Number"
          variant="outlined"
          fullWidth
          InputLabelProps={{ style: { color: "#aaa" } }}
          sx={{
            mb: 4,
            input: { color: "white" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff",
              },
              "&:hover fieldset": {
                borderColor: "#FFD700",
              },
            },
          }}
        />
        <StyledButton>Confirm</StyledButton>
      </Box>
    </Container>
  );
};

export default ShippingInfo;
