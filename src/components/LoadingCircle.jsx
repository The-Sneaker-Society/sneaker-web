import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useColors } from "../theme/colors";

export const LoadingCircle = () => {
  const colors = useColors();

  return (
    <Box
      sx={{
        width: "100%",
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        sx={{ color: colors.warning, transform: "scale(1.5)" }}
      />
    </Box>
  );
};
