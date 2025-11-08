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
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [createGroup, { loading: creating, error: createError }] = useMutation(
    CREATE_GROUP,
    {
      onCompleted: () => {
        setGroupName("");
        setGroupDescription("");
        setGroupAvatar(null);
        setSelectedUsers([]);
        setSearchTerm("");
        onClose();
      },
    }
  );

  const [fetchMembers, { data, loading: membersLoading }] =
    useLazyQuery(GET_MEMBERS);

  useEffect(() => {
    if (searchTerm.length > 0) {
      fetchMembers({ variables: { searchTerm } });
    }
  }, [searchTerm, fetchMembers]);

  const toggleUserSelection = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
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
          {!membersLoading && users.length === 0 && searchTerm !== "" && (
            <Typography>No members found</Typography>
          )}
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
                    onClick={() => toggleUserSelection(user.id)}
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
        </Stack>

        <Box textAlign="right">
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={creating}
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
