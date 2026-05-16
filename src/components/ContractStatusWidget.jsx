import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { useColors } from "../theme/colors";
import { FiInbox, FiTool, FiCheckCircle } from "react-icons/fi";

const GET_MEMBER_CONTRACT_STATUS = gql`
  query GetMemberContractStatus {
    memberContractStatus {
      finished
      notStarted
      started
    }
  }
`;

const statusConfig = [
  { field: "notStarted", label: "Not Started", icon: FiInbox, colorKey: "notStarted" },
  { field: "started", label: "In Progress", icon: FiTool, colorKey: "inProgress" },
  { field: "finished", label: "Completed", icon: FiCheckCircle, colorKey: "completed" },
];

function StatusCard({ label, amount, icon: Icon, color }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        p: 2.5,
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-1px)",
        },
      }}
    >
      <Icon size={28} color={color} />
      <Typography sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, fontWeight: 700, color, lineHeight: 1.1 }}>
        {amount}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.875rem" },
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function ContractStatusWidget() {
  const { data, loading, error } = useQuery(GET_MEMBER_CONTRACT_STATUS);
  const colors = useColors();

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%", bgcolor: colors.widgetBg, borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, p: 2 }}>
        {[...Array(3)].map((_, i) => (
          <Box key={i} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, p: 2.5 }}>
            <Skeleton variant="circular" width={28} height={28} />
            <Skeleton variant="text" sx={{ fontSize: "2rem", width: "60%" }} />
            <Skeleton variant="text" sx={{ fontSize: "0.875rem", width: "80%" }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%", bgcolor: colors.widgetBg, borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, p: 2 }}>
      {statusConfig.map(({ field, label, icon, colorKey }) => (
        <StatusCard key={field} label={label} amount={data.memberContractStatus[field]} icon={icon} color={colors.status[colorKey]} />
      ))}
    </Box>
  );
}
