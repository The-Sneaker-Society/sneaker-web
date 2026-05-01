import { Box, Typography, Stack, Chip } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

const cardSx = {
  p: { xs: 2, md: 2.25 },
  bgcolor: "#0b0d12",
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};

const pillSx = {
  height: 28,
  borderRadius: "999px",
  bgcolor: "rgba(255,255,255,0.08)",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.08)",
  "& .MuiChip-label": {
    px: 1.25,
    fontWeight: 700,
  },
};

const adminPillSx = {
  ...pillSx,
  bgcolor: "rgba(255,209,0,0.14)",
  color: "#FFD100",
  border: "1px solid rgba(255,209,0,0.22)",
};

const avatarSx = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  bgcolor: "#1b1d22",
  color: "#FFD100",
  fontWeight: 800,
  fontSize: "1.1rem",
  border: "1px solid rgba(255,255,255,0.08)",
  flexShrink: 0,
};

const memberRowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1.25,
  p: 1.25,
  borderRadius: 2.5,
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const GroupMembersPanel = ({ group, adminIds = [] }) => {
  const members = Array.isArray(group?.members) ? group.members : [];
  const admins = members.filter((member) => adminIds.includes(member?.id));

  const previewMembers = members.slice(0, 3);

  const getName = (member) =>
    member?.name || member?.fullName || member?.username || "Member";

  const getInitial = (member) => getName(member).charAt(0).toUpperCase();

  const renderMemberRow = (member) => {
    const isAdmin = adminIds.includes(member?.id);

    return (
      <Box key={member?.id || getName(member)} sx={memberRowSx}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          <Box sx={avatarSx}>{getInitial(member)}</Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1.3,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {getName(member)}
            </Typography>
          </Box>
        </Stack>

        {isAdmin && (
          <Chip
            icon={<VerifiedIcon sx={{ color: "#FFD100 !important", fontSize: 16 }} />}
            label="Admin"
            sx={adminPillSx}
          />
        )}
      </Box>
    );
  };

  return (
    <Stack spacing={2.25}>
      <Box sx={cardSx}>
        <Stack spacing={1.75}>
          <Box>
            <Typography
              variant="h6"
              sx={{ color: "#fff", fontWeight: 800, mb: 0.5 }}
            >
              Roles
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#8f949c", lineHeight: 1.6 }}
            >
              Group membership and admin overview.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={`${members.length} member${members.length === 1 ? "" : "s"}`}
              sx={pillSx}
            />
            <Chip
              label={`${admins.length} admin${admins.length === 1 ? "" : "s"}`}
              sx={adminPillSx}
            />
          </Stack>
        </Stack>
      </Box>

      <Box sx={cardSx}>
        <Stack spacing={1.75}>
          <Box>
            <Typography
              variant="h6"
              sx={{ color: "#fff", fontWeight: 800, mb: 0.5 }}
            >
              Members preview
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#8f949c", lineHeight: 1.6 }}
            >
              A quick look at people in this group.
            </Typography>
          </Box>

          <Stack spacing={1.1}>
            {previewMembers.length > 0 ? (
              previewMembers.map(renderMemberRow)
            ) : (
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                No members to display yet.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>

      <Box sx={cardSx}>
        <Stack spacing={1.75}>
          <Box>
            <Typography
              variant="h6"
              sx={{ color: "#fff", fontWeight: 800, mb: 0.5 }}
            >
              Members
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#8f949c", lineHeight: 1.6 }}
            >
              People currently in this group.
            </Typography>
          </Box>

          <Stack spacing={1.1}>
            {members.length > 0 ? (
              members.map(renderMemberRow)
            ) : (
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                No members yet.
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default GroupMembersPanel;