import React, { useEffect, useState } from "react";
import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
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

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  // Update profile done through mutation
  const { user, handleUpdateProfile, handleChangePassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const validationSchema = Yup.object({
    firstName: Yup.string(),
    lastName: Yup.string(),
    addressLineOne: Yup.string(),
    addressLineTwo: Yup.string(),
    zipcode: Yup.string(),
    state: Yup.string(),
    phoneNumber: Yup.string(),
    currentPassword: Yup.string().when("newPassword", {
      is: (value) => Boolean(value),
      then: (schema) =>
        schema.required("Current password is required to change the password"),
    }),
    newPassword: Yup.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: Yup.string().when("newPassword", {
      is: (value) => Boolean(value),
      then: (schema) =>
        schema.oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
  });

  const handleSubmit = async (values, { setSubmitting, setValues }) => {
    try {
      const profileData = {};
      const fields = [
        "firstName",
        "lastName",
        "addressLineOne",
        "addressLineTwo",
        "zipcode",
        "state",
        "phoneNumber",
      ];

      fields.forEach((field) => {
        if (values[field] !== user[field]) {
          profileData[field] = values[field];
        }
      });

      if (Object.keys(profileData).length > 0) {
        await handleUpdateProfile(profileData);
      }

      if (values.newPassword) {
        await handleChangePassword(values.currentPassword, values.newPassword);
      }

      setSuccessMessage("Profile updated successfully");
      setErrorMessage(null);
      setValues({
        ...values,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", alignItems: "start" }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          marginLeft: "20px",
          width: "100%",
        }}
      >
        <Typography
          pb={2}
          variant="h1"
          sx={{
            fontWeight: "bold",
          }}
        >
          Update Profile
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ width: "100%", marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ width: "100%", marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}
        <Formik
          initialValues={{
            email: user?.email || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            addressLineOne: user?.addressLineOne || "",
            addressLineTwo: user?.addressLineTwo || "",
            zipcode: user?.zipcode || "",
            state: user?.state || "",
            phoneNumber: user?.phoneNumber || "",
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikTextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormikTextField
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormikTextField
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="addressLineOne"
                    label="Address Line 1"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="addressLineTwo"
                    label="Address Line 2"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormikTextField
                    name="zipcode"
                    label="Zipcode"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormikTextField
                    name="state"
                    label="State"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="phoneNumber"
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="currentPassword"
                    label="Current Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="newPassword"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    color: "black",
                    backgroundColor: "gold",
                    marginTop: "30px",
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default UpdateProfilePage;
