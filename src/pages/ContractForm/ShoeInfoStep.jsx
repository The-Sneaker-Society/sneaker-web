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

const soleContionOptions = ["None", "Light wear", "Heavy wear", "Poor"];

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

      <FormikTextField
        label="Material"
        name="shoeDetails.material"
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

      <FormControl fullWidth margin="normal">
        <InputLabel id="sole-condition-label">Sole Condition</InputLabel>
        <Field
          as={Select}
          labelId="sole-condition-label"
          id="shoeDetails.soleCondition"
          name="shoeDetails.soleCondition"
          label="Sole Condition"
          error={
            formik.touched.shoeDetails?.soleCondition &&
            Boolean(formik.errors.shoeDetails?.soleCondition)
          }
        >
          {soleContionOptions.map((condition) => (
            <MenuItem key={condition} value={condition.toLocaleLowerCase()}>
              {condition}
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
