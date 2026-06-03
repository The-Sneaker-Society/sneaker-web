import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useColors } from "../theme/colors";

const GET_RECENT_MESSAGES = gql`
  query GetRecentMessages {
    currentMember {
      chats {
        id
        name
        user { email }
        messages {
          content
          createdAt
        }
      }
    }
  }
`;

const stringToColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 50%, 40%)`;
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const formatTimestamp = (ts) => {
  if (!ts) return "";
  const date = new Date(Number(ts));
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function RecentMessagesWidget() {
  const colors = useColors();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_RECENT_MESSAGES);

  const chats = data?.currentMember?.chats ?? [];

  const chatRows = chats
    .map((chat) => {
      const label = chat.name || chat.user?.email || "Chat";
      const msgs = chat.messages ?? [];
      const sorted = [...msgs].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
      const lastMsg = sorted[sorted.length - 1] ?? null;
      return { id: chat.id, label, lastMsg, sortKey: lastMsg ? Number(lastMsg.createdAt) : 0 };
    })
    .filter((c) => c.lastMsg)
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 2);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 200,
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

      <Box sx={{ overflowY: "auto", maxHeight: 300 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1.5, py: 1.25 }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" sx={{ width: "40%", fontSize: "0.8rem" }} />
                <Skeleton variant="text" sx={{ width: "80%", fontSize: "0.75rem" }} />
              </Box>
            </Box>
          ))
        ) : chatRows.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4, textAlign: "center", px: 3 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}>
              No messages yet
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: colors.textSecondary, maxWidth: 220, lineHeight: 1.4 }}>
              Create your first contract and initiate a chat to start messaging.
            </Typography>
          </Box>
        ) : (
          chatRows.map((chat) => {
            const avatarColor = stringToColor(chat.label);
            const initials = getInitials(chat.label);
            return (
              <Box
                key={chat.id}
                onClick={() => navigate(`/member/chats/${chat.id}`)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  py: 1.25,
                  px: 0.5,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: colors.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.7rem" }}>
                    {initials}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.15 }}>
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: colors.textPrimary }}>
                      {chat.label}
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: colors.textSecondary, flexShrink: 0, ml: 1 }}>
                      {formatTimestamp(chat.lastMsg.createdAt)}
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
                    {chat.lastMsg.content}
                  </Typography>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
