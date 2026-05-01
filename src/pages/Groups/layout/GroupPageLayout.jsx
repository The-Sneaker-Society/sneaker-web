import { Box } from "@mui/material";

const GroupPageLayout = ({ header, sidebar, children, variant = "dark" }) => {
  const isDark = variant === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isDark ? "#050506" : "#f5f5f5",
        color: isDark ? "#fff" : "#111",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "none",
          px: { xs: 2, md: 3, xl: 4 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ mb: 3 }}>{header}</Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.7fr) 360px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>{children}</Box>

          <Box
            sx={{
              minWidth: 0,
              position: { lg: "sticky" },
              top: { lg: 24 },
              alignSelf: "start",
            }}
          >
            {sidebar}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GroupPageLayout;