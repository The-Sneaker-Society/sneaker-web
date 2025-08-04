import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  InputAdornment,
  IconButton,
  Grid2,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";

const CreateGroupPage = () => {
  const mockUsers = [
    { id: 1, name: "John Doe", avatar: "/avatar1.jpg" },
    { id: 2, name: "Jane Smith", avatar: "/avatar2.jpg" },
    { id: 3, name: "Alice Johnson", avatar: "/avatar3.jpg" },
    { id: 4, name: "Bob Lee", avatar: "/avatar4.jpg" },
    { id: 5, name: "John Doe", avatar: "/avatar1.jpg" },
    { id: 6, name: "Jane Smith", avatar: "/avatar2.jpg" },
    { id: 7, name: "Alice Johnson", avatar: "/avatar3.jpg" },
    { id: 8, name: "Bob Lee", avatar: "/avatar4.jpg" },
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

  const isUserSelected = (id) => selectedUsers.some((u) => u.id === id);

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
      {/* User Search / Add Section */}
      {!showUserSearch ? (
        <Box
          sx={{
            height: 300,
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
            cursor: "pointer",
            bgcolor: "#fff",
          }}
          onClick={() => setShowUserSearch(true)}
        >
          <Box
            sx={{
              marginTop: "30px",
              marginLeft: "30px",
              border: "1px solid #999",
              height: 100,
              width: 100,
            }}
          >
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
        <Box sx={{ p: 2, mb: 2 }}>
          {/* Search Input */}
          <TextField
            fullWidth
            variant="outlined"
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            InputProps={{
              disableUnderline: true,
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
          />

          {/* Render filtered user list */}

          <Grid2 container spacing={2}>
            {filteredUsers.map((user) => (
              <Grid2 item xs={6} key={user.id}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={1}
                  mb={2}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={user.avatar} alt={user.name} />
                    <Typography color="black">{user.name}</Typography>
                  </Box>
                  <IconButton
                    onClick={() =>
                      isUserSelected(user.id)
                        ? setSelectedUsers(
                            selectedUsers.filter((u) => u.id !== user.id)
                          )
                        : setSelectedUsers([...selectedUsers, user])
                    }
                    sx={{
                      bgcolor: isUserSelected(user.id) ? "#4CAF50" : "#FFD100",
                      "&:hover": {
                        bgcolor: isUserSelected(user.id)
                          ? "#45A049"
                          : "#FFC300",
                      },
                    }}
                  >
                    {isUserSelected(user.id) ? <CheckIcon /> : <AddIcon />}
                  </IconButton>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      )}

      {/* Action Buttons */}
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
          onClick={() => {
            setDescription("");
            setSelectedUsers([]);
            setSearchTerm("");
            setShowUserSearch(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleCreate}
          sx={{
            bgcolor: "#FFD100",
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
