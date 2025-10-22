import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { MdCurrencyExchange } from "react-icons/md";
import StyledButton from "./HomePage/StyledButton";
import { gql, useMutation } from "@apollo/client";
import { LoadingCircle } from "../components/LoadingCircle";
import { useNavigate } from "react-router-dom";
import { useSneakerMember } from "../context/MemberContext";

const CREATE_MEMBER_SUBSCRIPTION = gql`
  mutation CreateMemberSubsctiprion {
    createMemberSubsctiprion
  }
`;

const StripeSubsriptionPage = () => {
  const navigate = useNavigate();
  const { member } = useSneakerMember();
  const isSubscribed = member?.isSubscribed;

  const [createSubscription, { loading }] = useMutation(
    CREATE_MEMBER_SUBSCRIPTION
  );

  useEffect(() => {
    // Member that once was a customer and not subscribed.
    if (member?.stripeCustomerId && !isSubscribed) {
      navigate("/member/subscriptions");
    }

    if (member?.stripeCustomerId && isSubscribed) {
      navigate("/dashboard");
    }
  }, [member, isSubscribed, navigate]);

  const handleSubscriptionClick = async () => {
    try {
      await createSubscription({
        onCompleted: (data) => {
          if (data && data.createMemberSubsctiprion) {
            window.location.href = data.createMemberSubsctiprion;
          } else {
            console.error("Error: createMemberSubsctiprion is missing in the response.", data);
            alert("Failed to create subscription. Please try again.");
          }
        },
        onError: (error) => {
          console.error("Error creating subscription:", error);
          alert("Failed to create subscription. Please try again.");
        }
      });
    } catch (err) {
      console.error("Error creating subscription:", err);
      alert("Failed to create subscription. Please try again.");
    }
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
        {loading ? <LoadingCircle /> : "Start Subscription"}
      </StyledButton>
    </Box>
  );
};

export default StripeSubsriptionPage;
