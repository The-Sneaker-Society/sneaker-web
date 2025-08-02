import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useSneakerUser } from "../../context/UserContext";
import { LoadingCircle } from "../../components/LoadingCircle";
import SubscriptionCard from "../../components/SubscriptionCard";
import { CREATE_MEMBER_SUBSCRIPTION } from "../../context/graphql/subscriptionQueries";
import StyledButton from "../HomePage/StyledButton";

export const NewSubscription = () => {
  const navigate = useNavigate();
  const { user, isSubscribed } = useSneakerUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubscription] = useMutation(CREATE_MEMBER_SUBSCRIPTION);

  useEffect(() => {
    if (user?.stripeCustomerId && isSubscribed) {
      // Prevent automatic redirection for subscribed users
      console.log("User is subscribed and has a Stripe customer ID.");
    }
  }, [user, isSubscribed, navigate]);

  const handleSubscriptionClick = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await createSubscription();
      if (data && data.createMemberSubsctiprion) {
        setIsSubmitting(false);
        window.location.href = data.createMemberSubsctiprion;
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

  // Define features list
  const features = [
    "Custom Portfolio Showcase",
    "Custom Intake Form",
    "Unlimited Intakes",
    "Fast Payouts",
    "Direct Messaging",
    "Detailed Business Analytics"
  ];

  // Create subscribe button
  const subscribeButton = (
    <StyledButton
      onClick={handleSubscriptionClick}
      disabled={isSubmitting}
      style={{ width: "200px" }}
    >
      {isSubmitting ? <LoadingCircle /> : "Subscribe"}
    </StyledButton>
  );

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100vh",
      backgroundColor: "black"
    }}>
      <SubscriptionCard
        features={features}
        actionButton={subscribeButton}
        isRightSide={false}
      />
    </Box>
  );
};
