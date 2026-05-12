import React from "react";
import { Button } from "@mui/material";
import { useColors } from "../theme/colors";

const QrActionButton = ({ children, onClick, href, target, rel, startIcon }) => {
  const colors = useColors();

  return (
    <Button
      fullWidth
      variant="outlined"
      style={{ marginTop: "10px" }}
      sx={{
        color: colors.textPrimary,
        borderColor: colors.border,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: startIcon ? 1 : 0,
      }}
      onClick={onClick}
      component={href ? "a" : undefined}
      href={href}
      target={target}
      rel={rel}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
};

export default QrActionButton;
