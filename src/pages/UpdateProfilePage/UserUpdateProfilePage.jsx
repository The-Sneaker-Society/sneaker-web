import React, { useState } from "react";
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
  Alert,
} from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";

const CURRENT_USER_PROFILE = gql`
  query CurrentUserProfile {
    currentUser {
      id
      email
      firstName
      lastName
      addressLineOne
      addressLineTwo
      city
      country
      zipcode
      state
      phoneNumber
    }
  }
`;

const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($data: UpdateUserInput!) {
    updateUser(data: $data)
  }
`;

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

/**
 * Client-side counterpart to the member UpdateProfilePage (which queries
 * currentMember). Users previously landed on the member form and ate
 * role-guard errors.
 */
const UserUpdateProfilePage = () => {
  const { data, loading, error, refetch } = useQuery(CURRENT_USER_PROFILE, {
    fetchPolicy: "network-only",
  });
  const [updateUser] = useMutation(UPDATE_USER_PROFILE);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validationSchema = Yup.object({
    firstName: Yup.string(),
    lastName: Yup.string(),
    addressLineOne: Yup.string(),
    addressLineTwo: Yup.string(),
    city: Yup.string(),
    country: Yup.string(),
    zipcode: Yup.string(),
    state: Yup.string(),
    phoneNumber: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data: result } = await updateUser({
        variables: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            addressLineOne: values.addressLineOne,
            addressLineTwo: values.addressLineTwo,
            city: values.city,
            country: values.country || "US",
            zipcode: values.zipcode,
            state: values.state,
            phoneNumber: values.phoneNumber,
          },
        },
      });

      if (result.updateUser) {
        setSuccessMessage("Profile updated successfully");
        setErrorMessage(null);
        refetch();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      setErrorMessage(err.message);
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return (
      <Alert severity="error">
        Error loading profile data. Please try again later.
      </Alert>
    );
  }

  const profile = data?.currentUser;

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
        <Typography variant="body2" color="text.secondary" mb={3}>
          Street, city, and zip are required for shipping labels.
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
            email: profile?.email || "",
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            addressLineOne: profile?.addressLineOne || "",
            addressLineTwo: profile?.addressLineTwo || "",
            city: profile?.city || "",
            country: profile?.country || "US",
            zipcode: profile?.zipcode || "",
            state: profile?.state || "",
            phoneNumber: profile?.phoneNumber || "",
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
                    name="city"
                    label="City"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormikTextField
                    name="country"
                    label="Country"
                    variant="outlined"
                    fullWidth
                    helperText="US by default"
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
              </Grid>
              <Box sx={{ paddingTop: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{ color: "black", backgroundColor: "gold" }}
                >
                  {isSubmitting ? "Saving…" : "Save"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default UserUpdateProfilePage;
