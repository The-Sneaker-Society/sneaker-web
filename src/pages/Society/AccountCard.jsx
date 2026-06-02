import React from "react";
import { Box, Typography, Button, CircularProgress, Chip } from "@mui/material";
import {
  PlaceOutlined,
  WorkspacePremiumOutlined,
  FiberManualRecord,
} from "@mui/icons-material";
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

// Build the list of community signal chips from available member data.
// When backend adds post data, pass activitySnippet as a prop and add it here.
const buildSignals = (member) => {
  const signals = [];

  if (member.subscriptionStatus === "active") {
    signals.push({ key: "pro", label: "Pro Member", icon: <WorkspacePremiumOutlined sx={{ fontSize: 13 }} /> });
  }

  if (member.state) {
    signals.push({ key: "location", label: member.state, icon: <PlaceOutlined sx={{ fontSize: 13 }} /> });
  }

  if (member.isActive) {
    signals.push({ key: "active", label: "Active", icon: <FiberManualRecord sx={{ fontSize: 10, color: "#4caf50" }} /> });
  }

  return signals;
};

const AccountCard = ({ member, isFollowing, isPending, onFollow, activitySnippet }) => {
  const colors = useColors();
  const { firstName, lastName, businessName } = member;
  const initials = getInitials(firstName, lastName);
  const avatarColor = stringToColor(`${firstName}${lastName}`);
  const displayName = businessName || `${firstName} ${lastName}`;
  const signals = buildSignals(member);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: "16px",
        backgroundColor: colors.isDark ? "#1a1a1a" : "#f0f0f0",
        border: `1px solid ${colors.isDark ? "#2a2a2a" : "#e0e0e0"}`,
        mb: 2,
      }}
    >
      {/* Top row: avatar + name + follow button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

        {/* Name + owner line */}
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
        </Box>

        {/* Follow / Unfollow button */}
        <Button
          onClick={() => !isPending && onFollow(member.id)}
          variant={isFollowing ? "outlined" : "contained"}
          disabled={isPending}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "none",
            borderRadius: "20px",
            px: 2,
            minWidth: 88,
            flexShrink: 0,
            ...(isFollowing
              ? {
                  borderColor: colors.isDark ? "#555" : "#bbb",
                  color: colors.textSecondary,
                  "&:hover": { borderColor: "#e74c3c", color: "#e74c3c" },
                  "&.Mui-disabled": { borderColor: colors.isDark ? "#333" : "#ddd", color: colors.textSecondary },
                }
              : {
                  backgroundColor: "#FFD100",
                  color: "#000",
                  border: "none",
                  "&:hover": { backgroundColor: "#E6BC00" },
                  "&.Mui-disabled": { backgroundColor: "#FFD100", color: "#000", opacity: 0.7 },
                }),
          }}
        >
          {isPending ? (
            <CircularProgress size={16} sx={{ color: isFollowing ? colors.textSecondary : "#000" }} />
          ) : isFollowing ? (
            "Following"
          ) : (
            "Follow"
          )}
        </Button>
      </Box>

      {/* Activity snippet row */}
      {(signals.length > 0 || activitySnippet) && (
        <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Post snippet — shown when backend supplies post data */}
          {activitySnippet && (
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.8rem",
                color: colors.textSecondary,
                fontStyle: "italic",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: 1.4,
              }}
            >
              "{activitySnippet}"
            </Typography>
          )}

          {/* Community signal chips */}
          {signals.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {signals.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  icon={s.icon}
                  size="small"
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    height: 24,
                    backgroundColor: colors.isDark ? "#2a2a2a" : "#e4e4e4",
                    color: colors.textSecondary,
                    border: "none",
                    "& .MuiChip-icon": { ml: 0.5 },
                    ...(s.key === "pro" && {
                      backgroundColor: colors.isDark ? "#2a2200" : "#fff8dc",
                      color: "#b8860b",
                    }),
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AccountCard;
