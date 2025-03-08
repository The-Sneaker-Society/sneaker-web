import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { GoAlertFill } from "react-icons/go";
import { useSneakerUser } from "../../context/UserContext";

const ONBOARD_MEMBER_TO_STRIPE_MUTATION = gql`
  mutation OnboardMemberToStripe {
    onboardMemberToStripe
  }
`;

export const StripeSetUpWidget = () => {
  const { user, loading: sneakerLoading } = useSneakerUser();
  const [onboardMemberToStripe, { loading }] = useMutation(
    ONBOARD_MEMBER_TO_STRIPE_MUTATION
  );

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleStripeAccountClick = async () => {
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
  };

  if (sneakerLoading) return <p>Loading...</p>;

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
        borderRadius: "16px",
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
      <Button
        variant="outlined"
        size="small"
        loading={loading || isRedirecting}
        sx={{
          color: "white",
          borderColor: "white",
          textTransform: "none",
          fontSize: "20px",
          padding: "5px 15px",
        }}
        onClick={handleStripeAccountClick}
      >
        set up Stripe
      </Button>
    </Box>
  );
};
