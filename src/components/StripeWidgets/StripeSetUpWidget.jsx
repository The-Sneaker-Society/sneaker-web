import React, { useState } from "react";
import { Box, Typography, Button, Stack, Skeleton } from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { GoAlertFill } from "react-icons/go";
import { useSneakerMember } from "../../context/MemberContext";
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

export const StripeSetUpWidget = () => {
  const { member, loading: memberLoading } = useSneakerMember();
  const [onboardMemberToStripe, { loading: onboardLoading }] = useMutation(
    ONBOARD_MEMBER_TO_STRIPE_MUTATION
  );
  const [resumeAccountOnboarding, { loading: resumeOnboardLoading }] =
    useMutation(RESUME_ONBOARDING);

  const [isRedirecting, setIsRedirecting] = useState(false);

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

  if (memberLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          bgcolor: "black",
          color: "white",
          borderRadius: 2,
          border: "4px solid white",
          padding: "50px",
        }}
      >
        <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={150} height={40} />
      </Box>
    );
  }

  let buttonText = "Set up Stripe";
  let alertMessage = "Please set up Stripe to begin";

  if (member.stripeConnectAccountId) {
    if (member.isOnboardedWithStripe === true) {
      // Explicitly check for true
      alertMessage = "Your Stripe account is connected.";
      buttonText = "Manage Stripe Account"; // Or similar if you want to allow managing after onboarding
      // Or you might hide the button/show different info if fully onboarded
    } else if (member.isOnboardedWithStripe === false) {
      // Explicitly check for false
      alertMessage = "Your Stripe onboarding is incomplete.";
      buttonText = "Resume Onboarding";
    } else {
      // Fallback if isOnboardedWithStripe is undefined (but it shouldn't be if query is correct)
      alertMessage = "Stripe status is unclear. Attempt to resume or setup.";
      buttonText = "Configure Stripe";
    }
  }

  return (
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
          {alertMessage}
        </Typography>
      </Box>
      {/* Conditionally render the button if an action is needed */}
      {!(
        member.stripeConnectAccountId && member.isOnboardedWithStripe === true
      ) && (
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
      )}
      {/* If you want a button to always show for managing a connected account, add it here: */}
      {member.stripeConnectAccountId &&
        member.isOnboardedWithStripe === true && (
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: "white",
              borderColor: "white",
              textTransform: "none",
              fontSize: "20px",
              padding: "5px 15px",
              mt: 1,
            }}
            onClick={() => {
              // Logic to redirect to Stripe dashboard or manage settings
              // For example, you might need another mutation/query to get a dashboard link
              if (member.stripeDashboardLink) {
                // Assuming you fetch/have a dashboard link
                window.location.href = member.stripeDashboardLink;
              } else {
                console.log("Stripe dashboard link not available.");
                // Potentially call resumeAccountOnboarding if that provides a general link
                handleStripeAccountClick();
              }
            }}
          >
            Manage Stripe Account
          </Button>
        )}
    </Box>
  );
};
