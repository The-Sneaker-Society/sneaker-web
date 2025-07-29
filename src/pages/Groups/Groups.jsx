import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const CreateGroupPage = () => {
  const mockUsers = [
    { id: 1, name: "John Doe", avatar: "/avatar1.jpg" },
    { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg" },
    { id: 3, name: "Alice Johnson", avatar: "/avatar3.jpg" },
    { id: 4, name: "Bob Lee", avatar: "/avatar4.jpg" },
  ];

  // State to hold the group description
  const [description, setDescription] = useState("");

  // State to show/hide the user search panel
  const [showUserSearch, setShowUserSearch] = useState(false);

  // State for search input (to filter users)
  const [searchTerm, setSearchTerm] = useState("");

  // State for selected users
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Handle adding a user to selected list
  const handleAddUser = (user) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // Filter users based on search input
  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create group (submit)
  const handleCreate = () => {
    console.log("Group Description:", description);
    console.log("Selected Users:", selectedUsers);
    // Submit logic here
  };

  return (
    <Box
      sx={{
        width: 500,
        margin: "40px auto",
        p: 4,
        bgcolor: "#f2f2f2",
        borderRadius: "12px",
      }}
    >
      <Typography
        variant="h2"
        fontWeight="bold"
        align="center"
        mb={3}
        sx={{
          color: "black",
        }}
      >
        New Group
      </Typography>

      {/* Description Input */}
      <TextField
        fullWidth
        variant="filled"
        label="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{
          mb: 3,
          backgroundColor: "white",
          "& .MuiFilledInput-root": {
            backgroundColor: "white",
          },
          "& .MuiInputLabel-root": {
            color: "black",
          },
          "& .MuiFilledInput-input": {
            color: "black",
          },
        }}
        InputProps={{ disableUnderline: true }}
      />
      {/* Toggle view: Add button vs. Search + User List */}
      {!showUserSearch ? (
        <Box
          sx={{
            height: 200,
            border: "1px solid #999",
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            cursor: "pointer",
            bgcolor: "#fff",
          }}
          onClick={() => setShowUserSearch(true)}
        >
          <Box textAlign="center" sx={{}}>
            <Typography
              variant="body2"
              sx={{
                color: "black",
              }}
            >
              Add
            </Typography>
            <AddIcon
              fontSize="large"
              sx={{
                color: "black",
              }}
            />
          </Box>
        </Box>
      ) : (
        // After Add is clicked: Show search + list of users

        <Box sx={{ bgcolor: "#fff", p: 2, mb: 2 }}>
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          {/* Render filtered user list */}
          {filteredUsers.map((user) => (
            <Box
              key={user.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar src={user.avatar} alt={user.name} />
                <Typography>{user.name}</Typography>
              </Box>
              <IconButton
                sx={{
                  bgcolor: "#FFD700",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#e6c200" },
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
      {/* Cancel & Create buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          sx={{ mr: 2, bgcolor: "white", color: "black", fontWeight: "bold" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#FFD700",
            color: "black",
            fontWeight: "bold",
          }}
        >
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default CreateGroupPage;
