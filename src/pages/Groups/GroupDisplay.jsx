import { useMemo, useState } from "react";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GROUPS } from "../../context/graphql/getGroups";
import { useColors } from "../../theme/colors";

const GroupDisplay = ({ currentUserId, currentUserLoading }) => {
  const [tab, setTab] = useState("trending");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const colors = useColors();
  const isDark = colors.isDark;

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

  const accent = colors.primary;
  const containerBg = colors.sidebarBg;
  const textOnSidebar = colors.sidebarText;
  const textSecondary = colors.textSecondary;
  const borderSubtle = colors.borderSubtle;
  const inputBg = isDark
    ? colors.accent.primary[800]
    : colors.accent.primary[400];
  const inputText = textOnSidebar;
  const hoverBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const tabHoverBg = isDark ? "rgba(255,195,28,0.08)" : "rgba(255,195,28,0.10)";
  const activeTabText = colors.textInverse;

  const activeTabSx = {
    flex: 1,
    borderRadius: "999px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: 14,
    bgcolor: accent,
    color: activeTabText,
    "&:hover": {
      bgcolor: isDark
        ? colors.accent.yellowAccent[600]
        : colors.accent.yellowAccent[600],
    },
  };

  const inactiveTabSx = {
    flex: 1,
    borderRadius: "999px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: 14,
    bgcolor: "transparent",
    color: accent,
    "&:hover": {
      bgcolor: tabHoverBg,
    },
  };

  return (
    <Box
      sx={{
        bgcolor: containerBg,
        color: textOnSidebar,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1}>
        <Button
          onClick={() => setTab("trending")}
          sx={tab === "trending" ? activeTabSx : inactiveTabSx}
        >
          Trending Groups
        </Button>
        <Button
          onClick={() => setTab("my")}
          sx={tab === "my" ? activeTabSx : inactiveTabSx}
        >
          My Groups
        </Button>
      </Stack>

      <TextField
        fullWidth
        size="small"
        placeholder="Search groups..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          "& .MuiInputBase-root": {
            bgcolor: inputBg,
            borderRadius: "999px",
            color: inputText,
          },
          "& fieldset": {
            border: "none",
          },
          "& .MuiInputBase-input": {
            px: 2,
            py: 1.2,
            color: inputText,
            fontSize: 13,
          },
          "& .MuiInputBase-input::placeholder": {
            color: textSecondary,
            opacity: 1,
          },
        }}
      />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {loading && (
          <Typography
            variant="body2"
            sx={{
              color: textSecondary,
              textAlign: "center",
              py: 3,
              fontSize: 13,
            }}
          >
            Loading groups...
          </Typography>
        )}

        {!loading && tab === "my" && currentUserLoading && (
          <Typography
            variant="body2"
            sx={{
              color: textSecondary,
              textAlign: "center",
              py: 3,
              fontSize: 13,
            }}
          >
            Loading your groups...
          </Typography>
        )}

        {error && (
          <Typography
            variant="body2"
            sx={{
              color: colors.status.error,
              textAlign: "center",
              py: 3,
              fontSize: 13,
            }}
          >
            Failed to load groups
          </Typography>
        )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          tab === "trending" &&
          allGroups.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                color: textSecondary,
                textAlign: "center",
                py: 3,
                fontSize: 13,
              }}
            >
              No groups have been created yet.
            </Typography>
          )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          tab === "my" &&
          baseGroups.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                color: textSecondary,
                textAlign: "center",
                py: 3,
                fontSize: 13,
              }}
            >
              You haven&apos;t joined any groups yet.
            </Typography>
          )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          baseGroups.length > 0 &&
          filteredGroups &&
          filteredGroups.length === 0 && (
            <Typography
              variant="body2"
              sx={{
                color: textSecondary,
                textAlign: "center",
                py: 3,
                fontSize: 13,
              }}
            >
              No groups match your search.
            </Typography>
          )}

        {!loading &&
          !error &&
          filteredGroups &&
          filteredGroups.map((group) => {
            const memberCount = (group.members || []).length;
            const avatarLetter = group.name?.trim()?.[0]?.toUpperCase() || "G";

            return (
              <Box
                key={group.id}
                onClick={() => handleGroupClick(group)}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1px solid ${borderSubtle}`,
                  cursor: "pointer",
                  borderRadius: 1,
                  transition: "background 150ms ease",
                  "&:hover": {
                    bgcolor: hoverBg,
                  },
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: textOnSidebar,
                      fontSize: 13,
                      lineHeight: 1.3,
                    }}
                  >
                    {group.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: textSecondary, fontSize: 11 }}
                  >
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </Typography>
                </Box>

                {group.avatar ? (
                  <Box
                    component="img"
                    src={group.avatar}
                    alt={group.name}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: accent,
                      color: activeTabText,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    {avatarLetter}
                  </Box>
                )}
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default GroupDisplay;
