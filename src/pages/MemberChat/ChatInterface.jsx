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
} from "@mui/material";
import { styled } from "@mui/system";
import { format } from "date-fns";
import { CircularProgress } from "@mui/material";
import { FiSend, FiDollarSign } from "react-icons/fi";

const ChatContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));

const MessageArea = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const MessageBubble = styled(Paper)(({ isUser }) => ({
  padding: "12px 16px",
  maxWidth: "70%",
  width: "fit-content",
  marginLeft: isUser ? "auto" : "0",
  backgroundColor: isUser ? "#1976d2" : "red",
  color: isUser ? "#fff" : "#000",
  borderRadius: "12px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
  },
  minWidth: "80px",
}));

const InputArea = styled(Box)({
  padding: "20px",
  backgroundColor: "black",
  borderTop: "1px solid rgba(224, 224, 224, 0.43)",
});

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey Jane! How are you doing today?",
      sender: "John Doe",
      timestamp: new Date(2024, 0, 1, 10, 30),
    },
    {
      id: 2,
      text: "Hi John! I'm doing great, thanks for asking. How about you?",
      sender: "Jane Smith",
      timestamp: new Date(2024, 0, 1, 10, 31),
    },
    {
      id: 3,
      text: "I'm good too! Just working on that new project we discussed.",
      sender: "John Doe",
      timestamp: new Date(2024, 0, 1, 10, 32),
    },
    {
      id: 4,
      text: "That's awesome! Would you like to discuss it over coffee sometime?",
      sender: "Jane Smith",
      timestamp: new Date(2024, 0, 1, 10, 33),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const messageEndRef = useRef(null);
  const currentUser = "Jane Smith";

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

  const otherUserName =
    messages.find((msg) => msg.sender !== currentUser)?.sender || "Chat";

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage.trim(),
        sender: currentUser,
        timestamp: new Date(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ height: "100%", p: 0 }}>
      <ChatContainer>
        <AppBar position="static" sx={{ background: "black" }}>
          <Toolbar>
            <Typography variant="h3" component="div">
              {otherUserName}
            </Typography>
          </Toolbar>
        </AppBar>
        <MessageArea>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
                flexDirection:
                  message.sender === currentUser ? "row-reverse" : "row",
              }}
            >
              <Avatar
                src={
                  message.sender === currentUser
                    ? "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
                    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                }
                alt={message.sender}
              />
              <Box>
                <MessageBubble isUser={message.sender === currentUser}>
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.5, opacity: 0.8 }}
                  >
                    {format(message.timestamp, "HH:mm")}
                  </Typography>
                </MessageBubble>
              </Box>
            </Box>
          ))}
          <div ref={messageEndRef} />
        </MessageArea>
        <InputArea>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              variant="outlined"
              size="small"
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!newMessage.trim()}
              aria-label="Send message"
            >
              <FiSend />
            </IconButton>
            <IconButton
              color="secondary" // You can choose a different color
              onClick={handleSendPaymentLink}
              disabled={isPaymentLoading}
              aria-label="Send payment link"
            >
              {isPaymentLoading ? (
                <CircularProgress size={24} />
              ) : (
                <FiDollarSign />
              )}
            </IconButton>
          </Box>
        </InputArea>
      </ChatContainer>
    </Container>
  );
};

export default ChatInterface;
