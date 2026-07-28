import { useColors } from "../../../theme/colors";

export const useGroupPageStyles = () => {
  const colors = useColors();
  const isDark = colors.isDark;

  const cardSx = {
    p: { xs: 2, md: 2.5 },
    bgcolor: colors.widgetBg,
    color: colors.textPrimary,
    borderRadius: 3,
    border: `1px solid ${colors.borderSubtle}`,
    boxShadow: isDark
      ? "0 10px 30px rgba(0,0,0,0.18)"
      : "0 6px 20px rgba(0,0,0,0.06)",
  };

  const pageContainerSx = {
    minHeight: "100vh",
    bgcolor: isDark ? colors.accent.primary[900] : colors.accent.primary[400],
    color: colors.textPrimary,
  };

  const stateCardSx = {
    ...cardSx,
    py: { xs: 4, md: 5 },
    px: { xs: 2.5, md: 4 },
    textAlign: "center",
  };

  const modalCardSx = {
    bgcolor: colors.widgetBg,
    color: colors.textPrimary,
    p: 3,
    borderRadius: 3,
    border: `1px solid ${colors.borderSubtle}`,
    boxShadow: isDark
      ? "0 24px 60px rgba(0,0,0,0.34)"
      : "0 18px 40px rgba(0,0,0,0.12)",
    width: "min(440px, calc(100vw - 32px))",
    mx: "auto",
    mt: { xs: "12vh", sm: "16vh" },
  };

  const modalFieldSx = {
    "& .MuiInputBase-root": {
      bgcolor: isDark ? "#0d0e10" : "#f5f5f7",
      color: colors.textPrimary,
      borderRadius: 2,
    },
    "& .MuiInputLabel-root": {
      color: colors.textSecondary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.primary,
    },
    "& fieldset": {
      borderColor: colors.borderSubtle,
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
      borderColor: colors.primary,
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: colors.primary,
    },
  };

  const secondaryButtonSx = {
    color: colors.textSecondary,
    borderColor: colors.borderSecondary,
    textTransform: "none",
    fontWeight: 700,
    borderRadius: "999px",
    px: 2,
    minHeight: 44,
    "&:hover": {
      borderColor: colors.primary,
      bgcolor: colors.borderSubtle,
    },
  };

  const primaryButtonSx = {
    bgcolor: colors.primary,
    color: colors.textInverse,
    textTransform: "none",
    fontWeight: 700,
    borderRadius: "999px",
    boxShadow: "none",
    px: 2,
    minHeight: 44,
    "&:hover": {
      bgcolor: colors.accent.yellowAccent[600],
      boxShadow: "none",
    },
  };

  const destructiveButtonSx = {
    bgcolor: colors.status.error,
    color: "#fff",
    textTransform: "none",
    fontWeight: 700,
    borderRadius: "999px",
    boxShadow: "none",
    px: 2,
    minHeight: 44,
    "&:hover": {
      bgcolor: isDark ? "#ff5252" : "#d94343",
      boxShadow: "none",
    },
  };

  const filledUtilityButtonSx = {
    textTransform: "none",
    fontWeight: 700,
    borderRadius: "999px",
    alignSelf: "flex-start",
    minHeight: 42,
    px: 1.75,
    bgcolor: isDark ? "#23252a" : "#f3f4f6",
    color: colors.textPrimary,
    boxShadow: "none",
    border: `1px solid ${colors.borderSubtle}`,
    "&:hover": {
      bgcolor: isDark ? "#2c2f35" : "#e9ebef",
      boxShadow: "none",
      borderColor: colors.primary,
    },
  };

  const feedSectionLabelSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    px: { xs: 0.25, sm: 0.5 },
  };

  return {
    colors,
    isDark,
    cardSx,
    pageContainerSx,
    stateCardSx,
    modalCardSx,
    modalFieldSx,
    secondaryButtonSx,
    primaryButtonSx,
    destructiveButtonSx,
    filledUtilityButtonSx,
    feedSectionLabelSx,
  };
};
