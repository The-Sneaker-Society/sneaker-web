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

const GroupCreationForm = () => {
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

  const handleReset = () => {
    setGroupName("");
    setGroupDescription("");
    setGroupAvatar(null);
    setSelectedUsers([]);
    setSelectedUsersMap({});
    setSearchTerm("");
    setDebouncedSearchTerm("");
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
        maxWidth: 700,
        p: 4,
        bgcolor: "#111",
        borderRadius: 3,
        color: "#fff",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <Typography
        variant="h5"
        mb={3}
        align="center"
        sx={{ color: "#FFD100", fontWeight: 700 }}
      >
        Create a Group
      </Typography>

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
              sx={{ width: 80, height: 80, mx: "auto", bgcolor: "#333" }}
            />
          </IconButton>
        </label>
        <Typography
          variant="caption"
          display="block"
          sx={{ color: "#b3b3b3", mt: 1 }}
        >
          Upload Group Photo
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Group Name"
        variant="outlined"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiInputBase-root": { bgcolor: "#000", color: "#fff" },
          "& .MuiInputLabel-root": { color: "#b3b3b3" },
        }}
      />

      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        multiline
        rows={3}
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiInputBase-root": { bgcolor: "#000", color: "#fff" },
          "& .MuiInputLabel-root": { color: "#b3b3b3" },
        }}
      />

      <TextField
        fullWidth
        label="Search Members"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          mb: 1,
          "& .MuiInputBase-root": { bgcolor: "#000", color: "#fff" },
          "& .MuiInputLabel-root": { color: "#b3b3b3" },
        }}
      />

      <Stack sx={{ maxHeight: 150, overflowY: "auto", mb: 2 }}>
        {membersLoading && (
          <Typography variant="body2" sx={{ color: "#b3b3b3" }}>
            Loading members...
          </Typography>
        )}

        {!membersLoading &&
          users.length === 0 &&
          debouncedSearchTerm !== "" && (
            <Typography variant="body2" sx={{ color: "#b3b3b3" }}>
              No members found
            </Typography>
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
                py={0.75}
              >
                <Typography variant="body2">{fullName}</Typography>

                <Button
                  size="small"
                  variant={isSelected ? "outlined" : "contained"}
                  onClick={() => toggleUserSelection(user)}
                  sx={{
                    textTransform: "none",
                    fontSize: 12,
                    bgcolor: isSelected ? "transparent" : "#FFD100",
                    color: isSelected ? "#FFD100" : "#000",
                    borderColor: "#FFD100",
                    "&:hover": {
                      bgcolor: isSelected ? "rgba(255,209,0,0.08)" : "#ffde33",
                    },
                  }}
                >
                  {isSelected ? (
                    <>
                      <CheckIcon fontSize="small" sx={{ mr: 0.5 }} /> Added
                    </>
                  ) : (
                    <>
                      <AddIcon fontSize="small" sx={{ mr: 0.5 }} /> Add
                    </>
                  )}
                </Button>
              </Box>
            );
          })}
      </Stack>

      {selectedUsers.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
            Selected Members
          </Typography>

          {selectedUsers.map((id) => {
            const user = selectedUsersMap[id];
            if (!user) return null;

            return (
              <Box
                key={id}
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ mb: 0.5 }}
              >
                <Typography variant="body2">
                  {user.firstName} {user.lastName}
                </Typography>
                <Button
                  size="small"
                  onClick={() => toggleUserSelection(user)}
                  sx={{
                    minWidth: 0,
                    px: 1,
                    color: "#ff6b6b",
                    textTransform: "none",
                  }}
                >
                  ×
                </Button>
              </Box>
            );
          })}
        </Box>
      )}

      <Box textAlign="right" mt={1}>
        <Button
          sx={{
            mr: 2,
            color: "#ff6b6b",
            textTransform: "none",
          }}
          onClick={handleReset}
        >
          Cancel
        </Button>

        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={creating || !groupName.trim()}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#FFD100",
            color: "#000",
            "&:hover": { bgcolor: "#ffde33" },
          }}
        >
          {creating ? "Creating..." : "Create Group"}
        </Button>
      </Box>

      {createError && (
        <Typography color="error" mt={2} variant="body2">
          {createError.message}
        </Typography>
      )}
    </Box>
  );
};

export default GroupCreationForm;
