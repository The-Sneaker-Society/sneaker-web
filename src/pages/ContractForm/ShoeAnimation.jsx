import React from "react";
import { Box } from "@mui/material";
import { float, cleanOff } from "./animations";

const ShoeAnimation = ({ isPreview = false }) => (
  <Box sx={{ position: "relative", fontSize: 72, mb: 2, width: 84, height: 84, mx: "auto" }}>
    <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: `${float} 3s ease-in-out infinite` }}>
      👟
    </Box>
    {!isPreview && (
      <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: `${float} 3s ease-in-out infinite, ${cleanOff} 3s ease-in-out forwards` }}>
        👟
      </Box>
    )}
  </Box>
);

export default ShoeAnimation;
