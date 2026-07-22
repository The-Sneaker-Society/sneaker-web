import React from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { FiFileText, FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../theme/colors";

const GET_STRIPE_WIDGET_DATA = gql`
  query GetStripeWidgetData {
    stripeWidgetData {
      stripeConnectAccountId
      payoutAmount
      percentChange
      previousPayoutAmount
      accountStatus
      pendingCount
    }
  }
`;

function StatusDot({ status, colors }) {
  const colorMap = {
    active: colors.status.completed,
    restricted: colors.status.error,
    pending: colors.status.pending,
    disabled: colors.status.error,
  };
  const dotColor = colorMap[status?.toLowerCase()] ?? colors.textSecondary;
  return (
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: dotColor,
        flexShrink: 0,
      }}
    />
  );
}

export const StripeWidget = () => {
  const { data, loading, error } = useQuery(GET_STRIPE_WIDGET_DATA);
  const colors = useColors();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", bgcolor: colors.widgetBg, borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, p: 3 }}>
        <Skeleton variant="text" sx={{ fontSize: "2rem", width: "40%" }} />
        <Skeleton variant="text" sx={{ fontSize: "1rem", width: "60%" }} />
        <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", bgcolor: colors.widgetBg, borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, p: 3 }}>
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: colors.textSecondary, mb: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Pending Payout
        </Typography>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: colors.textPrimary }}>$0.00</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}>
          <FiAlertTriangle size={13} color="#F59E0B" style={{ flexShrink: 0 }} />
          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            Your first payout is just a contract away.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          disabled
          startIcon={<FiFileText size={14} />}
          sx={{ mt: 2, textTransform: "none", fontSize: "0.875rem", fontWeight: 500, alignSelf: "flex-start" }}
          onClick={() => navigate("/member/statements")}
        >
          Statements
        </Button>
      </Box>
    );
  }

  const { nextPayoutDate, payoutAmount, previousPayoutAmount, accountStatus, pendingCount } = data.stripeWidgetData;
  const hasPending = pendingCount > 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", bgcolor: colors.widgetBg, borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, p: 3 }}>
      <Typography sx={{ fontSize: "0.75rem", fontWeight: 500, color: colors.textSecondary, mb: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        Pending Payout
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
        <Typography sx={{ fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem" }, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1 }}>
          {payoutAmount}
        </Typography>
        {data.stripeWidgetData.percentChange !== 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, px: 1.5, py: 0.5, borderRadius: 1, bgcolor: data.stripeWidgetData.percentChange > 0 ? `${colors.status.completed}15` : `${colors.status.error}15` }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: data.stripeWidgetData.percentChange > 0 ? colors.status.completed : colors.status.error }}>
              {data.stripeWidgetData.percentChange > 0 ? "+" : ""}{data.stripeWidgetData.percentChange}%
            </Typography>
          </Box>
        )}
      </Box>

      {hasPending ? (
        <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" }, color: "text.secondary" }}>
          Pending across {pendingCount} contract{pendingCount === 1 ? "" : "s"}
        </Typography>
      ) : (
        <Typography sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" }, color: "text.secondary" }}>
          No pending payouts
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 2.5, mt: 0.5, mb: "auto" }}>
        {previousPayoutAmount && (
          <Typography sx={{ fontSize: "0.75rem", color: colors.textSecondary, fontWeight: 500 }}>
            Previous: {previousPayoutAmount}
          </Typography>
        )}
        {accountStatus && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
            <StatusDot status={accountStatus} colors={colors} />
            <Typography sx={{ fontSize: "0.75rem", color: colors.textSecondary, fontWeight: 500, textTransform: "capitalize" }}>
              {accountStatus}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FiFileText size={14} />}
          sx={{ color: colors.textPrimary, borderColor: colors.borderSecondary, textTransform: "none", fontSize: "0.875rem", fontWeight: 500, "&:hover": { bgcolor: `${colors.textPrimary}08` } }}
          onClick={() => navigate("/member/statements")}
        >
          Statements
        </Button>
      </Box>
    </Box>
  );
};
