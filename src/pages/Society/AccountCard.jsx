import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useColors } from "../../theme/colors";

// Generates initials avatar background color from a string
const stringToColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 50%, 40%)`;
};

const getInitials = (firstName = "", lastName = "") =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const AccountCard = ({ member, isFollowing, onFollow }) => {
  const colors = useColors();
  const { firstName, lastName, businessName, state } = member;
  const initials = getInitials(firstName, lastName);
  const avatarColor = stringToColor(`${firstName}${lastName}`);
  const displayName = businessName || `${firstName} ${lastName}`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: { xs: 2, sm: 2.5 },
        borderRadius: "16px",
        backgroundColor: colors.isDark ? "#1a1a1a" : "#f0f0f0",
        border: `1px solid ${colors.isDark ? "#2a2a2a" : "#e0e0e0"}`,
        mb: 2,
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: { xs: 44, sm: 52 },
          height: { xs: 44, sm: 52 },
          borderRadius: "50%",
          backgroundColor: avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "0.85rem", sm: "1rem" },
          }}
        >
          {initials}
        </Typography>
      </Box>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: { xs: "0.9rem", sm: "1rem" },
            color: colors.textPrimary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {displayName}
        </Typography>
        {businessName && (
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.8rem",
              color: colors.textSecondary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {firstName} {lastName}
          </Typography>
        )}
        {state && (
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.75rem",
              color: colors.textSecondary,
              mt: 0.25,
            }}
          >
            {state}
          </Typography>
        )}
      </Box>

      {/* Follow button — wired up in follow/unfollow ticket */}
      <Button
        onClick={() => onFollow(member.id)}
        variant={isFollowing ? "outlined" : "contained"}
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: "0.8rem",
          textTransform: "none",
          borderRadius: "20px",
          px: 2,
          flexShrink: 0,
          ...(isFollowing
            ? {
                borderColor: colors.isDark ? "#555" : "#bbb",
                color: colors.textSecondary,
                "&:hover": { borderColor: "#e74c3c", color: "#e74c3c" },
              }
            : {
                backgroundColor: "#FFD100",
                color: "#000",
                border: "none",
                "&:hover": { backgroundColor: "#E6BC00" },
              }),
        }}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </Box>
  );
};

export default AccountCard;
