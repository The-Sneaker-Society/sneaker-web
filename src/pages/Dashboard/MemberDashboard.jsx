import { Box, Typography, Button, IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useClerk } from "@clerk/clerk-react";
import { useLayout } from "../../components/Layout";
import { QrWidget } from "../../components/qrWidget";
import { StripeWidget } from "../../components/StripeWidgets/StripeWidget";
import { StripeSetUpWidget } from "../../components/StripeWidgets/StripeSetUpWidget";
import { ContractListWidget } from "../ContractsPage/ContractListWidget";
import OnboardModal from "../../components/OnboardModal";
import { useSneakerMember } from "../../context/MemberContext";
import { LoadingCircle } from "../../components/LoadingCircle";
import SubscribeModal from "../../components/SubscribeModal";
import { useColors } from "../../theme/colors";
import QuickActionsWidget from "../../components/QuickActionsWidget";
import RecentMessagesWidget from "../../components/RecentMessagesWidget";
import RevenueSummaryWidget from "../../components/RevenueSummaryWidget";

export const MemberDashboard = () => {
  const { member, loading } = useSneakerMember();
  const { signOut } = useClerk();
  const colors = useColors();
  const { openMobileNav } = useLayout();

  if (loading) return <Box sx={{ width: "100%", height: "100vh", display: "flex" }}><LoadingCircle /></Box>;

  if (!member) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Error loading member data. Please refresh or sign out and try again.</Typography>
      </Box>
    );
  }

  const isOnboarded = !member.isNewUser;
  const isSubscribed = member.isSubscribed;

  return (
    <Box sx={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <OnboardModal isOnboarded={isOnboarded} />
      {isOnboarded && <SubscribeModal isSubscribed={isSubscribed} />}

      {/* Header */}
      <Box
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          pt: 3,
          pb: 2.5,
          borderBottom: `1px solid ${colors.borderSubtle}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Hamburger — mobile only, triggers the Layout-controlled drawer */}
          <IconButton
            onClick={openMobileNav}
            sx={{ display: { xs: "flex", sm: "none" }, color: colors.textPrimary, p: 0.5 }}
          >
            <Menu fontSize="small" />
          </IconButton>
          <Box>
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: colors.textSecondary,
                mb: 0.5,
              }}
            >
              Member Dashboard
            </Typography>
            <Typography
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.4rem", sm: "1.75rem", md: "2rem" }, lineHeight: 1.1 }}
            >
              Welcome, {member?.firstName || "member"}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={() => signOut()}
          sx={{
            color: colors.textPrimary,
            borderColor: colors.borderSecondary,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            borderRadius: 1.5,
            px: 2.5,
            py: 0.75,
            "&:hover": { bgcolor: `${colors.textPrimary}08`, borderColor: colors.textPrimary },
          }}
        >
          Log out
        </Button>
      </Box>

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2.5,
          p: { xs: 2, sm: 2.5 },
          alignItems: "stretch",
          overflowY: { xs: "auto", md: "hidden" },
          minHeight: 0,
        }}
      >
        {/* Quick actions — top on mobile only */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <QuickActionsWidget />
        </Box>

        {/* Left column — contract list */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <ContractListWidget />
        </Box>

        {/* Right column — widgets */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          {/* Row 1: Quick actions — hidden on mobile (rendered above instead) */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <QuickActionsWidget />
          </Box>

          {/* Row 2: Recent messages — time-sensitive */}
          <RecentMessagesWidget />

          {/* Row 3: Stripe + QR side by side */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            {member?.isOnboardedWithStripe ? <StripeWidget /> : <StripeSetUpWidget />}
            <QrWidget />
          </Box>

          {/* Row 4: Revenue — reference/trend, fills remaining height */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <RevenueSummaryWidget />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
