import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GoogleIcon from "@mui/icons-material/Google";
import { SignedOut, useClerk, useUser } from "@clerk/clerk-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Logo from "../../assets/ss-logo.svg";
import { useColors } from "../../theme/colors";

const SignUpUser = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoaded, isSignedIn } = useUser();
  const { openSignUp } = useClerk();
  const navigate = useNavigate();
  const colors = useColors();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleGoogleSignUp = async () => {
    try {
      setError("");
      setIsSubmitting(true);

      await openSignUp({
        strategy: "oauth_google",

        // This is display/setup context only. Do not use unsafeMetadata
        // as the authoritative source for protected-route authorization.
        unsafeMetadata: {
          role: "client",
        },

        forceRedirectUrl: "/user/signup-info",
        signInForceRedirectUrl: "/dashboard",
        signInUrl: "/login",
      });
    } catch (err) {
      const clerkMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "We could not start Google sign-up. Please try again.";

      setError(clerkMessage);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <Box
        sx={{
          alignItems: "center",
          bgcolor: colors.pageBg,
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        display: "flex",
        minHeight: "100vh",
        py: { xs: 3, sm: 5 },
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Button
            component={RouterLink}
            startIcon={<ArrowBackIcon />}
            sx={{
              alignSelf: "flex-start",
              color: colors.textSecondary,
              "&:hover": {
                bgcolor: "action.hover",
                color: colors.textPrimary,
              },
            }}
            to="/"
          >
            Back to home
          </Button>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              color: colors.textPrimary,
              p: { xs: 3, sm: 5 },
            }}
          >
            <Stack alignItems="center" spacing={3}>
              <Box
                alt="The Sneaker Society"
                component="img"
                src={Logo}
                sx={{
                  height: "auto",
                  maxWidth: 240,
                  width: { xs: "72%", sm: "62%" },
                }}
              />

              <Stack spacing={1} textAlign="center">
                <Typography component="h1" variant="h3">
                  Find the right sneaker service
                </Typography>

                <Typography color={colors.textSecondary} variant="body1">
                  Create a client account to discover sneaker-service
                  professionals, submit service inquiries, and keep track of
                  your service relationships.
                </Typography>
              </Stack>

              <Box sx={{ width: "100%" }}>
                <SignedOut>
                  <Button
                    aria-label="Continue with Google"
                    disabled={isSubmitting}
                    fullWidth
                    onClick={handleGoogleSignUp}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <GoogleIcon />
                      )
                    }
                    sx={{
                      minHeight: 48,
                    }}
                    variant="contained"
                  >
                    {isSubmitting
                      ? "Connecting to Google..."
                      : "Continue with Google"}
                  </Button>
                </SignedOut>
              </Box>

              {error && (
                <Alert
                  onClose={() => setError("")}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {error}
                </Alert>
              )}

              <Divider flexItem />

              <Typography
                color={colors.textSecondary}
                textAlign="center"
                variant="body2"
              >
                Are you a sneaker-service professional?{" "}
                <Box
                  component={RouterLink}
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  to="/member/signup"
                >
                  Create a business profile
                </Box>
              </Typography>

              <Typography
                color={colors.textSecondary}
                textAlign="center"
                variant="body2"
              >
                Already have an account?{" "}
                <Box
                  component={RouterLink}
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  to="/login"
                >
                  Log in
                </Box>
              </Typography>
            </Stack>
          </Paper>

          <Typography
            color={colors.textSecondary}
            textAlign="center"
            variant="caption"
          >
            By continuing, you agree to create a client account for The Sneaker
            Society.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignUpUser;
