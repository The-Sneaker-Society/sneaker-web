import React from "react";
import { Container, Box, CircularProgress } from "@mui/material";

export const LoadingCircle = () => {
  return (
    <Container maxWidth="md" sx={{ height: "100vh" }}>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  );
};
