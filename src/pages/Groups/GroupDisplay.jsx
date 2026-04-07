import { useMemo, useState } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GROUPS } from "../../context/graphql/getGroups";
import GroupCreationForm from "./GroupCreationForm";

const GroupDisplay = ({ currentUserId }) => {
  const [tab, setTab] = useState("trending");
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_GROUPS);
  const allGroups = data?.getGroups || [];

  const filtered = useMemo(() => {
    const baseList =
      tab === "my"
        ? allGroups.filter((group) =>
            (group.members || []).some((member) => member.id === currentUserId),
          )
        : allGroups;

    return baseList.filter((group) =>
      group.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tab, allGroups, search, currentUserId]);

  const handleGroupClick = (group) => {
    navigate(`/groups/${group.id}`);
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#000",
        py: 2,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "gray",
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ bgcolor: "gray", p: 1 }}>
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

        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search for a group"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: "black",
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

        <Box sx={{ bgcolor: "gray", flex: 1 }}>
          {loading && (
            <Typography sx={{ px: 2, py: 2 }}>Loading groups...</Typography>
          )}

          {error && (
            <Typography sx={{ px: 2, py: 2 }} color="error">
              Failed to load groups
            </Typography>
          )}

          {!loading && !error && filtered.length === 0 && (
            <Typography sx={{ px: 2, py: 2 }} color="text.secondary">
              No groups found
            </Typography>
          )}

          {!loading &&
            !error &&
            filtered.map((group) => (
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
                }}
              >
                <Stack spacing={0.3}>
                  <Typography fontWeight={700} fontSize={14}>
                    {group.name}
                  </Typography>
                  <Typography fontSize={12} color="text.secondary">
                    {(group.members || []).length} members
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    width: 70,
                    height: 40,
                    bgcolor: "#c4c4c4",
                    borderRadius: 1,
                    backgroundImage: group.avatar ? `url(${group.avatar})` : "",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Box>
            ))}
        </Box>

        <Box
          sx={{
            bgcolor: "#000",
            p: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => setOpenCreate(true)}
            sx={{
              minWidth: 100,
              height: 40,
              borderRadius: 2,
              bgcolor: "#FFD100",
              color: "#000",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#ffde33" },
            }}
          >
            + New Group
          </Button>
        </Box>
      </Box>

      {openCreate && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            zIndex: 1300,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 520 }}>
            <GroupCreationForm onClose={() => setOpenCreate(false)} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default GroupDisplay;
