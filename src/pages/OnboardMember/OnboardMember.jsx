import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, Button } from "@mui/material";
import MemberSignupPage from "../SignupPage/SignupPage";
import { StripeOnobarding } from "./StripeOnboarding";
import { Subscriptions } from "../PaymentStatus/Subscriptions";

export const OnboardMember = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Info", "Stripe account Creation", "Subscription"];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <MemberSignupPage onComplete={handleNext} />;
      case 1:
        return <StripeOnobarding />;
      case 2:
        return <Subscriptions />;
    }
  };

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {renderStepContent(activeStep)}
    </>
  );
};
