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
import { GET_CONTRACT_BY_ID } from "../context/graphql/getContractDetails";

const UPDATE_MEMBER_NOTES = gql`
  mutation UpdateContract($id: ID!, $data: UpdateContractInput!) {
    updateContract(id: $id, data: $data)
  }
`;

const FormikTextArea = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const isError = meta.touched && meta.error;

  return (
    <TextField
      {...field}
      {...props}
      multiline
      rows={5}
      error={isError}
      helperText={isError ? meta.error : props.helperText}
      fullWidth
      sx={{
        mb: 2,
        textarea: { color: "white" },
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

const MemberNotesModal = ({ open, onClose, contractId, existingNotes }) => {
  const [updateMemberNotes] = useMutation(UPDATE_MEMBER_NOTES, {
    refetchQueries: [
      {
        query: GET_CONTRACT_BY_ID,
        variables: { id: contractId },
      },
    ],
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const validationSchema = Yup.object({
    memberNotes: Yup.string().required("Notes cannot be empty"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { data } = await updateMemberNotes({
        variables: {
          id: contractId,
          data: {
            repairDetails: {
              memberNotes: values.memberNotes,
            },
          },
        },
      });

      if (data?.updateContract === true) {
        setErrorMessage(null);
        resetForm();
        onClose();
      }
    } catch (error) {
      setErrorMessage(error.message);
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
          {existingNotes ? "Edit Member Notes" : "Add Member Notes"}
        </Typography>
        <Formik
          initialValues={{ memberNotes: existingNotes || "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}
              <FormikTextArea
                name="memberNotes"
                label="Member Notes"
                autoFocus
              />
              <Box textAlign="center" mt={2}>
                <StyledButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} /> : "Save"}
                </StyledButton>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default MemberNotesModal;
