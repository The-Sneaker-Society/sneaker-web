import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Avatar,
  Paper,
  Typography,
  IconButton,
  Container,
  AppBar,
  Toolbar,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { FiSend } from "react-icons/fi";
import { format } from "date-fns";

const ChatContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  background: theme.palette.background.default,
}));

const MessageArea = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2.5),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.25),
}));

const MessageBubble = styled(Paper)(({ theme, isuser }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: "70%",
  width: "fit-content",
  marginLeft: isuser === "true" ? "auto" : 0,
  backgroundColor:
    isuser === "true"
      ? theme.palette.primary.main
      : theme.palette.background.paper,
  color:
    isuser === "true"
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: "transform 0.2s",
  minWidth: 80,
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const MessageRow = styled(Box)(({ theme, isuser }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1),
  flexDirection: isuser === "true" ? "row-reverse" : "row",
}));

const Chat = ({
  messages,
  sendMessage,
  isSending,
  setIsSending,
  currentUser,
  otherUserName,
}) => {
  const theme = useTheme();
  const [newMessage, setNewMessage] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSending]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      setIsSending(true);
      try {
        await sendMessage(newMessage.trim());
        setNewMessage("");
        // Focus back on the input field after sending a message
        inputRef.current?.focus();
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  function formatTimestampWithDateFns(timestamp) {
    // Create a new Date object from the timestamp.
    const date = new Date(Number(timestamp));

    // Format the date using date-fns' format function.
    // The format string 'PPPppp' provides a localized, human-readable date and time.
    const formattedDate = format(date, "EEE h:mm a");

    return formattedDate;
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendPaymentLink = async () => {
    setIsPaymentLoading(true);
    // Simulate a GraphQL mutation call with a fake async delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real application, you would get the payment URL from the mutation result
    const paymentUrl = "https://stripe.com/your-payment-link";

    const paymentMessage = (
      <span>
        Click here to make a payment:{" "}
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {paymentUrl}
        </a>
      </span>
    );

    const newMsg = {
      id: messages.length + 1,
      text: paymentMessage,
      sender: currentUser,
      timestamp: new Date(),
    };
    setMessages([...messages, newMsg]);
    setIsPaymentLoading(false);
  };

  return (
    <Container maxWidth="xl" disableGutters sx={{ height: "100%" }}>
      <ChatContainer>
        <AppBar
          position="static"
          sx={{
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Toolbar>
            <Typography variant="h3" component="div">
              {otherUserName}
            </Typography>
          </Toolbar>
        </AppBar>
        <MessageArea>
          {messages.map((message) => (
            <MessageRow
              key={message.id}
              isuser={(message.senderId === currentUser).toString()}
            >
              <Avatar
                src={
                  message.senderId === currentUser
                    ? "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
                    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                }
                alt={message.senderId}
              />
              <Box sx={{ minWidth: "400px" }}>
                <MessageBubble
                  isuser={(message.senderId === currentUser).toString()}
                  elevation={2}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.5, opacity: 0.8 }}
                  >
                    {formatTimestampWithDateFns(message.createdAt)}
                  </Typography>
                </MessageBubble>
              </Box>
            </MessageRow>
          ))}
          <div ref={messageEndRef} />
        </MessageArea>
        <InputArea>
          <Box display="flex" gap={1}>
            <TextField
              inputRef={inputRef}
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              variant="outlined"
              size="small"
              disabled={isSending}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!newMessage.trim() || isSending}
              aria-label="Send message"
            >
              {isSending ? <CircularProgress size={24} /> : <FiSend />}
            </IconButton>
          </Box>
        </InputArea>
      </ChatContainer>
    </Container>
  );
};

export default Chat;
