import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  Checkbox,
  Grid,
  Paper,
  Divider,
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

const soleConditionOptions = ["None", "Light wear", "Heavy wear", "Poor"];

const ShoeInfoStep = ({ formik }) => {
  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          Shoe Information
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5}>
          Tell us about your sneakers
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Shoe Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="brand-label">Brand</InputLabel>
              <Field
                as={Select}
                labelId="brand-label"
                name="shoeDetails.brand"
                label="Brand"
                required
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormikTextField
              label="Model"
              name="shoeDetails.model"
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormikTextField
              label="Color"
              name="shoeDetails.color"
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormikTextField
              label="Material"
              name="shoeDetails.material"
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="size-label">Size (US)</InputLabel>
              <Field
                as={Select}
                labelId="size-label"
                name="shoeDetails.size"
                label="Size (US)"
                required
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" required>
              <InputLabel id="sole-condition-label">Sole Condition</InputLabel>
              <Field
                as={Select}
                labelId="sole-condition-label"
                name="shoeDetails.soleCondition"
                label="Sole Condition"
                required
                error={
                  formik.touched.shoeDetails?.soleCondition &&
                  Boolean(formik.errors.shoeDetails?.soleCondition)
                }
              >
                {soleConditionOptions.map((condition) => (
                  <MenuItem key={condition} value={condition.toLocaleLowerCase()}>
                    {condition}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormikTextField
              label="Year"
              name="shoeDetails.year"
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="odor-label">Odor Level</InputLabel>
              <Field
                as={Select}
                labelId="odor-label"
                name="shoeDetails.odorLevel"
                label="Odor Level"
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="mild">Mild</MenuItem>
                <MenuItem value="strong">Strong</MenuItem>
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="timeframe-label">Return Timeframe</InputLabel>
              <Field
                as={Select}
                labelId="timeframe-label"
                name="shoeDetails.returnTimeframe"
                label="Return Timeframe"
              >
                <MenuItem value="standard">Standard (2-3 weeks)</MenuItem>
                <MenuItem value="rush">Rush (1 week)</MenuItem>
                <MenuItem value="no-rush">No rush</MenuItem>
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Field
                  as={Checkbox}
                  name="shoeDetails.previousRepairs"
                  color="primary"
                />
              }
              label="Previous repairs"
            />
          </Grid>
          {formik.values.shoeDetails.previousRepairs && (
            <Grid item xs={12}>
              <FormikTextField
                fullWidth
                multiline
                rows={3}
                label="Describe previous repairs"
                name="shoeDetails.previousRepairsNotes"
                size="small"
              />
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" fontWeight={600} mb={2}>
          Additional Details
        </Typography>
        <FormikTextField
          fullWidth
          multiline
          rows={6}
          label="Notes about your sneakers"
          name="shoeDetails.clientNotes"
          size="small"
        />
      </Paper>
    </Box>
  );
};

export default ShoeInfoStep;
