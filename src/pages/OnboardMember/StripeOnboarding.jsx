import React, { useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { GoAlertFill } from "react-icons/go";
import { gql, useMutation } from "@apollo/client";
import { isNil } from "lodash";

const ONBOARD_MEMBER_TO_STRIPE_MUTATION = gql`
  mutation OnboardMemberToStripe {
    onboardMemberToStripe
  }
`;

const RESUME_ONBOARDING = gql`
  mutation ResumeAccountOnboarding {
    resumeAccountOnboarding
  }
`;

export const StripeOnobarding = ({ member }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [onboardMemberToStripe, { loading: onboardLoading }] = useMutation(
    ONBOARD_MEMBER_TO_STRIPE_MUTATION
  );
  const [resumeAccountOnboarding, { loading: resumeOnboardLoading }] =
    useMutation(RESUME_ONBOARDING);

  const buttonText = !member.stripeConnectAccountId
    ? "Set up Stripe"
    : "Resume Stripe Setup";

  const handleStripeAccountClick = async () => {
    // Guard clause: ensure member exists before trying to access its properties
    if (!member) {
      console.error(
        "Stripe action cannot be performed: member data is not available."
      );
      // Optionally, provide user feedback here (e.g., set an error message state)
      return;
    }

    setIsRedirecting(true);
    try {
      if (!member.stripeConnectAccountId) {
        const { data } = await onboardMemberToStripe();
        if (data && data.onboardMemberToStripe) {
          window.location.href = data.onboardMemberToStripe;
        } else {
          // Handle case where redirect URL might not be returned
          console.error("Onboarding did not return a redirect URL.");
          setIsRedirecting(false);
        }
      } else {
        const { data } = await resumeAccountOnboarding();
        if (data && data.resumeAccountOnboarding) {
          window.location.href = data.resumeAccountOnboarding;
        } else {
          // Handle case where redirect URL might not be returned
          console.error("Resume onboarding did not return a redirect URL.");
          setIsRedirecting(false);
        }
      }
    } catch (error) {
      console.error("Error during Stripe onboarding/resuming:", error);
      setIsRedirecting(false);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", alignItems: "start" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          bgcolor: "black",
          color: "white",
          borderRadius: 2,
          border: "4px solid white",
          padding: "50px",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <GoAlertFill style={{ color: "red", fontSize: "24px" }} />
          <Typography variant="body1" sx={{ fontSize: "24px" }}>
            Set Up Stripe
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          disabled={onboardLoading || resumeOnboardLoading || isRedirecting}
          sx={{
            color: "white",
            borderColor: "white",
            textTransform: "none",
            fontSize: "20px",
            padding: "5px 15px",
            mt: 1,
          }}
          onClick={handleStripeAccountClick}
        >
          {buttonText}
        </Button>
      </Box>
    </Container>
  );
};
