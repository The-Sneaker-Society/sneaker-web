import React, { useState } from "react";
import {
  TextField,
  Typography,
  Container,
  Grid,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import * as Yup from "yup";
import StyledButton from "../pages/HomePage/StyledButton";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTRACT_DETAILS } from "./graphql/getContractDetails";
import { UPDATE_SHIPPING_INFO } from "./graphql/updateShippingInfo";

const FormikTextField = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const isError = meta.touched && meta.error;

  return (
    <TextField
      {...field}
      {...props}
      error={isError}
      helperText={isError ? meta.error : props.helperText}
      fullWidth
      sx={{
        mb: 2,
        input: { color: "white" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#fff" },
          "&:hover fieldset": { borderColor: "#FFD700" },
        },
      }}
      InputLabelProps={{ style: { color: "#aaa" } }}
    />
  );
};

const ShippingInfo = () => {
  const { data, loading, error, refetch } = useQuery(GET_CONTRACT_DETAILS);
  const [updateShipping] = useMutation(UPDATE_SHIPPING_INFO);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validationSchema = Yup.object({
    carrier: Yup.string().required("Carrier is required"),
    trackingNumber: Yup.string().required("Tracking number is required"),
  });

  if (loading) return <CircularProgress />;
  if (error)
    return <Alert severity="error">Error loading contract data.</Alert>;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { data } = await updateShipping({
        variables: {
          data: {
            carrier: values.carrier,
            trackingNumber: values.trackingNumber,
          },
        },
        update: (cache, { data: { updateShippingInfo } }) => {
          cache.writeQuery({
            query: GET_CONTRACT_DETAILS,
            data: { contractDetails: updateShippingInfo },
          });
        },
      });

      if (data?.updateShippingInfo) {
        setSuccessMessage("Shipping updated successfully");
        setErrorMessage(null);
        refetch(); // Refetch the current member data
      } else {
        throw new Error("Failed to shipping ingo");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h1"
          color="white"
          fontWeight="800"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Shipping Info
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Formik
          initialValues={{
            carrier: "",
            trackingNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormikTextField
                name="carrier"
                label="Shipping Carrier"
                variant="outlined"
                fullWidth
              />
              <FormikTextField
                name="trackingNumber"
                label="Tracking Number"
                variant="outlined"
                fullWidth
              />
              <StyledButton
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Confirm"}
              </StyledButton>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default ShippingInfo;
