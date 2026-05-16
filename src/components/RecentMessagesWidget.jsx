import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { useColors } from "../theme/colors";

const GET_RECENT_MESSAGES = gql`
  query GetRecentMessages {
    currentMember {
      chats {
        id
        name
        messages {
          content
          createdAt
        }
      }
    }
  }
`;

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(dateStr) {
  try {
    return formatDistanceToNow(new Date(Number(dateStr)), { addSuffix: true });
  } catch {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "";
    }
  }
}

function Avatar({ initials, colors }) {
  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: `1px solid ${colors.borderSubtle}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        bgcolor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      }}
    >
      <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, color: colors.textPrimary, letterSpacing: "0.04em" }}>
        {initials}
      </Typography>
    </Box>
  );
}

function MessageRow({ message, colors, isLast }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        py: 1.25,
        borderBottom: isLast ? "none" : `1px solid ${colors.borderSubtle}`,
        transition: "opacity 0.15s ease",
        "&:hover": { opacity: 0.7 },
      }}
    >
      <Avatar initials={message.initials} colors={colors} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.2 }}>
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: colors.textPrimary }}>
            {message.name}
          </Typography>
          <Typography sx={{ fontSize: "0.68rem", color: colors.textSecondary, flexShrink: 0, ml: 1 }}>
            {message.time}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: colors.textSecondary,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {message.snippet}
        </Typography>
      </Box>
    </Box>
  );
}

export default function RecentMessagesWidget() {
  const colors = useColors();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_RECENT_MESSAGES);

  const chats = data?.currentMember?.chats ?? [];

  const messageRows = chats
    .map((chat) => {
      const msgs = chat.messages ?? [];
      const latest = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      if (!latest) return null;
      return {
        id: chat.id,
        initials: getInitials(chat.name),
        name: chat.name,
        snippet: latest.content,
        time: formatTime(latest.createdAt),
        sortKey: Number(latest.createdAt),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 5);

  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 3,
        border: `1px solid ${colors.borderSubtle}`,
        bgcolor: colors.widgetBg,
        p: 2.5,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: colors.textSecondary,
          }}
        >
          Recent Messages
        </Typography>
        <Typography
          onClick={() => navigate("/member/messages")}
          sx={{
            fontSize: "0.7rem",
            fontWeight: 500,
            color: colors.textSecondary,
            cursor: "pointer",
            "&:hover": { color: colors.textPrimary },
            transition: "color 0.15s ease",
          }}
        >
          View all →
        </Typography>
      </Box>

      <Box sx={{ overflowY: "auto", maxHeight: 280 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1.5, py: 1.25 }}>
              <Skeleton variant="circular" width={34} height={34} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" sx={{ width: "40%", fontSize: "0.8rem" }} />
                <Skeleton variant="text" sx={{ width: "80%", fontSize: "0.75rem" }} />
              </Box>
            </Box>
          ))
        ) : messageRows.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4, textAlign: "center", px: 3 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}>
              No messages yet
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: colors.textSecondary, maxWidth: 220, lineHeight: 1.4 }}>
              When clients reach out about contracts, their messages will appear here.
            </Typography>
          </Box>
        ) : (
          messageRows.map((msg, idx) => (
            <MessageRow
              key={msg.id}
              message={msg}
              colors={colors}
              isLast={idx === messageRows.length - 1}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
