import React from "react";
import { Button } from "@mui/material";
import { useColors } from "../theme/colors";

const QrActionButton = ({ children, onClick, href, target, rel, startIcon, sx: sxProp = {} }) => {
  const colors = useColors();

  return (
    <Button
      variant="outlined"
      sx={{
        flex: 1,
        color: colors.textPrimary,
        borderColor: colors.borderSecondary,
        borderRadius: 1.5,
        textTransform: "none",
        fontSize: "0.8rem",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": { bgcolor: `${colors.textPrimary}08`, borderColor: colors.textPrimary },
        ...sxProp,
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
