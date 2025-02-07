import React from "react";
import { Box, Typography } from "@mui/material";
import { MdCurrencyExchange } from "react-icons/md";
import StyledButton from "./HomePage/StackedButton";
import { gql, useQuery } from "@apollo/client";
import { LoadingCircle } from "../components/Loaing";

const CREATE_MEMBER_SUBSCRIPTION = gql`
  query CreateMemberSubsctiprion {
    createMemberSubsctiprion
  }
`;

const StripeSubsriptionPage = () => {
  const { data, loading, error } = useQuery(CREATE_MEMBER_SUBSCRIPTION);

  const handleSubscriptionClick = () => {
    window.location.href = data.createMemberSubsctiprion;
  };

  if (loading) return <LoadingCircle />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Box sx={{ fontSize: "120px", color: '#FFD100' }}>
        <MdCurrencyExchange />
      </Box>

      <Typography
        sx={{
          fontSize: { xs: "48px", sm: "72px", md: "96px" }, // Responsive font sizes
          fontWeight: "600",
        }}
      >
        Subscription
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "48px", sm: "72px" }, // Responsive font sizes
          fontWeight: "600",
        }}
      >
        $7.99/mo
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "18px" }, // Responsive font sizes
          marginBottom: "32px",
          maxWidth: "600px",
          lineHeight: { xs: "18px", sm: "19px", md: "19.5px" }, // Responsive line heights
          fontWeight: "500",
        }}
      >
        As a member you will get Unlimited Intakes, Direct Messaging, Direct
        Stripe Payments, and Business Analytics!
      </Typography>

      <StyledButton
        variant="contained"
        onClick={handleSubscriptionClick}
        sx={{
          fontSize: "24px",
          fontWeight: "700",
          height: "65px",
          "&::after": {
            height: "70px",
          },
        }}
      >
        Start Subscription
      </StyledButton>
    </Box>
  );
};

export default StripeSubsriptionPage;
