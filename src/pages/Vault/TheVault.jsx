import React from "react";
import { Box, Typography } from "@mui/material";
import { Inventory2Outlined } from "@mui/icons-material";
import { useColors } from "../../theme/colors";

const TheVault = () => {
  const colors = useColors();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.isDark ? "#000" : "#fff",
        gap: 3,
      }}
    >
      <Inventory2Outlined
        sx={{ fontSize: 80, color: colors.warning, opacity: 0.9 }}
      />
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          color: colors.warning,
        }}
      >
        The Vault
      </Typography>
      <Typography
        sx={{
          color: colors.textSecondary,
          fontSize: { xs: "1rem", sm: "1.1rem" },
          textAlign: "center",
          maxWidth: 400,
          px: 2,
        }}
      >
        Coming soon — your personal archive of work, history, and highlights.
      </Typography>
    </Box>
  );
};

export default TheVault;
