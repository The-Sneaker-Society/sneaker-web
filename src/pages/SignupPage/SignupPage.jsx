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

import { UPDATE_MEMBER } from "./signup";
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

const validateMemberProfile = (values) => {
  const errors = {};

  if (!values.businessName.trim()) {
    errors.businessName = "Business name is required";
  }

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

const MemberSignupPage = ({ onComplete }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const colors = useColors();
  const { isLoaded, user } = useUser();

  const [updateMember, { loading }] = useMutation(UPDATE_MEMBER, {
    onCompleted: () => {
      if (typeof onComplete === "function") {
        onComplete();
        return;
      }

      navigate("/dashboard", { replace: true });
    },
  });

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  const handleSubmit = async (values) => {
    try {
      setErrorMessage("");

      await updateMember({
        variables: {
          data: {
            businessName: values.businessName.trim(),
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
    } catch (error) {
      setErrorMessage(
        error?.graphQLErrors?.[0]?.message ||
          error?.networkError?.message ||
          error?.message ||
          "We could not save your business profile. Please try again.",
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
                Business profile setup
              </Typography>

              <Typography component="h1" variant="h3">
                Tell us about your business
              </Typography>

              <Typography color={colors.textSecondary} variant="body1">
                This information helps you establish your professional profile
                on The Sneaker Society. You can update details later.
              </Typography>
            </Stack>

            <Formik
              enableReinitialize
              initialValues={{
                email,
                businessName: "",
                firstName: "",
                lastName: "",
                addressLineOne: "",
                addressLineTwo: "",
                zipcode: "",
                state: "",
                phoneNumber: "",
              }}
              onSubmit={handleSubmit}
              validate={validateMemberProfile}
            >
              {({ isValid, dirty }) => (
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

                    <Grid item xs={12}>
                      <FormikTextField
                        autoComplete="organization"
                        fullWidth
                        label="Business name"
                        name="businessName"
                        required
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
                          ? "Saving business profile..."
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

export default MemberSignupPage;
