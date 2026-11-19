import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";

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

const fields = [
  { name: "email", label: "Email", disabled: true, fullRow: true },
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "addressLineOne", label: "Address Line 1", fullRow: true },
  { name: "addressLineTwo", label: "Address Line 2", fullRow: true },
  { name: "city", label: "City" },
  {
    name: "country",
    label: "Country",
    helperText: "US by default",
  },
  { name: "zipcode", label: "ZIP Code" },
  { name: "state", label: "State" },
  { name: "phoneNumber", label: "Phone Number", fullRow: true },
];

const FormikTextField = ({ name, ...props }) => {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <TextField
      {...field}
      {...props}
      error={hasError}
      helperText={hasError ? meta.error : props.helperText}
      fullWidth
    />
  );
};

const UserProfileForm = ({ profile, onSubmit, onCancel, errorMessage }) => {
  return (
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
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box
            component="fieldset"
            disabled={isSubmitting}
            sx={{
              m: 0,
              p: 0,
              border: 0,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
              }}
            >
              {fields.map(({ fullRow, ...field }) => (
                <Box
                  key={field.name}
                  sx={{
                    minWidth: 0,
                    gridColumn: fullRow ? "1 / -1" : "auto",
                  }}
                >
                  <FormikTextField {...field} variant="outlined" />
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
                sx={{
                  color: "#000",
                  bgcolor: "primary.main",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={isSubmitting}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default UserProfileForm;
