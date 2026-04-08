import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { GET_GROUPS } from "../../context/graphql/getGroups";

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

const GroupCreationForm = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupAvatar, setGroupAvatar] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersMap, setSelectedUsersMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [createGroup, { loading: creating, error: createError }] = useMutation(
    CREATE_GROUP,
    {
      refetchQueries: [{ query: GET_GROUPS }],
      awaitRefetchQueries: true,
      onCompleted: () => {
        setGroupName("");
        setGroupDescription("");
        setGroupAvatar(null);
        setSelectedUsers([]);
        setSelectedUsersMap({});
        setSearchTerm("");
        setDebouncedSearchTerm("");
        onClose?.();
      },
    },
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
    if (debouncedSearchTerm.trim().length > 0) {
      fetchMembers({ variables: { searchTerm: debouncedSearchTerm } });
    }
  }, [debouncedSearchTerm, fetchMembers]);

  const toggleUserSelection = (user) => {
    if (selectedUsers.includes(user.id)) {
      setSelectedUsers((prev) => prev.filter((id) => id !== user.id));
      setSelectedUsersMap((prev) => {
        const next = { ...prev };
        delete next[user.id];
        return next;
      });
    } else {
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
    if (!groupName.trim()) {
      alert("Please enter a group name.");
      return;
    }

    const variables = {
      name: groupName.trim(),
      description: groupDescription.trim(),
      avatar: groupAvatar || "https://via.placeholder.com/150",
      memberIds: selectedUsers,
    };

    createGroup({ variables });
  };

  const users = data?.members || [];

  return (
    <Box
      sx={{
        width: "100%",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" mb={2} align="center" sx={{ color: "#FFD100" }}>
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

        {!membersLoading &&
          users.length === 0 &&
          debouncedSearchTerm !== "" && (
            <Typography>No members found</Typography>
          )}

        {!membersLoading &&
          users.map((user) => {
            const fullName = `${user.firstName} ${user.lastName}`;
            const isSelected = selectedUsers.includes(user.id);

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
                  variant={isSelected ? "outlined" : "contained"}
                  onClick={() => toggleUserSelection(user)}
                >
                  {isSelected ? (
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

      <Box sx={{ mb: 2 }}>
        {selectedUsers.length > 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Selected Members
            </Typography>

            {selectedUsers.map((id) => {
              const user = selectedUsersMap[id];
              if (!user) return null;

              return (
                <Box key={id} display="flex" alignItems="center" gap={1}>
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
            })}
          </>
        )}
      </Box>

      <Box textAlign="right">
        <Button sx={{ mr: 2 }} onClick={onClose}>
          Cancel
        </Button>

        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={creating || !groupName.trim()}
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
  );
};

export default GroupCreationForm;
