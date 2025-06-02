import React, { useState, useEffect } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import MemberSignupPage from "../SignupPage/SignupPage";
import { StripeOnobarding } from "./StripeOnboarding";
import { Subscriptions } from "../PaymentStatus/Subscriptions";
import { useSneakerMember } from "../../context/MemberContext";
import { useNavigate } from "react-router-dom";
import { LoadingCircle } from "../../components/Loaing";

export const OnboardMember = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Info", "Stripe account Creation", "Subscription"];
  const [isLoadingInitialStep, setIsLoadingInitialStep] = useState(true);
  const {
    member,
    loading: memberLoading,
    error: memberError,
  } = useSneakerMember();
  const navigate = useNavigate();

  useEffect(() => {
    // This console log is very helpful for debugging step transitions
    console.log(
      "OnboardMember useEffect. MemberLoading:",
      memberLoading,
      "Member:",
      member
        ? {
            firstName: member.firstName,
            stripeConnectAccountId: member.stripeConnectAccountId,
            isSubscribed: member.isSubscribed,
          }
        : null
    );

    if (!memberLoading && member) {
      let determinedStep = 0;
      if (member.firstName) {
        // Basic info submitted
        determinedStep = 1;
        if (member.isOnboardedWithStripe) {
          // Stripe account linked
          determinedStep = 2;
          if (member.isSubscribed) {
            // Subscription active
            determinedStep = 3; // All done
          }
        }
      }

      console.log("Determined step based on member data:", determinedStep);

      if (determinedStep >= steps.length) {
        console.log("All steps complete, navigating to dashboard.");
        navigate("/member/dashboard", { replace: true });
      } else {
        setActiveStep(determinedStep);
      }
      setIsLoadingInitialStep(false);
    } else if (!memberLoading && (memberError || !member)) {
      console.error(
        "OnboardMember: Error loading member data or member is null.",
        { memberError, member }
      );
      setIsLoadingInitialStep(false);
      setActiveStep(0); // Default to first step on error or no member
    }
    // Not including steps.length in dependencies as it's constant for this component instance
  }, [member, memberLoading, memberError, navigate]);

  const handleNext = () => {
    console.log("handleNext called from activeStep:", activeStep);
    setActiveStep((prevActiveStep) => {
      const nextStep = prevActiveStep + 1;
      if (nextStep >= steps.length) {
        navigate("/member/dashboard", { replace: true });
        return prevActiveStep; // Or return steps.length to show completion message if no redirect
      }
      return nextStep;
    });
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <MemberSignupPage onComplete={handleNext} />;
      case 1:
        // StripeOnobarding might redirect externally. If it does, the useEffect
        // will handle picking up the correct step when the user returns and member data is updated.
        // If StripeOnobarding can complete its task and then call onComplete without a full page redirect away from this flow,
        // then onComplete={handleNext} is useful.
        return <StripeOnobarding />;
      case 2:
        return <Subscriptions />;
      default:
        // This should ideally not be reached if redirection happens correctly
        return (
          <Typography variant="h5" align="center" sx={{ mt: 4 }}>
            Onboarding complete! Redirecting...
          </Typography>
        );
    }
  };

  if (isLoadingInitialStep) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <LoadingCircle />
      </Box>
    );
  }

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
