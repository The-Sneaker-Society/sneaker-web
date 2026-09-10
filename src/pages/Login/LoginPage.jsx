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

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleLogin = async () => {
    try {
      setError("");
      setIsSubmitting(true);

      await openSignIn({
        strategy: "oauth_google",
        forceRedirectUrl: "/dashboard",
        signUpUrl: "/member/signup",
      });
    } catch (err) {
      const clerkMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "We could not start Google sign-in. Please try again.";

      setError(clerkMessage);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <Box
        sx={{
          alignItems: "center",
          bgcolor: "background.default",
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
        bgcolor: "background.default",
        color: "text.primary",
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
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover",
                color: "text.primary",
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
              color: "text.primary",
              p: { xs: 3, sm: 5 },
            }}
          >
            <Stack alignItems="center" spacing={3}>
              <Box
                aria-label="Return to The Sneaker Society home page"
                component={RouterLink}
                sx={{
                  display: "inline-flex",
                  lineHeight: 0,
                  textDecoration: "none",
                  "&:focus-visible": {
                    borderRadius: 1,
                    outline: "3px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 4,
                  },
                }}
                to="/"
              >
                <Box
                  alt="The Sneaker Society"
                  component="img"
                  src={Logo}
                  sx={{
                    display: "block",
                    height: "auto",
                    maxWidth: 240,
                    width: { xs: "72%", sm: "62%" },
                  }}
                />
              </Box>

              <Stack spacing={1} textAlign="center">
                <Typography component="h1" variant="h3">
                  Welcome back
                </Typography>

                <Typography color="text.secondary" variant="body1">
                  Sign in to manage your sneaker-service business, clients, and
                  community connections.
                </Typography>
              </Stack>

              <Box sx={{ width: "100%" }}>
                <SignedOut>
                  <Button
                    aria-label="Continue with Google"
                    disabled={isSubmitting}
                    fullWidth
                    onClick={handleLogin}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <GoogleIcon />
                      )
                    }
                    sx={{
                      bgcolor: "brandSurface.main",
                      border: 1,
                      borderColor: "divider",
                      color: "common.black",
                      fontWeight: 700,
                      minHeight: 48,
                      "&:hover": {
                        bgcolor: "brandSurface.main",
                        borderColor: "primary.main",
                        boxShadow: 2,
                      },
                      "&.Mui-disabled": {
                        bgcolor: "brandSurface.main",
                        color: "text.secondary",
                        opacity: 0.65,
                      },
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
                color="text.secondary"
                textAlign="center"
                variant="body2"
              >
                New to The Sneaker Society?{" "}
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
                color="text.secondary"
                textAlign="center"
                variant="body2"
              >
                Looking for a sneaker-service professional?{" "}
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
                  to="/user/signup"
                >
                  Create a client account
                </Box>
              </Typography>
            </Stack>
          </Paper>

          <Typography
            color="text.secondary"
            textAlign="center"
            variant="caption"
          >
            Sign in securely with your Google account.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
