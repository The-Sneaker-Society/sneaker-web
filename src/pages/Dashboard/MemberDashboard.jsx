import { Box, Typography, CircularProgress } from "@mui/material";
import { useClerk } from "@clerk/clerk-react";
import ContractStatusWidget from "../../components/ContractStatusWidget";
import { QrWidget } from "../../components/qrWidget";
import { StripeWidget } from "../../components/StripeWidgets/StripeWidget";
import StyledButton from "../HomePage/StyledButton";
import { StripeSetUpWidget } from "../../components/StripeWidgets/StripeSetUpWidget";
import { ContractListWidget } from "../ContractsPage/ContractListWidget";
import OnboardModal from "../../components/OnboardModal";
import { useSneakerMember } from "../../context/MemberContext";
import { LoadingCircle } from "../../components/LoadingCircle";
import SubscribeModal from "../../components/SubscribeModal";

export const MemberDashboard = () => {
  const { member, loading } = useSneakerMember();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
  };

  const WidgetWrapper = ({ children }) => {
    return (
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </Box>
    );
  };

  if (loading) {
    return <LoadingCircle />;
  }

  if (!member) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "white" }}>
        <Typography>Error loading member data. Please refresh or sign out and try again.</Typography>
      </Box>
    );
  }

  const isOnboarded = !member.isNewUser;
  const isSubscribed = member.isSubscribed;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <OnboardModal isOnboarded={isOnboarded} />
      <SubscribeModal isSubscribed={isSubscribed} />
      <Box
        sx={{
          flexShrink: 0,
          padding: { xs: "16px", sm: "24px 32px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{ fontSize: { xs: "1.6rem", sm: "2rem", md: "2.5rem" }, minWidth: 0 }}
          >
            Welcome, {member?.firstName || "member"}
          </Typography>
          <StyledButton onClick={handleLogout}>
            Log Out
          </StyledButton>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "10px",
          }}
        >
          <WidgetWrapper>
            <ContractListWidget />
          </WidgetWrapper>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            padding: "10px",
          }}
        >
          <WidgetWrapper>
            <ContractStatusWidget />
          </WidgetWrapper>
          <Box sx={{ height: "40px" }} />
          <WidgetWrapper>
            {member?.isOnboardedWithStripe ? (
              <StripeWidget />
            ) : (
              <StripeSetUpWidget />
            )}
          </WidgetWrapper>
          <Box sx={{ height: "40px" }} />
          <WidgetWrapper>
            <QrWidget />
          </WidgetWrapper>
        </Box>
      </Box>
    </Box>
  );
};
