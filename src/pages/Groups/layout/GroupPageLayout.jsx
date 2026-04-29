import { Box, Stack } from "@mui/material";

const variantStyles = {
  default: {
    minHeight: "auto",
    bgcolor: "transparent",
    color: "inherit",
  },
  dark: {
    minHeight: "100vh",
    bgcolor: "#111",
    color: "#fff",
  },
};

const GroupPageLayout = ({
  header,
  sidebar,
  children,
  variant = "default",
}) => {
  const activeVariant = variantStyles[variant] || variantStyles.default;

  return (
    <Box
      sx={{
        ...activeVariant,
        px: { xs: 2, md: 4 },
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto" }}>
        {header && <Box sx={{ mb: 3 }}>{header}</Box>}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          alignItems="flex-start"
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
          {sidebar && (
            <Box sx={{ width: { xs: "100%", lg: 340 }, flexShrink: 0 }}>
              {sidebar}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default GroupPageLayout;