import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField, // Import the base TextField
} from "@mui/material";
import { Field, useField } from "formik";
import brandOptions from "./config/brandOptions";
import usShoeSizes from "./config/usShoeSizeConfig";

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

const ShoeInfoStep = ({ formik }) => {
  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel id="brand-label">Brand</InputLabel>
        <Field
          as={Select}
          labelId="brand-label"
          id="shoeDetails.brand"
          name="shoeDetails.brand"
          label="Brand"
          error={
            formik.touched.shoeDetails?.brand &&
            Boolean(formik.errors.shoeDetails?.brand)
          }
        >
          {brandOptions.map((option) => (
            <MenuItem key={option} value={option.toLowerCase()}>
              {option}
            </MenuItem>
          ))}
        </Field>
      </FormControl>

      <FormikTextField
        label="Model"
        name="shoeDetails.model"
        fullWidth
        margin="normal"
      />

      <FormikTextField
        label="Color"
        name="shoeDetails.color"
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="size-label">Size (US)</InputLabel>
        <Field
          as={Select}
          labelId="size-label"
          id="shoeDetails.size"
          name="shoeDetails.size"
          label="Size (US)"
          error={
            formik.touched.shoeDetails?.size &&
            Boolean(formik.errors.shoeDetails?.size)
          }
        >
          {usShoeSizes.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Field>
      </FormControl>

      <FormikTextField
        fullWidth
        multiline
        rows={8}
        label="Detailed Repair Description"
        name="shoeDetails.clientNotes"
        required
      />
    </Box>
  );
};

export default ShoeInfoStep;
