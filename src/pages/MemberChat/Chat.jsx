import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import ChatSidebar from "../Chats/ChatSidebar"; // Assuming this path is correct
const sampleMessages = [
  { text: "Hi John!", sender: "Jane", timestamp: new Date() },
  { text: "Hey Jane!", sender: "John", timestamp: new Date() },
  { text: "How are you?", sender: "Jane", timestamp: new Date() },
  {
    text: "I'm good, thanks. How about you?",
    sender: "John",
    timestamp: new Date(),
  },
  { text: "I am doing well!", sender: "Jane", timestamp: new Date() },
  { text: "I am doing well!", sender: "me", timestamp: new Date() },
  { text: "I am doing well!", sender: "Jane", timestamp: new Date() },
  { text: "I am doing well!", sender: "me", timestamp: new Date() },
  { text: "I am doing well!", sender: "Jane", timestamp: new Date() },
  { text: "I am doing well!", sender: "Jane", timestamp: new Date() },
  { text: "I am doing well!", sender: "Jane", timestamp: new Date() },
];

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Adjust breakpoint as needed
  const lastMessageRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    setMessages([
      ...messages,
      { text: message, sender: "me", timestamp: new Date() },
    ]);
    setMessage("");
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: "100%",
        }}
      >
        <Box sx={{ width: 250, borderLeft: "1px solid #e0e0e0" }}>
          <ChatSidebar onClose={() => {}} />
        </Box>
        <AppBar position="static">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ bgcolor: "white", mr: 2 }}>J</Avatar>
            <Typography variant="h6">John</Typography>
          </Box>
        </AppBar>
        <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
          <List sx={{ marginBottom: "16px" }}>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                alignItems="flex-start"
                sx={{
                  justifyContent:
                    msg.sender === "me" ? "flex-end" : "flex-start",
                }}
                ref={index === messages.length - 1 ? lastMessageRef : null}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: msg.sender === "me" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        msg.sender === "me" ? "secondary.main" : "primary.main",
                      mr: msg.sender === "me" ? 0 : 2,
                      ml: msg.sender === "me" ? 2 : 0,
                    }}
                  >
                    {msg.sender[0].toUpperCase()}
                  </Avatar>
                  <Box
                    component="div"
                    sx={{
                      borderRadius: "10px",
                      padding: "8px 12px",
                      backgroundColor:
                        msg.sender === "me"
                          ? "secondary.light"
                          : "primary.light",
                      maxWidth: "70%",
                    }}
                  >
                    <Typography sx={{ color: "common.white" }}>
                      {msg.text}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(msg.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        <form onSubmit={handleSend}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              sx={{ flexGrow: 1, mr: 1 }}
              fullWidth
            />
            <IconButton type="submit">
              <SendIcon />
            </IconButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Chat;
