export const cardSx = {
  p: { xs: 2, md: 2.5 },
  bgcolor: "#151618",
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};

export const pageContainerSx = {
  minHeight: "100vh",
  bgcolor: "#0b0b0c",
  color: "#fff",
};

export const stateCardSx = {
  ...cardSx,
  py: { xs: 4, md: 5 },
  px: { xs: 2.5, md: 4 },
  textAlign: "center",
};

export const modalCardSx = {
  bgcolor: "#151618",
  color: "#fff",
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.34)",
  width: "min(440px, calc(100vw - 32px))",
  mx: "auto",
  mt: { xs: "12vh", sm: "16vh" },
};

export const modalFieldSx = {
  "& .MuiInputBase-root": {
    bgcolor: "#0d0e10",
    color: "#fff",
    borderRadius: 2,
  },
  "& .MuiInputLabel-root": {
    color: "#9ea3ab",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FFD100",
  },
  "& fieldset": {
    borderColor: "rgba(255,255,255,0.10)",
  },
  "& .MuiOutlinedInput-root:hover fieldset": {
    borderColor: "rgba(255,209,0,0.35)",
  },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#FFD100",
  },
};

export const secondaryButtonSx = {
  color: "#c2c6cc",
  borderColor: "rgba(255,255,255,0.14)",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  px: 2,
  minHeight: 44,
  "&:hover": {
    borderColor: "rgba(255,209,0,0.35)",
    bgcolor: "rgba(255,255,255,0.02)",
  },
};

export const primaryButtonSx = {
  bgcolor: "#FFD100",
  color: "#111",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  boxShadow: "none",
  px: 2,
  minHeight: 44,
  "&:hover": {
    bgcolor: "#f5c400",
    boxShadow: "none",
  },
};

export const destructiveButtonSx = {
  bgcolor: "#ff6b6b",
  color: "#fff",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  boxShadow: "none",
  px: 2,
  minHeight: 44,
  "&:hover": {
    bgcolor: "#ff5252",
    boxShadow: "none",
  },
};

export const filledUtilityButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  alignSelf: "flex-start",
  minHeight: 42,
  px: 1.75,
  bgcolor: "#23252a",
  color: "#fff",
  boxShadow: "none",
  border: "1px solid rgba(255,255,255,0.10)",
  "&:hover": {
    bgcolor: "#2c2f35",
    boxShadow: "none",
    borderColor: "rgba(255,209,0,0.35)",
  },
};

export const feedSectionLabelSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  px: { xs: 0.25, sm: 0.5 },
};
