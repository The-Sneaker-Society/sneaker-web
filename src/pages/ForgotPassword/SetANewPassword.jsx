import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "../../context/AuthContextv2";
import { useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { FirebaseAuth } from "../../auth/firebase";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";

const SetANewPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter")
      .matches(/[0-9]/, "Password must contain at least one number.")
      .required("Enter a password."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your new password."),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setError("");
      setLoading(true);
      try {
        const actionCode = new URLSearchParams(window.location.search).get(
          "oobCode"
        );
        await confirmPasswordReset(FirebaseAuth, actionCode, values.password);
        navigate("/successfulpage");
      } catch (error) {
        setError("An error occurred. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

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
          aria-label="Go back"
        />
        <Box>
          <Typography
            variant="h3"
            sx={{
              alignContent: "center",
              display: "flex",
              fontWeight: "bold",
              color: "white",
              marginBottom: "20px",
            }}
          >
            Set a new password
          </Typography>
          <Typography variant="h5" sx={{ color: "gray", marginBottom: "20px" }}>
            Create a new password. Ensure it differs from previous ones for
            security.
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Typography
              variant="h4"
              sx={{
                alignContent: "center",
                display: "flex",
                fontWeight: "bold",
                color: "white",
                marginBottom: "10px",
              }}
            >
              Password
            </Typography>
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              variant="outlined"
              required
              sx={{ width: "400px", marginBottom: "15px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visbility"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Typography
              variant="h4"
              sx={{
                alignContent: "center",
                display: "flex",
                fontWeight: "bold",
                color: "white",
                marginBottom: "10px",
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              required
              variant="outlined"
              sx={{ width: "400px", paddingBottom: "30px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visbility"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Stack
              direction="column"
              sx={{
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{ borderRadius: "10px", width: "200px" }}
              >
                {loading ? <CircularProgress size={24} /> : "Update Password"}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default SetANewPassword;
