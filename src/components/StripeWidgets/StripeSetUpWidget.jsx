import React, { useState } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { FiCreditCard, FiAlertCircle } from "react-icons/fi";
import { useSneakerMember } from "../../context/MemberContext";
import { useColors } from "../../theme/colors";

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
  const colors = useColors();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleStripeAccountClick = async () => {
    if (!member) {
      console.error(
        "Stripe action cannot be performed: member data is not available."
      );
      return;
    }

    setIsRedirecting(true);
    try {
      if (!member.stripeConnectAccountId) {
        const { data } = await onboardMemberToStripe();
        if (data && data.onboardMemberToStripe) {
          window.location.href = data.onboardMemberToStripe;
        } else {
          console.error("Onboarding did not return a redirect URL.");
          setIsRedirecting(false);
        }
      } else {
        const { data } = await resumeAccountOnboarding();
        if (data && data.resumeAccountOnboarding) {
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

  if (memberLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", bgcolor: colors.widgetBg, borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, p: 5 }}>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width={160} height={40} sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  const isFullyOnboarded = member.stripeConnectAccountId && member.isOnboardedWithStripe === true;
  const isIncomplete = member.stripeConnectAccountId && member.isOnboardedWithStripe === false;
  const isUnclear = member.stripeConnectAccountId && member.isOnboardedWithStripe !== true && member.isOnboardedWithStripe !== false;

  let title, description, buttonLabel;

  if (isFullyOnboarded) {
    title = "Stripe Connected";
    description = "Your payout account is all set.";
    buttonLabel = "Manage Stripe Account";
  } else if (isIncomplete) {
    title = "Onboarding Incomplete";
    description = "Finish setting up your Stripe account to receive payouts.";
    buttonLabel = "Resume Onboarding";
  } else if (isUnclear) {
    title = "Stripe Setup";
    description = "Your Stripe status needs attention.";
    buttonLabel = "Configure Stripe";
  } else {
    title = "Connect Stripe";
    description = "Set up payouts to receive payments from clients.";
    buttonLabel = "Set up Stripe";
  }

  const isLoading = onboardLoading || resumeOnboardLoading || isRedirecting;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", bgcolor: colors.widgetBg, borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, p: 5, textAlign: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        {!isFullyOnboarded ? (
          <FiAlertCircle size={22} color={colors.textPrimary} />
        ) : (
          <FiCreditCard size={22} color={colors.status.completed} />
        )}
        <Typography sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" }, fontWeight: 600, color: colors.textPrimary }}>
          {title}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "0.875rem", color: "text.secondary", mb: 2.5, maxWidth: 280 }}>
        {description}
      </Typography>
      <Button
        variant="outlined"
        disabled={isLoading}
        sx={{
          color: colors.textPrimary,
          borderColor: colors.border,
          textTransform: "none",
          fontSize: "0.9rem",
          fontWeight: 500,
          px: 3,
          py: 0.75,
          "&:hover": { bgcolor: `${colors.textPrimary}08` },
        }}
        onClick={isFullyOnboarded ? () => {
          if (member.stripeDashboardLink) {
            window.location.href = member.stripeDashboardLink;
          } else {
            handleStripeAccountClick();
          }
        } : handleStripeAccountClick}
      >
        {buttonLabel}
      </Button>
    </Box>
  );
};
