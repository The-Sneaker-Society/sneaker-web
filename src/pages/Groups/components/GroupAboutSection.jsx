import { Box, Typography, Stack } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

const cardSx = {
  p: { xs: 2, md: 2.25 },
  bgcolor: "#0b0d12",
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};

const rowSx = {
  display: "grid",
  gridTemplateColumns: "16px minmax(0, 1fr)",
  gap: 1.5,
  alignItems: "start",
};

const iconSx = {
  color: "#FFD100",
  fontSize: 16,
  mt: "2px",
};

const GroupAboutSection = ({ group, memberCount }) => {
  const createdBy =
    group?.createdBy?.name ||
    group?.createdBy?.fullName ||
    group?.creator?.name ||
    "Unknown";

  return (
    <Box sx={cardSx}>
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="h6"
            sx={{ color: "#fff", fontWeight: 800, mb: 0.5 }}
          >
            About
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#8f949c", lineHeight: 1.6 }}
          >
            Community details and background.
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Box sx={rowSx}>
            <InfoOutlinedIcon sx={iconSx} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#8f949c", fontWeight: 700, display: "block", mb: 0.5 }}
              >
                Description
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#f5f5f5", lineHeight: 1.65 }}
              >
                {group?.description || "No description provided."}
              </Typography>
            </Box>
          </Box>

          <Box sx={rowSx}>
            <PersonOutlineIcon sx={iconSx} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#8f949c", fontWeight: 700, display: "block", mb: 0.5 }}
              >
                Created by
              </Typography>
              <Typography variant="body2" sx={{ color: "#f5f5f5", fontWeight: 600 }}>
                {createdBy}
              </Typography>
            </Box>
          </Box>

          <Box sx={rowSx}>
            <GroupsOutlinedIcon sx={iconSx} />
            <Box>
              <Typography
                variant="caption"
                sx={{ color: "#8f949c", fontWeight: 700, display: "block", mb: 0.5 }}
              >
                Community size
              </Typography>
              <Typography variant="body2" sx={{ color: "#f5f5f5", fontWeight: 600 }}>
                {memberCount || 0} member{memberCount === 1 ? "" : "s"}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default GroupAboutSection;