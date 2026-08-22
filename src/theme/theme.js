import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

const brand = {
  gold: "#ffc31c",
  goldLight: "#ffd04a",
  goldDark: "#b38600",
  green: "#4cceac",
  blue: "#6870fa",
  red: "#db4f4a",
};

export const tokens = (mode) => {
  const isDark = mode === "dark";

  return {
    grey: isDark
      ? {
          100: "#f5f5f5",
          200: "#e0e0e0",
          300: "#c2c2c2",
          400: "#a3a3a3",
          500: "#858585",
          600: "#666666",
          700: "#525252",
          800: "#292929",
          900: "#141414",
        }
      : {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },

    primary: isDark
      ? {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1f2a40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        }
      : {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#ffffff",
          600: "#f7f7f7",
          700: "#eeeeee",
          800: "#e5e5e5",
          900: "#dcdcdc",
        },

    greenAccent: isDark
      ? {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        }
      : {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },

    redAccent: isDark
      ? {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        }
      : {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },

    blueAccent: isDark
      ? {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        }
      : {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c2c6fd",
          900: "#e1e2fe",
        },

    yellowAccent: isDark
      ? {
          100: "#fff6d5",
          200: "#ffeaa7",
          300: "#ffdd79",
          400: "#ffd04a",
          500: "#ffc31c",
          600: "#e6a800",
          700: "#b38600",
          800: "#806900",
          900: "#4d4d00",
        }
      : {
          100: "#4d4d00",
          200: "#806900",
          300: "#b38600",
          400: "#e6a800",
          500: "#ffc31c",
          600: "#ffd04a",
          700: "#ffdd79",
          800: "#ffeaa7",
          900: "#fff6d5",
        },
  };
};

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  const isDark = mode === "dark";

  const backgroundDefault = isDark ? colors.primary[900] : "#f7f7f7";
  const backgroundPaper = isDark ? colors.primary[800] : "#ffffff";
  const textPrimary = isDark ? colors.grey[100] : colors.grey[100];
  const textSecondary = isDark ? colors.grey[300] : colors.grey[500];
  const divider = isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.12)";

  return {
    palette: {
      mode,

      primary: {
        main: brand.gold,
        light: brand.goldLight,
        dark: brand.goldDark,
        contrastText: "#111111",
      },

      secondary: {
        main: brand.green,
      },

      success: {
        main: brand.green,
      },

      warning: {
        main: brand.gold,
      },

      error: {
        main: brand.red,
      },

      info: {
        main: brand.blue,
      },

      neutral: {
        dark: colors.grey[700],
        main: colors.grey[500],
        light: colors.grey[300],
      },

      background: {
        default: backgroundDefault,
        paper: backgroundPaper,
      },

      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },

      divider,

      action: {
        hover: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",

        selected: isDark ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.08)",

        disabled: isDark ? "rgba(255, 255, 255, 0.30)" : "rgba(0, 0, 0, 0.26)",

        disabledBackground: isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(0, 0, 0, 0.12)",
      },
    },

    shape: {
      borderRadius: 8,
    },

    spacing: 8,

    typography: {
      fontFamily: ["Source Sans Pro", "Inter", "Arial", "sans-serif"].join(","),

      fontSize: 14,

      h1: {
        fontSize: "2.75rem",
        fontWeight: 700,
        lineHeight: 1.12,
      },

      h2: {
        fontSize: "2.25rem",
        fontWeight: 700,
        lineHeight: 1.18,
      },

      h3: {
        fontSize: "1.75rem",
        fontWeight: 700,
        lineHeight: 1.25,
      },

      h4: {
        fontSize: "1.375rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },

      h5: {
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },

      h6: {
        fontSize: "1rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },

      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },

      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },

      button: {
        fontWeight: 700,
        textTransform: "none",
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            boxSizing: "border-box",
          },

          html: {
            backgroundColor: backgroundDefault,
          },

          body: {
            margin: 0,
            minWidth: 320,
            backgroundColor: backgroundDefault,
            color: textPrimary,
          },

          "#root": {
            minHeight: "100vh",
          },

          a: {
            color: "inherit",
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 44,
            borderRadius: 8,
          },

          containedPrimary: {
            color: brand.goldDark,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${divider}`,
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: divider,
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: textSecondary,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: brand.gold,
            },
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: divider,
          },
        },
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

const getInitialMode = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedMode = window.localStorage.getItem("theme-mode");

  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useMode = () => {
  const [mode, setMode] = useState(getInitialMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((previousMode) => {
          const nextMode = previousMode === "light" ? "dark" : "light";

          if (typeof window !== "undefined") {
            window.localStorage.setItem("theme-mode", nextMode);
          }

          return nextMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};

export const getDarkTheme = () => createTheme(themeSettings("dark"));
