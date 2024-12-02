import React, { useState } from "react";
import Logo from "../../assets/ss-logo.svg";
import GoogleIcon from "@mui/icons-material/Google";
import { Formik, Form, useField } from "formik";
import { useNavigate } from "react-router-dom";
import { Button, Alert, Grid, TextField, Stack, Box } from "@mui/material";
import * as Yup from "yup";
import { useAuth } from "../../context/AuthContext";

const FormikTextField = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const isError = meta.touched && meta.error;
  return (
    <TextField
      {...field}
      {...props}
      error={isError}
      helperText={isError ? meta.error : props.helperText}
    />
  );
};

const SignupMember = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { handleSignupWithEmailAndPassword, handleGoogleLogin } = useAuth();

  const handleLogin = async (type, values) => {
    try {
      switch (type) {
        case "google":
          await handleGoogleLogin();
          break;
        case "email":
          await handleSignupWithEmailAndPassword(values.email, values.password);
          break;
        default:
          break;
      }
      navigate("/signup");
    } catch (error) {
      setError(error.message);
      console.log(errorCode, errorMessage);
    }
  };

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikTextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                  <FormikTextField
                    name="password"
                    label="Password"
                    type="Password"
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </Grid>
              <Stack>
                <Button
                  type="submit"
                  variant="contained"
                  aria-label="Sign Up"
                  sx={{ mt: 2, color: "black", backgroundColor: "gold" }}
                  onClick={() => {
                    handleLogin("email", values);
                  }}
                >
                  SIGN UP
                </Button>
                <Button
                  variant="contained"
                  aria-label="Sign Up With Google"
                  startIcon={<GoogleIcon />}
                  sx={{ mt: 2, color: "black", backgroundColor: "gold" }}
                  onClick={() => handleLogin("google")}
                >
                  SIGN UP WITH GOOGLE
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
        {error && (
          <Alert severity="error" color="error">
            {error}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default SignupMember;
