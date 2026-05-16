import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiMessageSquare, FiClipboard, FiCreditCard } from "react-icons/fi";
import { useColors } from "../theme/colors";

const ACTIONS = [
  { icon: FiFileText,      label: "Contracts",       path: "/member/contracts"        },
  { icon: FiMessageSquare, label: "Messages",         path: "/member/messages"         },
  { icon: FiClipboard,     label: "Preview Intake",  path: "/member/preview-contract" },
  { icon: FiCreditCard,    label: "Subscription",    path: "/member/subscriptions"    },
];

function ActionTile({ icon: Icon, label, onClick, colors }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        py: 2,
        px: 1,
        borderRadius: 2,
        border: `1px solid ${colors.borderSubtle}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: colors.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
          borderColor: colors.borderSecondary,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Icon size={20} color={colors.textPrimary} />
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: colors.textSecondary,
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function QuickActionsWidget() {
  const colors = useColors();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 3,
        border: `1px solid ${colors.borderSubtle}`,
        bgcolor: colors.widgetBg,
        p: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: colors.textSecondary,
          mb: 1.5,
        }}
      >
        Quick Actions
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }, gap: 1.5 }}>
        {ACTIONS.map(({ icon, label, path }) => (
          <ActionTile
            key={label}
            icon={icon}
            label={label}
            onClick={() => navigate(path)}
            colors={colors}
          />
        ))}
      </Box>
    </Box>
  );
}
