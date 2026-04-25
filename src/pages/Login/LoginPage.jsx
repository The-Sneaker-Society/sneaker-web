import { Button, Stack, Box, Alert, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import Logo from "../../assets/ss-logo.svg";
import GoogleIcon from "@mui/icons-material/Google";

import { useNavigate } from "react-router-dom";
import { SignedOut, useClerk, useUser } from "@clerk/clerk-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { isSignedIn, isLoaded, user } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const role = user?.unsafeMetadata?.role;
    if (role) {
      navigate("/dashboard");
    } else {
      setError(
        "No account found for this email. Please sign up from the home page instead."
      );
    }
  }, [isSignedIn, isLoaded, user, navigate]);

  const handleLogin = async () => {
    try {
      setError("");
      await openSignIn({
        strategy: "oauth_google",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isLoaded) return <CircularProgress />;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "black",
        padding: "20px",
      }}
    >
      <Stack
        alignItems="center"
        spacing={2}
        sx={{ width: "100%", maxWidth: "360px", px: 2 }}
      >
        <Box
          component="img"
          src={Logo}
          alt="Logo"
          sx={{
            width: "80%",
            maxWidth: "300px",
            height: "auto",
            my: 4,
            "@media (min-width:600px)": {
              maxWidth: "80%",
            },
          }}
        />
        <SignedOut>
          <Button
            variant="contained"
            aria-label="Sign In With Google"
            startIcon={<GoogleIcon />}
            sx={{ mt: 2, color: "black", backgroundColor: "gold" }}
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </SignedOut>
        {error && (
          <Alert severity="error" color="error">
            {error}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
