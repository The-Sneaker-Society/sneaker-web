import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import ShoeInfoStep from "./ShoeInfoStep";
import ImageUploadStep from "./ImageUploadStep";
import ConfirmationStep from "./ConfirmStep";

const ShoeInfoSchema = Yup.object().shape({
  shoeDetails: Yup.object().shape({
    brand: Yup.string().required("Brand is required"),
    model: Yup.string().required("Model is required"),
    color: Yup.string().required("Color is required"),
    size: Yup.string().required("Size is required"),
    clientNotes: Yup.string().required("Please explain your repair request"),
  }),
});

const initialValues = {
  shoeDetails: {
    brand: "nike",
    model: "otheraash",
    color: "red",
    size: "12",
    clientNotes: "sdigasf",
    photos: {
      leftSide: [],
      rightSide: [],
      topView: [],
      bottomView: [],
      frontView: [],
      backView: [],
      other: [],
    },
  },
};

export const ContractForm = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Shoe Information", "Image Upload", "Confirmation"];

  const validationSchemas = [ShoeInfoSchema];

  const handleNext = (values, { setTouched, setSubmitting }) => {
    setTouched({});
    setSubmitting(false);
    console.log(`Step ${activeStep + 1} Values:`, values);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (values) => {
    console.log("Final Form Values:", values);
    // Handle final form submission
  };

  const getStepContent = (step, formik) => {
    switch (step) {
      case 0:
        return <ShoeInfoStep formik={formik} />;
      case 1:
        return <ImageUploadStep formik={formik} />;
      case 2:
        return <ConfirmationStep formik={formik} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box mt={4}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[activeStep]}
          onSubmit={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          enableReinitialize
        >
          {(formik) => (
            <Form>
              {getStepContent(activeStep, formik)}
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack}>
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formik.isSubmitting}
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};
