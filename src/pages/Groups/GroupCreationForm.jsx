import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { GET_GROUPS } from "../../context/graphql/getGroups";
import { tokens } from "../../theme/theme";

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
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

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

    createGroup({
      variables: {
        name: groupName.trim(),
        description: groupDescription.trim(),
        avatar: groupAvatar || "https://via.placeholder.com/150",
        memberIds: selectedUsers,
      },
    });
  };

  const users = data?.members || [];

  const textPrimary = isDark ? colors.grey[100] : colors.grey[100];
  const textSecondary = isDark ? colors.grey[300] : colors.grey[500];
  const accent = colors.yellowAccent[500];
  const accentHover = colors.yellowAccent[400];
  const danger = colors.redAccent[400];

  const fieldBg = isDark
    ? alpha(colors.primary[400], 0.22)
    : alpha(colors.grey[900], 0.55);

  const fieldBorder = isDark
    ? alpha(colors.grey[300], 0.16)
    : alpha(colors.grey[400], 0.5);

  const memberRowBg = isDark
    ? alpha(colors.primary[400], 0.28)
    : alpha(colors.grey[900], 0.42);

  const sharedTextFieldStyles = {
    "& .MuiOutlinedInput-root": {
      bgcolor: fieldBg,
      color: textPrimary,
      borderRadius: 1.75,
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: fieldBorder,
      },
      "&:hover fieldset": {
        borderColor: alpha(accent, 0.7),
      },
      "&.Mui-focused fieldset": {
        borderColor: accent,
        borderWidth: "1px",
      },
    },
    "& .MuiInputLabel-root": {
      color: textSecondary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: accent,
    },
    "& .MuiInputBase-input": {
      color: textPrimary,
    },
    "& .MuiInputBase-input::placeholder": {
      color: textSecondary,
      opacity: 1,
    },
    "& .MuiOutlinedInput-input::placeholder": {
      color: textSecondary,
      opacity: 1,
    },
    "& .MuiOutlinedInput-root textarea::placeholder": {
      color: textSecondary,
      opacity: 1,
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 760,
        mx: "auto",
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: "transparent",
        color: textPrimary,
      }}
    >
      <Typography
        variant="h5"
        mb={3}
        align="center"
        sx={{
          color: accent,
          fontWeight: 700,
        }}
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
          <IconButton component="span" aria-label="Upload group photo">
            <Avatar
              src={groupAvatar || ""}
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                bgcolor: isDark
                  ? alpha(colors.grey[700], 0.85)
                  : alpha(colors.grey[700], 0.35),
                color: isDark ? colors.grey[100] : colors.grey[300],
              }}
            />
          </IconButton>
        </label>
        <Typography
          variant="caption"
          display="block"
          sx={{ color: textSecondary, mt: 1 }}
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
        sx={{ mb: 2, ...sharedTextFieldStyles }}
      />

      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        multiline
        rows={4}
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
        sx={{ mb: 2, ...sharedTextFieldStyles }}
      />

      <TextField
        fullWidth
        label="Search Members"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 1.25, ...sharedTextFieldStyles }}
      />

      <Stack
        spacing={1}
        sx={{
          maxHeight: 180,
          overflowY: "auto",
          mb: 2,
        }}
      >
        {membersLoading && (
          <Typography variant="body2" sx={{ color: textSecondary }}>
            Loading members...
          </Typography>
        )}

        {!membersLoading &&
          users.length === 0 &&
          debouncedSearchTerm !== "" && (
            <Typography variant="body2" sx={{ color: textSecondary }}>
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1.5,
                  py: 1,
                  px: 1.25,
                  borderRadius: 1.5,
                  bgcolor: memberRowBg,
                  border: `1px solid ${fieldBorder}`,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: textPrimary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fullName}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: textSecondary,
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>

                <Button
                  size="small"
                  variant={isSelected ? "outlined" : "contained"}
                  onClick={() => toggleUserSelection(user)}
                  sx={{
                    flexShrink: 0,
                    minWidth: 84,
                    textTransform: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: "999px",
                    bgcolor: isSelected ? "transparent" : accent,
                    color: isSelected ? accent : colors.grey[100],
                    borderColor: accent,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: isSelected ? alpha(accent, 0.08) : accentHover,
                      borderColor: accent,
                      boxShadow: "none",
                    },
                  }}
                >
                  {isSelected ? (
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
              </Box>
            );
          })}
      </Stack>

      {selectedUsers.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: 700, color: textPrimary }}
          >
            Selected Members
          </Typography>

          <Stack spacing={1}>
            {selectedUsers.map((id) => {
              const user = selectedUsersMap[id];
              if (!user) return null;

              return (
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 1.25,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: memberRowBg,
                    border: `1px solid ${fieldBorder}`,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: textPrimary, minWidth: 0 }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>

                  <Button
                    size="small"
                    onClick={() => toggleUserSelection(user)}
                    sx={{
                      minWidth: 0,
                      px: 1,
                      color: danger,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1.5,
          mt: 2,
        }}
      >
        <Button
          onClick={handleReset}
          sx={{
            color: danger,
            textTransform: "none",
            fontWeight: 600,
          }}
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
            px: 2.5,
            bgcolor: accent,
            color: colors.grey[100],
            boxShadow: "none",
            "&:hover": {
              bgcolor: accentHover,
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: alpha(accent, 0.35),
              color: alpha(colors.grey[100], 0.5),
            },
          }}
        >
          {creating ? "Creating..." : "Create Group"}
        </Button>
      </Box>

      {createError && (
        <Typography sx={{ color: danger, mt: 2 }} variant="body2">
          {createError.message}
        </Typography>
      )}
    </Box>
  );
};

export default GroupCreationForm;
