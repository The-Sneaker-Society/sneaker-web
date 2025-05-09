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
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_MEMBER } from "./signup";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { TEST_QUERY } from "../../context/graphql/testQuery";
import { CREATE_MEMBER } from "../SignUpMemberPage/graphql/addMember";

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

const MemberSignupPage = () => {
  const navigate = useNavigate();
  const { data: testData } = useQuery(TEST_QUERY);

  const { user } = useUser();


  const handleSubmit = async (values) => {
    try {
      await createMember({
        variables: {
          data: {
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            firstName: values.firstName,
            lastName: values.lastName,
            addressLineOne: values.addressLineOne,
            addressLineTwo: values.addressLineTwo,
            zipcode: values.zipcode,
            state: values.state,
            phoneNumber: values.phoneNumber,
          },
        },
      });
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  const [createMember, { data, loading }] = useMutation(CREATE_MEMBER);

  if (loading) {
    return <>loading</>;
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
          Contact Info
        </Typography>
        <Formik
          initialValues={{
            email: user.emailAddresses || "",
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
              <Box sx={{ paddingTop: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    color: "black",
                    backgroundColor: "gold",
                  }}
                >
                  Submit
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

export default MemberSignupPage;
