import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { MdCurrencyExchange } from "react-icons/md";
import StyledButton from "../HomePage/StyledButton";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useSneakerUser } from "../../context/UserContext";

const CREATE_MEMBER_SUBSCRIPTION = gql`
  mutation CreateMemberSubsctiprion {
    createMemberSubsctiprion
  }
`;

export const NewSubscription = () => {
  const navigate = useNavigate();
  const { user, isSubscribed } = useSneakerUser();

  const [createSubscription, { loading }] = useMutation(
    CREATE_MEMBER_SUBSCRIPTION
  );

  useEffect(() => {
    // Member that once was a customer and not subscribed.
    if (user?.stripeCustomerId && !isSubscribed) {
      navigate("/member/subscriptions");
    }

    if (user?.stripeCustomerId && isSubscribed) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubscriptionClick = async () => {
    await createSubscription({
      onCompleted: (data) => {
        window.location.href = data.createMemberSubsctiprion;
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
      }}
    >
      <Box sx={{ fontSize: "120px", color: "#FFD100" }}>
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
          minWidth: "250px",
          "&::after": {
            height: "70px",
          },
        }}
      >
        {loading ? <LoadingCircle /> : "Start Subsctiption"}
      </StyledButton>
    </Box>
  );
};
