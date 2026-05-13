import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import MemberSignupPage from "../SignupPage/SignupPage";
import { StripeOnobarding } from "./StripeOnboarding";
import { Subscriptions } from "../PaymentStatus/Subscriptions";
import { useSneakerMember } from "../../context/MemberContext";
import { useNavigate } from "react-router-dom";
import { LoadingCircle } from "../../components/LoadingCircle";
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
      let determinedPage = 0;

      const hasSeenWelcome = localStorage.getItem("ss_hasSeenWelcome");

      if (member.firstName) {
        determinedPage = 1;
        if (!member.isOnboardedWithStripe) {
          determinedPage = 2;
        } else if (!member.isSubscribed) {
          determinedPage = 3;
        } else {
          determinedPage = 4;
        }
      } else if (hasSeenWelcome) {
        determinedPage = 1;
      }

      if (determinedPage === 4) {
        navigate("/member/dashboard", { replace: true });
      } else {
        setActivePage(determinedPage);
      }
      setIsLoadingInitialState(false);
    } else if (!memberLoading && memberError) {
      console.error("OnboardMember: Error loading member data.", {
        memberError,
        member,
      });
      setIsLoadingInitialState(false);
    } else if (!memberLoading && !member) {
      navigate("/member/generate", { replace: true });
    }
  }, [member, memberLoading, memberError, navigate]);

  const renderPageContent = () => {
    switch (activePage) {
      case 0:
        return (
          <WelcomePage
            onContinue={() => {
              localStorage.setItem("ss_hasSeenWelcome", "true");
              setActivePage(1);
            }}
          />
        );
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

  if (memberError) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6">
          Something went wrong loading your account.
        </Typography>
        <Button variant="contained" onClick={() => refetch()}>
          Try Again
        </Button>
      </Box>
    );
  }

  return <Box sx={{ height: "100vh" }}>{renderPageContent()}</Box>;
};
