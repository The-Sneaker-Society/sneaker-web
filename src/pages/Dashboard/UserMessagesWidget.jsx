import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useColors } from "../../theme/colors";

const GET_USER_CHATS = gql`
  query GetUserChats {
    currentUser {
      id
      chats {
        id
        name
        member {
          firstName
          lastName
        }
        messages {
          content
          createdAt
        }
      }
    }
  }
`;

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const formatTimestamp = (ts) => {
  if (!ts) return "";
  const date = new Date(Number(ts));
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const UserMessagesWidget = () => {
  const colors = useColors();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_USER_CHATS, {
    fetchPolicy: "network-only",
  });

  const containerSx = {
    minHeight: 200,
    height: "100%",
    width: "100%",
    p: 2.5,
    borderRadius: 3,
    border: `1px solid ${colors.borderSubtle}`,
    bgcolor: colors.widgetBg,
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
  };

  const chats = (data?.currentUser?.chats ?? [])
    .map((chat) => {
      const sorted = [...(chat.messages ?? [])].sort(
        (a, b) => Number(b.createdAt) - Number(a.createdAt)
      );
      return { ...chat, lastMessage: sorted[0] || null };
    })
    .sort(
      (a, b) => Number(b.lastMessage?.createdAt || 0) - Number(a.lastMessage?.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <Box sx={containerSx}>
      <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, mb: 1.5, color: colors.textPrimary }}>
        Recent messages
      </Typography>
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} sx={{ height: 44, borderRadius: 1.5, mb: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
        ))
      ) : chats.length === 0 ? (
        <Typography sx={{ fontSize: "0.85rem", color: colors.textSecondary }}>
          No messages yet — they&apos;ll show up here once a member replies.
        </Typography>
      ) : (
        chats.map((chat) => {
          const memberName =
            [chat.member?.firstName, chat.member?.lastName].filter(Boolean).join(" ") || chat.name || "Chat";
          return (
            <Box
              key={chat.id}
              onClick={() => navigate(`/user/chats/${chat.id}`)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1.25,
                borderBottom: `1px solid ${colors.borderSubtle}`,
                cursor: "pointer",
                "&:last-child": { borderBottom: "none" },
                "&:hover": { opacity: 0.85 },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: colors.textSecondary,
                  color: colors.widgetBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {getInitials(memberName)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: colors.textPrimary }}>
                  {memberName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: colors.textSecondary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {chat.lastMessage?.content || "No messages yet"}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.7rem", color: colors.textSecondary, flexShrink: 0 }}>
                {formatTimestamp(chat.lastMessage?.createdAt)}
              </Typography>
            </Box>
          );
        })
      )}
    </Box>
  );
};
