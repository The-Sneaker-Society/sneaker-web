import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Box, CircularProgress } from "@mui/material";

export default function SignUpCallback() {
  const { user } = useUser();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !user) return;
    hasRun.current = true;

    const role = user?.unsafeMetadata?.role;
    if (role === "member") {
      window.location.href = "/member/generate";
    } else if (role === "client") {
      window.location.href = "/user/onboarding";
    } else {
      window.location.href = "/dashboard";
    }
  }, [user]);

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
