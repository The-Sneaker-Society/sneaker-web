import { useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

export default function SignUpCallback() {
  const { user } = useUser();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    (async () => {
      if (hasRun.current || !user) return;
      hasRun.current = true;

      const role = user?.unsafeMetadata?.role;
      if (role) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/member/generate", { replace: true });
      }
    })();
  }, [user, navigate]);

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
