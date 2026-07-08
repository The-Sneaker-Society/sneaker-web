import { useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_GROUPS } from "../../context/graphql/getGroups";
import { tokens } from "../../theme/theme";

const GroupDisplay = ({ currentUserId, currentUserLoading }) => {
  const [tab, setTab] = useState("trending");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

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

  const panelBg = isDark
    ? alpha(colors.primary[400], 0.28)
    : alpha(colors.grey[900], 0.35);

  const tabRailBg = isDark
    ? alpha(colors.grey[900], 0.9)
    : alpha(colors.grey[100], 0.82);

  const searchBg = isDark
    ? alpha(colors.primary[900], 0.9)
    : alpha(colors.grey[100], 0.95);

  const borderColor = isDark
    ? alpha(colors.grey[300], 0.16)
    : alpha(colors.grey[400], 0.45);

  const rowBorder = isDark
    ? alpha(colors.grey[300], 0.1)
    : alpha(colors.grey[400], 0.3);

  const hoverBg = isDark
    ? alpha(colors.primary[300], 0.22)
    : alpha(colors.grey[800], 0.18);

  const textPrimary = isDark ? colors.grey[100] : colors.grey[900];
  const textSecondary = isDark ? colors.grey[300] : colors.grey[500];
  const accent = colors.yellowAccent[500];
  const accentHover = colors.yellowAccent[400];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 520,
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: panelBg,
        border: `1px solid ${borderColor}`,
        boxShadow: "none",
        backdropFilter: "blur(6px)",
      }}
    >
      <Box sx={{ p: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            bgcolor: tabRailBg,
            borderRadius: "999px",
            p: 0.5,
            border: `1px solid ${borderColor}`,
          }}
        >
          <Button
            onClick={() => setTab("trending")}
            sx={{
              flex: 1,
              minHeight: 40,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              bgcolor: tab === "trending" ? accent : "transparent",
              color: tab === "trending" ? colors.grey[100] : accent,
              boxShadow: "none",
              "&:hover": {
                bgcolor: tab === "trending" ? accentHover : "transparent",
                boxShadow: "none",
              },
            }}
          >
            Trending Groups
          </Button>

          <Button
            onClick={() => setTab("my")}
            sx={{
              flex: 1,
              minHeight: 40,
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 14,
              bgcolor: tab === "my" ? accent : "transparent",
              color: tab === "my" ? colors.grey[100] : accent,
              boxShadow: "none",
              "&:hover": {
                bgcolor: tab === "my" ? accentHover : "transparent",
                boxShadow: "none",
              },
            }}
          >
            My Groups
          </Button>
        </Box>
      </Box>

      <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search for a group"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: searchBg,
              borderRadius: "999px",
              color: textPrimary,
              "& fieldset": {
                borderColor: borderColor,
              },
              "&:hover fieldset": {
                borderColor: alpha(accent, 0.65),
              },
              "&.Mui-focused fieldset": {
                borderColor: accent,
              },
            },
            "& .MuiInputBase-input": {
              px: 2,
              py: 1.2,
              color: textPrimary,
            },
            "& .MuiInputBase-input::placeholder": {
              color: textSecondary,
              opacity: 1,
            },
          }}
        />
      </Box>

      <Box>
        {loading && (
          <Typography sx={{ px: 2, py: 2, color: textSecondary }}>
            Loading groups...
          </Typography>
        )}

        {!loading && tab === "my" && currentUserLoading && (
          <Typography sx={{ px: 2, py: 2, color: textSecondary }}>
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
            <Typography sx={{ px: 2, py: 2, color: textSecondary }}>
              No groups have been created yet.
            </Typography>
          )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          tab === "my" &&
          baseGroups.length === 0 && (
            <Typography sx={{ px: 2, py: 2, color: textSecondary }}>
              You haven't joined any groups yet.
            </Typography>
          )}

        {!loading &&
          !error &&
          baseGroups !== null &&
          baseGroups.length > 0 &&
          filteredGroups &&
          filteredGroups.length === 0 && (
            <Typography sx={{ px: 2, py: 2, color: textSecondary }}>
              No groups match your search.
            </Typography>
          )}

        {!loading &&
          !error &&
          filteredGroups &&
          filteredGroups.map((group, index) => {
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
                  gap: 1.5,
                  cursor: "pointer",
                  borderTop: index === 0 ? "none" : `1px solid ${rowBorder}`,
                  "&:hover": {
                    bgcolor: hoverBg,
                  },
                }}
              >
                <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: textPrimary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {group.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: textSecondary,
                    }}
                  >
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    width: 70,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: 1.5,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${borderColor}`,
                    bgcolor: group.avatar
                      ? "transparent"
                      : isDark
                        ? alpha(colors.primary[900], 0.9)
                        : alpha(colors.grey[100], 0.9),
                    color: group.avatar ? "inherit" : accent,
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
