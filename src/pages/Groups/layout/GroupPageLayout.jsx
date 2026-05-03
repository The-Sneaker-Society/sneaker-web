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
          maxWidth: 1320,
          mx: "auto",
          px: { xs: 2, md: 3, xl: 4 },
          py: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box sx={{ mb: { xs: 2.5, md: 3 } }}>{header}</Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 2.1fr) minmax(320px, 0.9fr)",
            },
            gap: { xs: 3, md: 3.5 },
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>{children}</Box>

          <Box
            sx={{
              minWidth: 0,
              position: { lg: "sticky" },
              top: { lg: 24 },
              alignSelf: "flex-start",
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