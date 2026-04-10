import { useMemo, useState } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GROUPS } from "../../context/graphql/getGroups";

const GroupDisplay = ({ currentUserId, currentUserLoading }) => {
  const [tab, setTab] = useState("trending");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_GROUPS);
  const allGroups = data?.getGroups || [];

  const baseGroups = useMemo(() => {
    if (tab === "my") {
      if (currentUserLoading) return null;

      return allGroups.filter((group) =>
        (group.members || []).some((member) => member.id === currentUserId),
      );
    }

    return allGroups;
  }, [tab, allGroups, currentUserId, currentUserLoading]);

  const filteredGroups = useMemo(() => {
    if (baseGroups === null) return null;

    return baseGroups.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [baseGroups, search]);

  const handleGroupClick = (group) => {
    navigate(`/member/groups/${group.id}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 520,
        bgcolor: "#8e8e8e",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      {/* Tabs */}
      <Box sx={{ bgcolor: "#8e8e8e", p: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            bgcolor: "#232323",
            borderRadius: "999px",
            p: 0.5,
          }}
        >
          <Button
            onClick={() => setTab("trending")}
            sx={{
              flex: 1,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              bgcolor: tab === "trending" ? "#FFD100" : "transparent",
              color: tab === "trending" ? "#000" : "#FFD100",
              "&:hover": {
                bgcolor: tab === "trending" ? "#ffde33" : "transparent",
              },
            }}
          >
            Trending Groups
          </Button>

          <Button
            onClick={() => setTab("my")}
            sx={{
              flex: 1,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              bgcolor: tab === "my" ? "#FFD100" : "transparent",
              color: tab === "my" ? "#000" : "#FFD100",
              "&:hover": {
                bgcolor: tab === "my" ? "#ffde33" : "transparent",
              },
            }}
          >
            My Groups
          </Button>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, bgcolor: "#8e8e8e" }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search for a group"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            bgcolor: "#000",
            borderRadius: "999px",
            "& fieldset": { border: "none" },
            "& .MuiInputBase-input": {
              px: 2,
              py: 1.2,
              color: "#fff",
            },
          }}
        />
      </Box>

      {/* List / Messages */}
      <Box sx={{ bgcolor: "#8e8e8e", flex: 1 }}>
        {loading && (
          <Typography sx={{ px: 2, py: 2 }} color="#232323">
            Loading groups...
          </Typography>
        )}

        {!loading && tab === "my" && currentUserLoading && (
          <Typography sx={{ px: 2, py: 2 }} color="#232323">
            Loading your groups...
          </Typography>
        )}

        {error && (
          <Typography sx={{ px: 2, py: 2 }} color="error">
            Failed to load groups
          </Typography>
        )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          tab === "trending" &&
          allGroups.length === 0 && (
            <Typography sx={{ px: 2, py: 2 }} color="#232323">
              No groups have been created yet.
            </Typography>
          )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          tab === "my" &&
          baseGroups.length === 0 && (
            <Typography sx={{ px: 2, py: 2 }} color="#232323">
              You haven't joined any groups yet.
            </Typography>
          )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          baseGroups.length > 0 &&
          filteredGroups &&
          filteredGroups.length === 0 && (
            <Typography sx={{ px: 2, py: 2 }} color="#232323">
              No groups match your search.
            </Typography>
          )}

        {!loading &&
          !error &&
          filteredGroups &&
          filteredGroups.map((group) => {
            const memberCount = (group.members || []).length;

            return (
              <Box
                key={group.id}
                onClick={() => handleGroupClick(group)}
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #d0d0d0",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#a2a2a2",
                  },
                }}
              >
                <Stack spacing={0.3}>
                  <Typography fontWeight={700} fontSize={14} color="#000">
                    {group.name}
                  </Typography>
                  <Typography fontSize={12} sx={{ color: "#333" }}>
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    width: 70,
                    height: 40,
                    borderRadius: 1,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: group.avatar ? "transparent" : "#2b2b2b",
                    color: group.avatar ? "inherit" : "#FFD100",
                    fontWeight: 700,
                    fontSize: 18,
                    textTransform: "uppercase",
                    backgroundImage: group.avatar
                      ? `url(${group.avatar})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!group.avatar && (group.name?.trim()?.[0] || "G")}
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default GroupDisplay;
