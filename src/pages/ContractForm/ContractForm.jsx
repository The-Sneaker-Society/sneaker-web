import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
} from "@mui/material";

export const ContractForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  // const [state, dispatch] = useReducer(formReducer, initialState);

  const steps = [
    "Shoe Information",
    "Repair Details",
    "Image Upload",
    "Confirmation",
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    console.log("Form submitted:", state);
    // Handle form submission
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Typography variant="h1">Shoe info</Typography>;
      case 1:
        return <Typography variant="h1">Repair details</Typography>;
      case 2:
        return <Typography variant="h1">Images</Typography>;
      case 3:
        return <Typography variant="h1">Confirm</Typography>;
      default:
        return "Unknown step";
    }
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={4}>
          {getStepContent(activeStep)}
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                activeStep === steps.length - 1 ? handleSubmit : handleNext
              }
            >
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};
