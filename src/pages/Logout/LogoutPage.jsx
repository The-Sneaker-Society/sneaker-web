import React, { useEffect, useRef } from "react";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useClerk } from "@clerk/clerk-react";
import { useColors } from "../../theme/colors";

export const LogoutPage = () => {
  const hasStartedSignOut = useRef(false);
  const { signOut } = useClerk();
  const colors = useColors();

  useEffect(() => {
    if (hasStartedSignOut.current) {
      return;
    }

    hasStartedSignOut.current = true;

    const handleLogout = async () => {
      try {
        await signOut({
          redirectUrl: "/",
        });
      } catch (error) {
        window.location.assign("/");
      }
    };

    handleLogout();
  }, [signOut]);

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress color="primary" />
        <Typography variant="body1">Signing you out...</Typography>
      </Stack>
    </Box>
  );
};
