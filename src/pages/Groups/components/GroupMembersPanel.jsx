import { Box, Typography, Stack, Chip } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useGroupPageStyles } from "../styles/groupPageStyles";

const GroupMembersPanel = ({ group, adminIds }) => {
  const { colors, isDark, cardSx } = useGroupPageStyles();

  const members = Array.isArray(group?.members) ? group.members : [];

  const adminIdSet =
    adminIds instanceof Set
      ? adminIds
      : new Set(Array.isArray(adminIds) ? adminIds : []);

  const admins = members.filter((member) => adminIdSet.has(member?.id));
  const previewMembers = members.slice(0, 3);

  const pillSx = {
    height: 28,
    borderRadius: "999px",
    bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    color: colors.textPrimary,
    border: `1px solid ${colors.borderSubtle}`,
    "& .MuiChip-label": {
      px: 1.25,
      fontWeight: 700,
    },
  };

  const adminPillSx = {
    ...pillSx,
    bgcolor: isDark ? "rgba(255,209,0,0.14)" : "rgba(255,195,28,0.16)",
    color: colors.primary,
    border: `1px solid ${isDark ? "rgba(255,209,0,0.22)" : "rgba(255,195,28,0.28)"}`,
  };

  const avatarSx = {
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    bgcolor: isDark ? colors.accent.primary[700] : colors.accent.primary[400],
    color: colors.primary,
    fontWeight: 800,
    fontSize: "1.1rem",
    border: `1px solid ${colors.borderSubtle}`,
    flexShrink: 0,
  };

  const memberRowSx = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1.25,
    p: 1.25,
    borderRadius: 2.5,
    bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
  };

  const getName = (member) =>
    member?.name ||
    member?.fullName ||
    [member?.firstName, member?.lastName].filter(Boolean).join(" ").trim() ||
    member?.username ||
    member?.email ||
    "Member";

  const getInitial = (member) => getName(member).charAt(0).toUpperCase();

  const renderMemberRow = (member) => {
    const isAdmin = adminIdSet.has(member?.id);

    return (
      <Box key={member?.id || getName(member)} sx={memberRowSx}>
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          sx={{ minWidth: 0 }}
        >
          <Box sx={avatarSx}>{getInitial(member)}</Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: colors.textPrimary,
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
            icon={
              <VerifiedIcon
                sx={{ color: `${colors.primary} !important`, fontSize: 16 }}
              />
            }
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
              sx={{ color: colors.textPrimary, fontWeight: 800, mb: 0.5 }}
            >
              Roles
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
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
              sx={{ color: colors.textPrimary, fontWeight: 800, mb: 0.5 }}
            >
              Members preview
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
            >
              A quick look at people in this group.
            </Typography>
          </Box>

          <Stack spacing={1.1}>
            {previewMembers.length > 0 ? (
              previewMembers.map(renderMemberRow)
            ) : (
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
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
              sx={{ color: colors.textPrimary, fontWeight: 800, mb: 0.5 }}
            >
              Members
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
            >
              People currently in this group.
            </Typography>
          </Box>

          <Stack spacing={1.1}>
            {members.length > 0 ? (
              members.map(renderMemberRow)
            ) : (
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
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
