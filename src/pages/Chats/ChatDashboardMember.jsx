import { Box, CircularProgress, Alert } from "@mui/material";
import Chat from "../MemberChat/Chat";
import { useSneakerMember } from "../../context/MemberContext";
import useChatDashboard from "./useChatDashboard";

export const ChatDashboardMember = () => {
  const { member: currentUser, loading: userLoading } = useSneakerMember();
  const { chatId, chat, loading, error, messages, isSending, setIsSending, sendMessage } =
    useChatDashboard("MEMBER");

  if (!chatId) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Chat ID is required.</Alert>
      </Box>
    );
  }

  if (loading || userLoading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <CircularProgress sx={{ color: "#FFD100" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load chat. Please refresh and try again.</Alert>
      </Box>
    );
  }

  return (
    <Chat
      messages={messages}
      sendMessage={sendMessage}
      isSending={isSending}
      setIsSending={setIsSending}
      currentUser={currentUser?.id}
      otherUserName={chat?.user?.email || "Chat"}
    />
  );
};
