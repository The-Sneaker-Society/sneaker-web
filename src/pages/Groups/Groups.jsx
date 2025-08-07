import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

const CreateGroupPage = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupAvatar, setGroupAvatar] = useState(null);

  const users = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
    { id: "4", name: "Diana" },
  ];

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddUser = (user) => {
    if (selectedUsers.includes(user.id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user.id]);
    }
  };

  const isUserSelected = (id) => selectedUsers.includes(id);

  const handleCreate = () => {
    console.log("Creating group:", {
      groupName,
      groupDescription,
      selectedUsers,
      groupAvatar,
    });
    // submit logic here
  };

  const handleCancel = () => {
    setGroupName("");
    setGroupDescription("");
    setSearchQuery("");
    setSelectedUsers([]);
    setGroupAvatar(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
      }}
    >
      <Box
        sx={{
          width: 500,
          mx: "auto",
          p: 4,
          bgcolor: "gray",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h2"
          fontWeight="600"
          align="center"
          mb={3}
          color="white"
        >
          Create a Group
        </Typography>

        {/* Avatar Upload */}
        <Box textAlign="center" mb={3}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-avatar"
            type="file"
            onChange={handleAvatarUpload}
          />
          <label htmlFor="upload-avatar">
            <IconButton component="span">
              <Avatar
                src={groupAvatar || ""}
                sx={{ width: 80, height: 80, mx: "auto" }}
              />
            </IconButton>
          </label>
          <Typography variant="h5" color="textSecondary">
            Upload Group Photo
          </Typography>
        </Box>

        {/* Group Name Input */}
        <TextField
          fullWidth
          variant="filled"
          label="Name your group"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Description Input */}
        <TextField
          fullWidth
          variant="filled"
          label="Describe your group"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          sx={{ mb: 3 }}
          multiline
          rows={3}
        />

        {/* Search Field */}
        <TextField
          fullWidth
          variant="filled"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Filtered Users */}
        <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 3 }}>
          {users
            .filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((user) => (
              <Stack
                key={user.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ py: 1 }}
              >
                <Typography>{user.name}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAddUser(user)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    backgroundColor: isUserSelected(user.id)
                      ? "#d0f0d0"
                      : "#4a90e2",
                    color: isUserSelected(user.id) ? "#333" : "#fff",
                    "&:hover": {
                      backgroundColor: isUserSelected(user.id)
                        ? "#c8e6c9"
                        : "#3f7ecb",
                    },
                  }}
                >
                  {isUserSelected(user.id) ? (
                    <>
                      <CheckIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Added
                    </>
                  ) : (
                    <>
                      <AddIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Add
                    </>
                  )}
                </Button>
              </Stack>
            ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Action Buttons */}
        <Box textAlign="right">
          <Button
            onClick={handleCancel}
            variant="contained"
            sx={{
              mr: 2,
              backgroundColor: "white",
              color: "black",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              backgroundColor: "#FFD100",
              textTransform: "none",
              fontWeight: 600,
              color: "black",
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateGroupPage;
