import { Box, Typography } from "@mui/material";
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

  const isOnboarded = !member.isNewUser;
  const isSubscribed = member.isSubscribed;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
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
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h1" fontWeight="bold">
            Welcome, {member?.firstName || "member"}
          </Typography>
          <StyledButton onClick={handleLogout} style={{ marginTop: "10px" }}>
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
