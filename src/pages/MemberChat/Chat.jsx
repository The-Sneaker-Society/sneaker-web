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
  Drawer,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import MicOff from "./Icons/MicOff";
import InsertPhoto from "./Icons/InsertPhoto";
import AttachFile from "./Icons/AttachFile";
import ChatSidebar from "../Chats/ChatSidebar";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
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
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const open = Boolean(anchorEl);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
        <Box sx={{ width: 250, overflow: "auto" }} role="presentation">
          <ChatSidebar onClose={toggleSidebar} />
        </Box>
      </Drawer>
      <AppBar position="static">
        <Box
          sx={{ display: "flex", alignItems: "center", padding: "8px 12px" }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="toggle-sidebar"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: "white", mr: 2 }}>J</Avatar>
          <Typography variant="h6">John</Typography>
        </Box>
      </AppBar>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List sx={{ marginBottom: "16px" }}>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              sx={{
                justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
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
                      msg.sender === "me" ? "secondary.light" : "primary.light",
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
          {/* Commenting out Until we sepport on Backend */}
          {/* <Stack
            direction="row"
            alignItems="center"
            justifyContent="end"
            sx={{ px: 2, py: 1, bgcolor: "background.default" }}
          >
            <AttachFile />
            <InsertPhoto />
          </Stack> */}
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
        </Box>
      </form>
    </Box>
  );
};

export default Chat;
