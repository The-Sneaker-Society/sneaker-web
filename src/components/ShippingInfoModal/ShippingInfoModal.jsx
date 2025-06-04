import { useState } from "react";
import {
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import * as Yup from "yup";
import StyledButton from "../../pages/HomePage/StyledButton";
import { useMutation } from "@apollo/client";
import { Formik, Form, useField } from "formik";
import { gql } from "@apollo/client";

const UPDATE_SHIPPING_INFO = gql`
  query UpdateShippingInfo {
    trackingNumber
    carrier
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
    refetchQueries: [{ query: GET_CONTRACT_DETAILS }],
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
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{
        ".MuiPaper-root": {
          bgcolor: "#000",
          color: "#fff",
          padding: "40px 20px",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle
        variant="h3"
        sx={{ textAlign: "center", fontWeight: "bold", color: "#fff" }}
      >
        Update Shipping Info
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ carrier: "", trackingNumber: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {errorMessage && (
                  <Grid item xs={12}>
                    <Alert severity="error">{errorMessage}</Alert>
                  </Grid>
                )}
                {successMessage && (
                  <Grid>
                    <Alert severity="success">{successMessage}</Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <FormikTextField
                    name="carrier"
                    label="Shipping Carrier"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikTextField
                    name="trackingNumber"
                    label="Tracking Number"
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <StyledButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Confirm"}
                </StyledButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingInfoModal;
