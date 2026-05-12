import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  InputAdornment,
  Skeleton,
  Alert,
} from "@mui/material";
import { SearchOutlined, ChatBubbleOutline } from "@mui/icons-material";
import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../theme/colors";

const GET_MEMBER_CHATS = gql`
  query GetMemberChats {
    currentMember {
      id
      chats {
        id
        name
        user {
          id
          email
        }
        messages {
          id
          content
          createdAt
          senderType
        }
      }
    }
  }
`;

// Generates initials avatar background color from a string
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

const ChatRowSkeleton = ({ colors }) => (
  <ListItem
    sx={{
      px: 2,
      py: 1.5,
      borderRadius: "12px",
      mb: 0.5,
    }}
  >
    <ListItemAvatar>
      <Skeleton variant="circular" width={44} height={44} />
    </ListItemAvatar>
    <ListItemText
      primary={<Skeleton variant="text" width="50%" height={18} />}
      secondary={<Skeleton variant="text" width="70%" height={14} sx={{ mt: 0.5 }} />}
    />
  </ListItem>
);

const ChatSidebar = () => {
  const colors = useColors();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error } = useQuery(GET_MEMBER_CHATS);

  const chats = data?.currentMember?.chats || [];

  const filtered = chats.filter((chat) => {
    const label = chat.name || chat.user?.email || "";
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: colors.isDark ? "#000" : "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, pt: 4, pb: 2 }}>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "1.4rem", sm: "1.7rem" },
            color: colors.textPrimary,
            mb: 2,
          }}
        >
          Messages
        </Typography>

        <TextField
          placeholder="Search conversations…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined sx={{ color: colors.textSecondary, fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: colors.isDark ? "#1a1a1a" : "#f0f0f0",
              "& fieldset": { border: "none" },
              color: colors.textPrimary,
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: colors.textSecondary,
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Error */}
      {error && (
        <Box sx={{ px: 3 }}>
          <Alert severity="error">
            Failed to load conversations. Please refresh.
          </Alert>
        </Box>
      )}

      {/* List */}
      <List sx={{ px: 1, flex: 1 }}>
        {loading &&
          [...Array(4)].map((_, i) => (
            <ChatRowSkeleton key={i} colors={colors} />
          ))}

        {!loading &&
          !error &&
          filtered.map((chat) => {
            const label = chat.name || chat.user?.email || "Chat";
            const sortedMessages = [...(chat.messages || [])].sort(
              (a, b) => Number(a.createdAt) - Number(b.createdAt)
            );
            const lastMsg = sortedMessages[sortedMessages.length - 1];
            const avatarColor = stringToColor(label);
            const initials = getInitials(label);

            return (
              <ListItem
                key={chat.id}
                button
                onClick={() => navigate(`/member/chats/${chat.id}`)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: "12px",
                  mb: 0.5,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: colors.isDark ? "#1a1a1a" : "#f5f5f5",
                  },
                }}
              >
                <ListItemAvatar>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
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
                        fontSize: "0.8rem",
                      }}
                    >
                      {initials}
                    </Typography>
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: colors.textPrimary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {label}
                    </Typography>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: "0.8rem",
                          color: colors.textSecondary,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1,
                        }}
                      >
                        {lastMsg?.content || "No messages yet"}
                      </Typography>
                      {lastMsg && (
                        <Typography
                          sx={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "0.7rem",
                            color: colors.textSecondary,
                            flexShrink: 0,
                          }}
                        >
                          {formatTimestamp(lastMsg.createdAt)}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            );
          })}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              gap: 2,
            }}
          >
            <ChatBubbleOutline
              sx={{ fontSize: 60, color: colors.textSecondary, opacity: 0.35 }}
            />
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: colors.textSecondary,
                fontSize: "0.95rem",
                textAlign: "center",
                maxWidth: 280,
              }}
            >
              {searchTerm
                ? "No conversations match your search."
                : "No conversations yet. Start chatting!"}
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default ChatSidebar;
