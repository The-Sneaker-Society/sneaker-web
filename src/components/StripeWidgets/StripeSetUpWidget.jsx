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
    if (!member.stripeConnectAccountId) {
      onboardMemberToStripe({
        onCompleted: (data) => {
          setIsRedirecting(true);
          setTimeout(() => {
            window.location.href = data.onboardMemberToStripe;
          }, 0);
        },
        onError: () => {
          setIsRedirecting(false);
        },
      });
    } else {
      resumeAccountOnboarding({
        onCompleted: (data) => {
          setIsRedirecting(true);
          setTimeout(() => {
            window.location.href = data.resumeAccountOnboarding;
          }, 0);
        },
        onError: () => {
          setIsRedirecting(false);
        },
      });
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
          Please set up stripe to begin
        </Typography>
      </Box>
      {!member?.isOnboardedWithStripe && (
        <Button
          variant="outlined"
          size="small"
          loading={resumeOnboardLoading || onboardLoading || isRedirecting}
          sx={{
            color: "white",
            borderColor: "white",
            textTransform: "none",
            fontSize: "20px",
            padding: "5px 15px",
          }}
          onClick={handleStripeAccountClick}
        >
          {member.stripeConnectAccountId
            ? "Resume Onboarding"
            : "Set up stripe"}
        </Button>
      )}
    </Box>
  );
};
