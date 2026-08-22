import React, { useState } from "react";
import { Form, Formik, useField } from "formik";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/clerk-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { CREATE_USER } from "../SignUpMemberPage/graphql/addUser";
import { useColors } from "../../theme/colors";

const FormikTextField = ({ name, helperText, ...props }) => {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <TextField
      {...field}
      {...props}
      error={hasError}
      helperText={hasError ? meta.error : helperText}
    />
  );
};

const validateClientProfile = (values) => {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!values.zipcode.trim()) {
    errors.zipcode = "ZIP code is required";
  }

  return errors;
};

const UserSignupPage = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const colors = useColors();
  const { isLoaded, user } = useUser();

  const [createUser, { loading }] = useMutation(CREATE_USER);

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  const handleSubmit = async (values) => {
    try {
      setErrorMessage("");

      if (!user?.id) {
        throw new Error(
          "Your session is unavailable. Please sign in again and retry.",
        );
      }

      await createUser({
        variables: {
          data: {
            clerkId: user.id,
            email,
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            addressLineOne: values.addressLineOne.trim(),
            addressLineTwo: values.addressLineTwo.trim(),
            zipcode: values.zipcode.trim(),
            state: values.state.trim(),
            phoneNumber: values.phoneNumber.trim(),
          },
        },
      });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.graphQLErrors?.[0]?.message ||
          error?.networkError?.message ||
          error?.message ||
          "We could not create your client profile. Please try again.",
      );
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
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        minHeight: "100vh",
        py: { xs: 3, sm: 5 },
      }}
    >
      <Container maxWidth="md">
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
              p: { xs: 3, sm: 5 },
            }}
          >
            <Stack spacing={1.5} sx={{ mb: 4 }}>
              <Typography
                color="primary.main"
                fontWeight={800}
                variant="overline"
              >
                Client account setup
              </Typography>

              <Typography component="h1" variant="h3">
                Tell us a little about yourself
              </Typography>

              <Typography color={colors.textSecondary} variant="body1">
                Complete your client profile to connect with sneaker-service
                professionals and manage your service inquiries.
              </Typography>
            </Stack>

            <Formik
              enableReinitialize
              initialValues={{
                email,
                firstName: "",
                lastName: "",
                addressLineOne: "",
                addressLineTwo: "",
                zipcode: "",
                state: "",
                phoneNumber: "",
              }}
              onSubmit={handleSubmit}
              validate={validateClientProfile}
            >
              {({ dirty, isValid }) => (
                <Form noValidate>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <FormikTextField
                        disabled
                        fullWidth
                        label="Account email"
                        name="email"
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <FormikTextField
                        autoComplete="given-name"
                        fullWidth
                        label="First name"
                        name="firstName"
                        required
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <FormikTextField
                        autoComplete="family-name"
                        fullWidth
                        label="Last name"
                        name="lastName"
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormikTextField
                        autoComplete="address-line1"
                        fullWidth
                        label="Address line 1"
                        name="addressLineOne"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormikTextField
                        autoComplete="address-line2"
                        fullWidth
                        label="Address line 2"
                        name="addressLineTwo"
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <FormikTextField
                        autoComplete="postal-code"
                        fullWidth
                        inputProps={{ inputMode: "numeric" }}
                        label="ZIP code"
                        name="zipcode"
                        required
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <FormikTextField
                        autoComplete="address-level1"
                        fullWidth
                        label="State"
                        name="state"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormikTextField
                        autoComplete="tel"
                        fullWidth
                        inputProps={{ inputMode: "tel" }}
                        label="Phone number"
                        name="phoneNumber"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        disabled={loading || !dirty || !isValid}
                        fullWidth
                        startIcon={
                          loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null
                        }
                        sx={{ minHeight: 48, mt: 1 }}
                        type="submit"
                        variant="contained"
                      >
                        {loading
                          ? "Creating your profile..."
                          : "Save and continue"}
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>

            {errorMessage && (
              <Alert
                onClose={() => setErrorMessage("")}
                severity="error"
                sx={{ mt: 3 }}
              >
                {errorMessage}
              </Alert>
            )}
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default UserSignupPage;
