import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { SiStripe } from "react-icons/si";
import { gql, useMutation } from "@apollo/client";

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

  const hasAccount = !!member?.stripeConnectAccountId;
  const isLoading = onboardLoading || resumeOnboardLoading || isRedirecting;

  const handleStripeAccountClick = async () => {
    if (!member) {
      console.error(
        "Stripe action cannot be performed: member data is not available."
      );
      return;
    }

    setIsRedirecting(true);
    try {
      if (!hasAccount) {
        const { data } = await onboardMemberToStripe();
        if (data?.onboardMemberToStripe) {
          window.location.href = data.onboardMemberToStripe;
        } else {
          console.error("Onboarding did not return a redirect URL.");
          setIsRedirecting(false);
        }
      } else {
        const { data } = await resumeAccountOnboarding();
        if (data?.resumeAccountOnboarding) {
          window.location.href = data.resumeAccountOnboarding;
        } else {
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "black",
        px: 2,
      }}
    >
      <Box
        sx={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "16px",
          p: { xs: 4, sm: 6 },
          maxWidth: 480,
          width: "100%",
          bgcolor: "#0d0d0d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
        }}
      >
        {/* Stripe Icon */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "14px",
            bgcolor: "rgba(99,91,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <SiStripe size={32} color="#635BFF" />
        </Box>

        {/* Heading */}
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: "white", letterSpacing: "-0.5px" }}
        >
          {hasAccount ? "Resume Stripe Setup" : "Connect with Stripe"}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
            maxWidth: 340,
          }}
        >
          {hasAccount
            ? "Your Stripe account setup isn't complete yet. Pick up where you left off to start receiving payouts."
            : "Stripe securely powers your payouts. Connect your account to receive payments directly to your bank."}
        </Typography>

        {/* CTA Button */}
        <Button
          onClick={handleStripeAccountClick}
          disabled={isLoading}
          sx={{
            mt: 1,
            bgcolor: "#FFD100",
            color: "black",
            borderRadius: "8px",
            px: 5,
            py: 1.5,
            fontSize: "15px",
            fontWeight: 700,
            textTransform: "none",
            minWidth: 200,
            minHeight: 48,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#e6bc00",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(255,209,0,0.35)",
              color: "rgba(0,0,0,0.4)",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} thickness={3} sx={{ color: "black" }} />
          ) : hasAccount ? (
            "Resume Setup"
          ) : (
            "Set Up Stripe"
          )}
        </Button>

        {/* Security note */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <LockOutlinedIcon
            sx={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}
          />
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}
          >
            Secured and encrypted by Stripe
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
