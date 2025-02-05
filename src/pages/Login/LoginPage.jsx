import {
  Button,
  TextField,
  Stack,
  Box,
  Alert,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import Logo from "../../assets/ss-logo.svg";
import GoogleIcon from "@mui/icons-material/Google";

import { useNavigate } from "react-router-dom";
import { SignedOut, useClerk } from "@clerk/clerk-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { openSignIn } = useClerk();

  const handleLogin = async (type, values) => {
    try {
      setError("");

      await openSignIn({
        strategy: "oauth_google",
        forceRedirectUrl: "/dashboard",
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
            aria-label="Sign Up With Google"
            startIcon={<GoogleIcon />}
            sx={{ mt: 2, color: "black", backgroundColor: "gold" }}
            onClick={handleLogin}
          >
            Sign In
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
}
