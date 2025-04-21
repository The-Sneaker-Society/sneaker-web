import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { MdCurrencyExchange } from "react-icons/md";
import StyledButton from "../HomePage/StyledButton";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useSneakerUser } from "../../context/UserContext";
import { LoadingCircle } from "../../components/Loaing";

const CREATE_MEMBER_SUBSCRIPTION = gql`
  mutation CreateMemberSubsctiprion {
    createMemberSubsctiprion
  }
`;

export const NewSubscription = () => {
  const navigate = useNavigate();
  const { user, isSubscribed } = useSneakerUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubscription] = useMutation(CREATE_MEMBER_SUBSCRIPTION);

  useEffect(() => {
    if (user?.stripeCustomerId && isSubscribed) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubscriptionClick = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await createSubscription();
      if (data && data.createMemberSubsctiprion) {
        setIsSubmitting(false);
        window.location.href = data.createMemberSubsctiprion; // Correct: Redirect to Stripe
      } else {
        setIsSubmitting(false);
        console.error(
          "Error: createMemberSubsctiprion is missing in the response."
        );
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error creating subscription:", err);
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
        Subscribe
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
        {isSubmitting ? <LoadingCircle /> : "Start Subsctiption"}
      </StyledButton>
    </Box>
  );
};
