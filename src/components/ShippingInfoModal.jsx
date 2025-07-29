import { useState } from "react";
import {
  TextField,
  CircularProgress,
  Alert,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import StyledButton from "../pages/HomePage/StyledButton";
import { useMutation } from "@apollo/client";
import { Formik, Form, useField } from "formik";
import { gql } from "@apollo/client";

const UPDATE_SHIPPING_INFO = gql`
  mutation UpdateShippingInfo($data: ShippingInput!) {
    updateShippingInfo(data: $data) {
      trackingNumber
      carrier
    }
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
      fullWidth
      sx={{
        mb: 2,
        input: { color: "white" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "#fff" },
          "&:hover fieldset": { borderColor: "#FFD700" },
          borderRadius: "8px",
          padding: "10px 15px",
        },
      }}
      InputLabelProps={{ style: { color: "#aaa" } }}
    />
  );
};

const ShippingInfoModal = ({ open, onClose, onSuccess }) => {
  const [updateShipping] = useMutation(UPDATE_SHIPPING_INFO, {
    refetchQueries: [{ query: GET_CONTRACT_BY_ID }],
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validationSchema = Yup.object({
    carrier: Yup.string().required("Carrier is required"),
    trackingNumber: Yup.string().required("Tracking number is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { data } = await updateShipping({
        variables: {
          data: {
            carrier: values.carrier,
            trackingNumber: values.trackingNumber,
          },
        },
      });

      if (data?.updateShippingInfo) {
        setSuccessMessage("Shipping updated successfully");
        setErrorMessage(null);
        resetForm();
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "#000",
          color: "#fff",
          borderRadius: "16px",
          p: 4,
          boxShadow: 24,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Update Shipping Info
        </Typography>
        <Formik
          initialValues={{ carrier: "", trackingNumber: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {successMessage}
                </Alert>
              )}
              <FormikTextField
                name="carrier"
                label="Shipping Carrier"
                autoFocus
              />
              <FormikTextField name="trackingNumber" label="Tracking Number" />
              <Box textAlign="center" mt={2}>
                <StyledButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Confirm"}
                </StyledButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default ShippingInfoModal;
