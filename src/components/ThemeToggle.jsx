import { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { ColorModeContext } from "../theme/theme";
import { useColors } from "../theme/colors";

const ThemeToggle = () => {
  const colors = useColors();
  const { toggleColorMode } = useContext(ColorModeContext);

  const label = colors.isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={toggleColorMode}
        sx={{
          color: colors.textPrimary,
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {colors.isDark ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
