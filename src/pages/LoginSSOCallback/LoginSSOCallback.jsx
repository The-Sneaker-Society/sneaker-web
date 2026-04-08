import { useEffect, useRef } from "react";
import { Box, CircularProgress } from "@mui/material";

export default function LoginSSOCallback() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    window.location.href = "/member/onboarding";
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "black",
      }}
    >
      <CircularProgress sx={{ color: "gold" }} />
    </Box>
  );
}
