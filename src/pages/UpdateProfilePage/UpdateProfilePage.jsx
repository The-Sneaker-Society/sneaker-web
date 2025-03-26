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
import { CURRENT_MEMBER, UPDATE_MEMBER } from "./graphql/updateMember";
import { useQuery, useMutation } from "@apollo/client";

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
  const {
    data: currentMemberData,
    loading: currentMemberLoading,
    error: currentMemberError,
    refetch,
  } = useQuery(CURRENT_MEMBER);
  const [updateMember] = useMutation(UPDATE_MEMBER);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validationSchema = Yup.object({
    firstName: Yup.string(),
    lastName: Yup.string(),
    addressLineOne: Yup.string(),
    addressLineTwo: Yup.string(),
    zipcode: Yup.string(),
    state: Yup.string(),
    phoneNumber: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await updateMember({
        variables: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            addressLineOne: values.addressLineOne,
            addressLineTwo: values.addressLineTwo,
            zipcode: values.zipcode,
            state: values.state,
            phoneNumber: values.phoneNumber,
          },
        },
        update: (cache, { data: { updateMember } }) => {
          cache.writeQuery({
            query: CURRENT_MEMBER,
            data: { currentMember: updateMember },
          });
        },
      });

      if (data.updateMember) {
        setSuccessMessage("Profile updated successfully");
        setErrorMessage(null);
        refetch(); // Refetch the current member data
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  if (currentMemberLoading) {
    return <CircularProgress />;
  }
  if (currentMemberError) {
    return (
      <Alert severity="error">
        Error loading profile data. Please try again later.
      </Alert>
    );
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
            email: currentMemberData?.currentMember?.email || "",
            firstName: currentMemberData?.currentMember?.firstName || "",
            lastName: currentMemberData?.currentMember?.lastName || "",
            addressLineOne:
              currentMemberData?.currentMember?.addressLineOne || "",
            addressLineTwo:
              currentMemberData?.currentMember?.addressLineTwo || "",
            zipcode: currentMemberData?.currentMember?.zipcode || "",
            state: currentMemberData?.currentMember?.state || "",
            phoneNumber: currentMemberData?.currentMember?.phoneNumber || "",
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
