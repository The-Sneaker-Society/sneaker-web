import { useState } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const trendingGroups = [
  { id: 1, name: "Sneaker Surgeons", members: 40 },
  { id: 2, name: "West Coast Customs", members: 10 },
  { id: 3, name: "Custom Kicks Heads", members: 18 },
  { id: 4, name: "Kicks n Kicks", members: 20 },
  { id: 5, name: "Khe kick Surgeons", members: 40 },
  { id: 6, name: "East Coast Customs", members: 10 },
  { id: 7, name: "The Kicks Heads", members: 18 },
  { id: 8, name: "Cleaning n Kicks", members: 20 },
];

const myGroups = [
  { id: 9, name: "Sneaker Restorers", members: 7 },
  { id: 10, name: "Sneaker Photos", members: 22 },
  { id: 11, name: "Kicks n Kicks", members: 20 },
  { id: 12, name: "Sneaker Surgeons", members: 40 },
  { id: 13, name: "West Coast Customs", members: 10 },
  { id: 14, name: "Custom Kicks Heads", members: 18 },
  { id: 15, name: "Kicks n Kicks", members: 20 },
];

const GroupDisplay = () => {
  const [tab, setTab] = useState("trending");
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate(); // for routing [web:45][web:57]

  const displayedGroups =
    tab === "trending"
      ? trendingGroups.filter((group) =>
          group.name.toLowerCase().includes(search.toLowerCase())
        )
      : myGroups.filter((group) =>
          group.name.toLowerCase().includes(search.toLowerCase())
        );

  const handleGroupClick = (group) => {
    // adjust the path to match your routing convention, e.g. /groups/:id
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
        {/* Tabs */}
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

        {/* Search */}
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

        {/* Group list */}
        <Box sx={{ bgcolor: "gray", flex: 1 }}>
          {displayedGroups.length === 0 && (
            <Typography
              sx={{ px: 2, py: 2 }}
              variant="body2"
              color="text.secondary"
            >
              No groups found
            </Typography>
          )}

          {displayedGroups.map((group) => (
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
                cursor: "pointer", // show hand on hover [web:42][web:43]
              }}
            >
              <Stack spacing={0.3}>
                <Typography fontWeight={700} fontSize={14}>
                  {group.name}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  {group.members} members
                </Typography>
              </Stack>

              <Box
                sx={{
                  width: 70,
                  height: 40,
                  bgcolor: "#c4c4c4",
                  borderRadius: 1,
                }}
              />
            </Box>
          ))}
        </Box>

        {/* Bottom create button */}
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
              minWidth: 80,
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
    </Box>
  );
};

export default GroupDisplay;
