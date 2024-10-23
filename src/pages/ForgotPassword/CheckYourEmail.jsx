import React, { useState } from "react";
import {
  Typography,
  Button,
  Box,
  Stack,
  Link,
  TextField,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { verifyPasswordResetCode } from "firebase/auth";

const CheckYourEmail = ({ email }) => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerifyCode = async () => {
    setError("");
    setSuccess("");
    try {
      const result = await verifyPasswordResetCode(verificationCode);
      if (result.success) {
        setSuccess("Code verified successfully!");
        navigate("/passwordreset", {
          state: {
            code: verificationCode,
          },
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again");
    }
  };

  const handleResendEmail = async () => {
    setError("");
    setSuccess("");
    try {
      const result = await resendPasswordResetEmail(email);
      if (result.success) {
        setSuccess("Password reset email resent successfully!");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

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
            Check your email
          </Typography>
          <Typography
            variant="h5"
            sx={{
              alignContent: "center",
              display: "flex",
              color: "white",
              paddingTop: "10px",
            }}
          >
            We sent a reset link to {email}. Click the link to reset your
            password.
          </Typography>
        </Box>
        <Stack direction="row" sx={{ marginTop: "20px" }}>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              marginRight: "5px",
            }}
          >
            Haven't got the email yet?
          </Typography>
          <Link
            variant="h5"
            sx={{
              color: "white",
            }}
            onClick={handleResendEmail}
          >
            Resend Email
          </Link>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default CheckYourEmail;
