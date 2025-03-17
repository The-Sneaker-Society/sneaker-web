import React, { useState } from "react";
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ChatSidebar = ({ onClose }) => {
  const [conversations, setConversations] = useState([
    { name: "Jane", message: "Hey! How are you?", timestamp: "2 minutes ago" },
    {
      name: "Bob",
      message: "What are you up to today?",
      timestamp: "5 hours ago",
    },
    { name: "Alice", message: "Did you get my email?", timestamp: "1 day ago" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Drawer variant="permanent">
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose} aria-label="close-sidebar">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography>Messages</Typography>
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        <List>
          {filteredConversations.map((conversation, index) => (
            <ListItem key={index} button sx={{ px: 1, py: 2 }}>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1">
                    {conversation.name}
                  </Typography>
                }
                secondary={
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2">
                      {conversation.message}
                    </Typography>
                    <Typography variant="caption">
                      {conversation.timestamp}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
export default ChatSidebar;
