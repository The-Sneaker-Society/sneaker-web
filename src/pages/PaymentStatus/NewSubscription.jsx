import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useSneakerMember } from "../../context/MemberContext";
import { LoadingCircle } from "../../components/LoadingCircle";
import SubscriptionCard from "../../components/SubscriptionCard";
import { CREATE_MEMBER_SUBSCRIPTION } from "../../context/graphql/subscriptionQueries";
import StyledButton from "../HomePage/StyledButton";

export const NewSubscription = () => {
  const navigate = useNavigate();
  const { member } = useSneakerMember();
  const isSubscribed = member?.isSubscribed;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubscription] = useMutation(CREATE_MEMBER_SUBSCRIPTION);

  useEffect(() => {
    if (member?.stripeCustomerId && isSubscribed) {
      // Prevent automatic redirection for subscribed users
      console.log("User is subscribed and has a Stripe customer ID.");
    }
  }, [member, isSubscribed, navigate]);

  const handleSubscriptionClick = async () => {
    console.log("Starting subscription creation...", { member });

    if (!member) {
      console.error("Member data is not available");
      alert("Member data is not available. Please refresh the page and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await createSubscription();
      console.log("Subscription response:", data);

      if (data && data.createMemberSubsctiprion) {
        window.location.href = data.createMemberSubsctiprion;
      } else {
        console.error(
          "Error: createMemberSubsctiprion is missing in the response.",
          data
        );
        alert("Failed to create subscription. Please try again.");
      }
    } catch (err) {
      console.error("Error creating subscription:", err);
      alert("Failed to create subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      {isSubmitting ? <LoadingCircle /> : "Start Subscription"}
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
