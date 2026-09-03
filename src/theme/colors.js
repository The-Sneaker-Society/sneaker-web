import { useTheme } from "@mui/material/styles";

export const useColors = () => {
  const theme = useTheme();

  return {
    mode: theme.palette.mode,
    isDark: theme.palette.mode === "dark",

    pageBg: theme.palette.background.default,
    surfaceBg: theme.palette.background.paper,

    sidebarBg: theme.palette.background.paper,
    widgetBg: theme.palette.background.paper,

    textPrimary: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,

    textInverse: theme.palette.getContrastText(theme.palette.background.paper),

    sidebarText: theme.palette.text.primary,

    border: theme.palette.divider,
    borderSecondary: theme.palette.text.secondary,
    borderSubtle: theme.palette.divider,

    primary: theme.palette.primary.main,
    primaryLight: theme.palette.primary.light,
    primaryDark: theme.palette.primary.dark,

    secondary: theme.palette.secondary.main,

    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,

    status: {
      notStarted: theme.palette.error.main,
      inProgress: theme.palette.warning.main,
      completed: theme.palette.success.main,
      pending: theme.palette.info.main,
      error: theme.palette.error.main,
    },
  };
};
