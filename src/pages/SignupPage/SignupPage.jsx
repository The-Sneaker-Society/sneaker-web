import React, { useState } from "react";
import { Formik, Form, useField } from "formik";
import {
  Button,
  Typography,
  Grid,
  TextField,
  Container,
  Alert,
  Box,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPDATE_MEMBER } from "./signup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContextv2";

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

const SignupPage = () => {
  const navigate = useNavigate();

  const { user, refetchUser } = useAuth();

  const handleSubmit = async (values) => {
    try {
      await updateMember({
        variables: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            addressLineOne: values.addressLineOne,
            addressLineTwo: values.addressLineTwo,
            zipcode: values.zipcode,
            state: values.state,
            phoneNumber: values.phoneNumber,
            isNewUser: false,
          },
        },
      });
      await refetchUser();
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  const [updateMember, { data, loading }] = useMutation(UPDATE_MEMBER);

  if (loading) {
    return <>loading</>;
  }

  return (
    <Container maxWidth="md" sx={{ height: "100vh" }}>
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography pb={4} variant="h1">
          More User Info
        </Typography>
        <Formik
          initialValues={{
            email: user.email || "",
            firstName: "",
            lastName: "",
            addressLineOne: "",
            addressLineTwo: "",
            zipcode: "",
            state: "",
            phoneNumber: "",
          }}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors = {};

            if (!values.firstName) {
              errors.firstName = "First Name is required";
            }

            if (!values.lastName) {
              errors.lastName = "Last Name is required";
            }

            if (!values.zipcode) {
              errors.zipcode = "Zipcode is required";
            }

            return errors;
          }}
        >
          {() => (
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
                    helperText="Optional"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="addressLineTwo"
                    label="Address Line 2"
                    variant="outlined"
                    fullWidth
                    helperText="Optional"
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
                <Button type="submit" variant="contained" color="primary">
                  Sign Up
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        {errorMessage ? (
          <Alert severity="error" color="error">
            {errorMessage}
          </Alert>
        ) : null}
      </div>
    </Container>
  );
};

export default SignupPage;
