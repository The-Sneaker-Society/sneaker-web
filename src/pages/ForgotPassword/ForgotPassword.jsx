import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Box,
  Alert,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../auth/services";
import CheckYourEmail from "./CheckYourEmail";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lastAttempt, setLastAttempt] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAttemptCount(0), 3600000);
    return () => clearTimeout(timer);
  }, [attemptCount]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    const now = Date.now();
    if (now - lastAttempt < 60000 || attemptCount >= 5) {
      setError("Too many attempts. Please try again later.");
      return;
    }
    setLastAttempt(now);
    setAttemptCount((prev) => prev + 1);

    const result = await resetPassword(email);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
    }
  };

  if (success) {
    return <CheckYourEmail email={email} />;
  }

  return (
    <Box>
      <Stack
        direction="column"
        sx={{
          paddingLeft: "40px",
          paddingTop: "40px",
          paddingBottom: "30px",
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <ArrowBackIcon
          fontSize="large"
          sx={{ color: "white", marginBottom: " 30px" }}
          onClick={() => navigate(-1)}
        />
        <Box>
          <Typography
            variant="h3"
            sx={{
              alignContent: "center",
              display: "flex",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Forgot Password
          </Typography>
          <Typography
            variant="h5"
            sx={{
              alignContent: "center",
              display: "flex",
              color: "gray",
              paddingTop: "10px",
            }}
          >
            Please enter your email to reset your password. We'll send you a
            link to reset your password.
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="column"
        sx={{
          paddingLeft: "40px",
          alignContent: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <form onSubmit={handleResetPassword}>
          <Typography
            variant="h4"
            sx={{
              alignContent: "center",
              display: "flex",
              fontWeight: "bold",
              color: "white",
              paddingBottom: "15px",
            }}
          >
            Your Email
          </Typography>
          <TextField
            label="Enter your email"
            name="email"
            type="email"
            value={email}
            variant="outlined"
            sx={{ width: "400px", paddingBottom: "30px" }}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Stack
            direction="column"
            sx={{
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{ borderRadius: "10px", width: "200px" }}
            >
              Reset Password
            </Button>
          </Stack>
        </form>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ForgotPassword;
