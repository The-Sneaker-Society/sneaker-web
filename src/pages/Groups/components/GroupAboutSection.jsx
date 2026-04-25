import { Box, Stack, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";

const rowIconSx = { color: "#FFD100", mt: 0.25 };

const AboutRow = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.25} alignItems="flex-start">
    <Box sx={rowIconSx}>{icon}</Box>
    <Box>
      <Typography variant="body2" sx={{ color: "#8f8f8f", mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: "#f4f4f4", lineHeight: 1.5 }}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

const GroupAboutSection = ({ group, memberCount = 0 }) => {
  const creatorName =
    `${group?.createdBy?.firstName || ""} ${group?.createdBy?.lastName || ""}`.trim() ||
    group?.createdBy?.email ||
    "Unknown member";

  const createdOn = group?.createdAt
    ? new Date(group.createdAt).toLocaleDateString()
    : "Unknown date";

  return (
    <Box
      sx={{
        bgcolor: "#111",
        border: "1px solid #2b2b2b",
        borderRadius: 3,
        p: 2,
      }}
    >
      <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
        About
      </Typography>
      <Typography variant="body2" sx={{ color: "#8f8f8f", mb: 2 }}>
        Community details and background.
      </Typography>

      <Stack spacing={2}>
        <AboutRow
          icon={<InfoOutlinedIcon fontSize="small" />}
          label="Description"
          value={group?.description?.trim() || "No description added yet."}
        />

        <AboutRow
          icon={<PersonOutlineOutlinedIcon fontSize="small" />}
          label="Created by"
          value={creatorName}
        />

        <AboutRow
          icon={<CalendarMonthOutlinedIcon fontSize="small" />}
          label="Created on"
          value={createdOn}
        />

        <AboutRow
          icon={<Groups2OutlinedIcon fontSize="small" />}
          label="Community size"
          value={`${memberCount} ${memberCount === 1 ? "member" : "members"}`}
        />
      </Stack>
    </Box>
  );
};

export default GroupAboutSection;