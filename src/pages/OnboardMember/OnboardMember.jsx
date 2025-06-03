import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import MemberSignupPage from "../SignupPage/SignupPage"; // Assuming this path is correct
import { StripeOnobarding } from "./StripeOnboarding"; // Assuming this path is correct
import { Subscriptions } from "../PaymentStatus/Subscriptions"; // Assuming this path is correct
import { useSneakerMember } from "../../context/MemberContext";
import { useNavigate } from "react-router-dom";
import { LoadingCircle } from "../../components/Loaing"; // Assuming this path is correct
import WelcomePage from "./WelcomePage";

export const OnboardMember = () => {
  const [activePage, setActivePage] = useState(0);
  const [isLoadingInitialState, setIsLoadingInitialState] = useState(true);
  const [isRefetchingAfterSignup, setIsRefetchingAfterSignup] = useState(false);
  const {
    member,
    loading: memberLoading,
    error: memberError,
    refetch,
  } = useSneakerMember();
  const navigate = useNavigate();

  useEffect(() => {
    if (!memberLoading && member) {
      console.log(member)
      let determinedPage = 0;
      if (member.firstName) {
        determinedPage = 1;
        if (!member.isOnboardedWithStripe) {
          determinedPage = 2;
        } else if (!member.isSubscribed) {
          determinedPage = 3;
        } else {
          determinedPage = 4; // All onboarding complete
        }
      }
      console.log(determinedPage)

      if (determinedPage === 4) {
        navigate("/member/dashboard", { replace: true });
      } else {
        setActivePage(determinedPage);
      }
      setIsLoadingInitialState(false);
    } else if (!memberLoading && (memberError || !member)) {
      console.error(
        "OnboardMember: Error loading member data or member is null.",
        { memberError, member }
      );

      setActivePage(0);
      setIsLoadingInitialState(false);
    }
  }, [member, memberLoading, memberError, navigate]);

  const renderPageContent = () => {
    switch (activePage) {
      case 0:
        return <WelcomePage onContinue={() => setActivePage(1)} />;
      case 1:
        return (
          <MemberSignupPage
            onComplete={async () => {
              setActivePage(2);
              setIsRefetchingAfterSignup(true);
              await refetch();
              setIsRefetchingAfterSignup(false);
            }}
          />
        );
      case 2:
        if (memberLoading || isRefetchingAfterSignup) {
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <LoadingCircle />
            </Box>
          );
        }
        return (
          <StripeOnobarding member={member} memberLoading={memberLoading} />
        );
      case 3:
        return <Subscriptions />;
      default:
        return (
          <Typography variant="h5" align="center" sx={{ mt: 4 }}>
            Loading next step or completing onboarding...
          </Typography>
        );
    }
  };

  if (isLoadingInitialState || memberLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <LoadingCircle />
      </Box>
    );
  }

  return <Box sx={{ height: "100vh" }}>{renderPageContent()}</Box>;
};
