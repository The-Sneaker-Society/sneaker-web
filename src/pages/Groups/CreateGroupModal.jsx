import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Stack,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { gql, useMutation, useLazyQuery } from "@apollo/client";

const CREATE_GROUP = gql`
  mutation CreateGroup(
    $name: String!
    $description: String
    $avatar: String
    $memberIds: [ID!]
  ) {
    createGroup(
      name: $name
      description: $description
      avatar: $avatar
      memberIds: $memberIds
    ) {
      id
      name
      description
      avatar
      members {
        id
        firstName
        lastName
        email
      }
      createdAt
    }
  }
`;

const GET_MEMBERS = gql`
  query Members($searchTerm: String) {
    members(searchTerm: $searchTerm) {
      id
      firstName
      lastName
      email
    }
  }
`;

const GroupCreationModal = ({ open, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupAvatar, setGroupAvatar] = useState(null);

  // Store only IDs of selected users
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Cache full user info for stable display
  const [selectedUsersMap, setSelectedUsersMap] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [createGroup, { loading: creating, error: createError }] = useMutation(
    CREATE_GROUP,
    {
      onCompleted: () => {
        setGroupName("");
        setGroupDescription("");
        setGroupAvatar(null);
        setSelectedUsers([]);
        setSelectedUsersMap({});
        setSearchTerm("");
        onClose();
      },
    }
  );

  const [fetchMembers, { data, loading: membersLoading }] =
    useLazyQuery(GET_MEMBERS);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      fetchMembers({ variables: { searchTerm: debouncedSearchTerm } });
    }
  }, [debouncedSearchTerm, fetchMembers]);

  const toggleUserSelection = (user) => {
    if (selectedUsers.includes(user.id)) {
      // Remove user
      setSelectedUsers((prev) => prev.filter((id) => id !== user.id));
      setSelectedUsersMap((prev) => {
        const newMap = { ...prev };
        delete newMap[user.id];
        return newMap;
      });
    } else {
      // Add user
      setSelectedUsers((prev) => [...prev, user.id]);
      setSelectedUsersMap((prev) => ({ ...prev, [user.id]: user }));
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGroupAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = () => {
    if (!groupName || selectedUsers.length === 0) {
      alert("Please enter a group name and select at least one member.");
      return;
    }
    createGroup({
      variables: {
        name: groupName,
        description: groupDescription,
        avatar: groupAvatar,
        memberIds: selectedUsers,
      },
    });
  };

  const users = data?.members || [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 400,
          p: 3,
          bgcolor: "background.paper",
          mx: "auto",
          mt: "10vh",
          borderRadius: 2,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h4" mb={2} align="center">
          Create a Group
        </Typography>

        <Box textAlign="center" mb={2}>
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
          <Typography variant="caption" display="block">
            Upload Group Photo
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Group Name"
          variant="outlined"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Search Members"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 1 }}
        />

        <Stack sx={{ maxHeight: 150, overflowY: "auto", mb: 2 }}>
          {membersLoading && <Typography>Loading members...</Typography>}
          {createError && (
            <Typography color="error">{createError.message}</Typography>
          )}
          {!membersLoading &&
            users.length === 0 &&
            debouncedSearchTerm !== "" && (
              <Typography>No members found</Typography>
            )}

          {/* User list */}
          {!membersLoading &&
            users.map((user) => {
              const fullName = `${user.firstName} ${user.lastName}`;
              return (
                <Box
                  key={user.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                >
                  <Typography>{fullName}</Typography>
                  <Button
                    size="small"
                    variant={
                      selectedUsers.includes(user.id) ? "outlined" : "contained"
                    }
                    onClick={() => toggleUserSelection(user)}
                  >
                    {selectedUsers.includes(user.id) ? (
                      <>
                        <CheckIcon fontSize="small" /> Added
                      </>
                    ) : (
                      <>
                        <AddIcon fontSize="small" /> Add
                      </>
                    )}
                  </Button>
                </Box>
              );
            })}

          {/* Selected users section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">Selected Members</Typography>
            {selectedUsers.length === 0 ? (
              <Typography>No members selected yet</Typography>
            ) : (
              selectedUsers.map((id) => {
                const user = selectedUsersMap[id];
                if (!user) return null;
                return (
                  <Box key={id} display="flex" alignItems="center">
                    <Typography>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => toggleUserSelection(user)}
                    >
                      ×
                    </Button>
                  </Box>
                );
              })
            )}
          </Box>
        </Stack>

        <Box textAlign="right">
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={creating || selectedUsers.length === 0}
          >
            {creating ? "Creating..." : "Create Group"}
          </Button>
        </Box>

        {createError && (
          <Typography color="error" mt={2}>
            {createError.message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default GroupCreationModal;
