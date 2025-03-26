import React, { useState, useEffect } from "react";
import Logo from "../../assets/ss-logo.svg";
import GoogleIcon from "@mui/icons-material/Google";
import { Button, Alert, Stack, Box, Typography } from "@mui/material";
import { SignedOut, useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignUpMember = () => {
  const [error, setError] = useState("");
  const { isSignedIn } = useUser();
  const { openSignUp } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  const handleGoogleSignUp = async () => {
    try {
      setError("");

      await openSignUp({
        strategy: "oauth_google",
        unsafeMetadata: { role: "member" },
        forceRedirectUrl: "member/signup-info",
        signInForceRedirectUrl: "/dashboard",
        signInUrl: "/login",
      });

      if (!createdUserId) {
        throw new Error("Signup failed, no user ID returned.");
      }
    } catch (err) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
          sx={{ width: "80%", maxWidth: "300px", height: "auto", my: 4 }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
          Member Site
        </Typography>
        <SignedOut>
          <Button
            variant="contained"
            aria-label="Sign Up With Google"
            startIcon={<GoogleIcon />}
            sx={{ mt: 2, color: "black", backgroundColor: "gold" }}
            onClick={handleGoogleSignUp}
          >
            Sign up with Google
          </Button>
          {error && (
            <Alert severity="error" color="error">
              {error}
            </Alert>
          )}
        </SignedOut>
      </Stack>
    </Box>
  );
};

export default SignUpMember;
