import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { FiDollarSign, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

const statusConfig = {
  pending: { label: "Pending", icon: FiClock, color: "#F59E0B" },
  paid: { label: "Paid", icon: FiCheckCircle, color: "#10B981" },
  expired: { label: "Expired", icon: FiXCircle, color: "#EF4444" },
};

const PriceProposalBubble = ({ metadata, isMine }) => {
  const { price, checkoutUrl, status } = metadata || {};
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 280,
        borderRadius: 3,
        border: "1px solid",
        borderColor: isMine ? "rgba(0,0,0,0.15)" : "divider",
        bgcolor: isMine ? "rgba(255,209,0,0.15)" : "background.paper",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <FiDollarSign size={16} />
          <Typography sx={{ fontWeight: 700, fontSize: "0.8rem" }}>
            Price Proposal
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", lineHeight: 1.1 }}>
          ${price?.toLocaleString()}
        </Typography>

        {checkoutUrl && status === "pending" && (
          <Button
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            fullWidth
            sx={{
              mt: 0.5,
              bgcolor: "#FFD100",
              color: "#000",
              fontWeight: 700,
              fontSize: "0.8rem",
              textTransform: "none",
              borderRadius: 2,
              py: 0.75,
              "&:hover": { bgcolor: "#E6BC00" },
            }}
          >
            Pay Now
          </Button>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
          <StatusIcon size={12} color={config.color} />
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: config.color }}>
            {config.label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PriceProposalBubble;
