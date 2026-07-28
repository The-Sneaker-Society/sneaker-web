import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useColors } from "../../../theme/colors";

const GroupPageLayout = ({ header, sidebar, children }) => {
  const theme = useTheme();
  const colors = useColors();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: colors.textPrimary,
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
