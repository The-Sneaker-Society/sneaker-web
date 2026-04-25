import { Box, Stack } from "@mui/material";

const GroupPageLayout = ({ header, sidebar, children }) => {
  return (
    <Box sx={{ maxWidth: 1180, mx: "auto", px: 2, py: 4 }}>
      {header}
      <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
        <Box sx={{ width: { xs: "100%", lg: 340 }, flexShrink: 0 }}>{sidebar}</Box>
      </Stack>
    </Box>
  );
};

export default GroupPageLayout;