import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress, Divider } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import CollectionsIcon from "@mui/icons-material/Collections";
import VerifiedIcon from "@mui/icons-material/Verified";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import InsightsIcon from "@mui/icons-material/Insights";
import { useSneakerMember } from "../../context/MemberContext";
import { CREATE_MEMBER_SUBSCRIPTION } from "../../context/graphql/subscriptionQueries";

const FEATURES = [
  { icon: AttachMoneyIcon,        label: "Get paid quickly, directly to your bank" },
  { icon: AllInclusiveIcon,       label: "Unlimited contracts — no caps on how much you can grow" },
  { icon: CollectionsIcon,        label: "Show off your work with a portfolio built for closers" },
  { icon: VerifiedIcon,           label: "Professional contracts your clients can count on" },
  { icon: ChatBubbleOutlineIcon,  label: "Stay connected with clients without leaving the app" },
  { icon: InsightsIcon,           label: "Know your numbers — track revenue, volume, and growth" },
];

export const NewSubscription = () => {
  const navigate = useNavigate();
  const { member } = useSneakerMember();
  const isSubscribed = member?.isSubscribed;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createSubscription] = useMutation(CREATE_MEMBER_SUBSCRIPTION);

  useEffect(() => {
    if (member?.stripeCustomerId && isSubscribed) {
      console.log("User is subscribed and has a Stripe customer ID.");
    }
  }, [member, isSubscribed, navigate]);

  const handleSubscriptionClick = async () => {
    if (!member) {
      console.error("Member data is not available");
      alert("Member data is not available. Please refresh the page and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await createSubscription();
      if (data?.createMemberSubsctiprion) {
        window.location.href = data.createMemberSubsctiprion;
      } else {
        console.error("Error: createMemberSubsctiprion is missing in the response.", data);
        alert("Failed to create subscription. Please try again.");
      }
    } catch (err) {
      console.error("Error creating subscription:", err);
      alert("Failed to create subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 3, sm: 6 },
        py: { xs: 6, sm: 4 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: 6, md: 10 },
          maxWidth: 900,
          width: "100%",
        }}
      >
        {/* Left — Plan info & CTA */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Badge */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WorkspacePremiumIcon sx={{ color: "#FFD100", fontSize: "1.4rem" }} />
            <Typography
              sx={{
                color: "#FFD100",
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Essential Plan
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              color: "white",
              fontSize: { xs: "2.6rem", sm: "3.5rem" },
              lineHeight: 1.1,
              letterSpacing: "-1px",
            }}
          >
            Grow your sneaker business.
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body1"
            sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}
          >
            Everything you need to run intakes, get paid fast, and build your brand — for less than a cup of coffee a day.
          </Typography>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", my: 1 }} />

          {/* Price */}
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography
              fontWeight={800}
              sx={{ color: "#FFD100", fontSize: { xs: "3.8rem", sm: "4.5rem" }, lineHeight: 1 }}
            >
              $7.99
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
              / month
            </Typography>
          </Box>

          {/* CTA */}
          <Button
            onClick={handleSubscriptionClick}
            disabled={isSubmitting}
            sx={{
              mt: 1,
              alignSelf: "flex-start",
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
              "&:hover": { bgcolor: "#e6bc00", boxShadow: "none" },
              "&.Mui-disabled": {
                bgcolor: "rgba(255,209,0,0.35)",
                color: "rgba(0,0,0,0.4)",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} thickness={3} sx={{ color: "black" }} />
            ) : (
              "Start Subscription"
            )}
          </Button>
        </Box>

        {/* Right — Features list */}
        <Box
          sx={{
            flex: 1,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px",
            p: { xs: 3, sm: 4 },
            bgcolor: "#0d0d0d",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
            }}
          >
            What's included
          </Typography>

          {FEATURES.map(({ icon: Icon, label }) => (
            <Box
              key={label}
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <Icon
                sx={{ color: "#FFD100", fontSize: "1.2rem", flexShrink: 0 }}
              />
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem" }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
