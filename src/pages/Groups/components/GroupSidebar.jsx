import {
  Avatar,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import GroupAboutSection from "./GroupAboutSection";
import GroupMembersPanel from "./GroupMembersPanel";

const GroupSidebar = ({ group, memberCount = 0, adminIds = new Set() }) => {
  const previewMembers = (group?.members || []).slice(0, 6);
  const adminCount = group?.admins?.length || 0;

  return (
    <Stack spacing={2} useFlexGap>
      <GroupAboutSection group={group} memberCount={memberCount} />

      <Box
        sx={{
          bgcolor: "#111",
          border: "1px solid #2b2b2b",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
          Roles
        </Typography>
        <Typography variant="body2" sx={{ color: "#8f8f8f", mb: 2 }}>
          Group membership and admin overview.
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            size="small"
            label={`${memberCount} ${memberCount === 1 ? "member" : "members"}`}
            sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff" }}
          />
          <Chip
            size="small"
            icon={<AdminPanelSettingsIcon sx={{ color: "#FFD100 !important" }} />}
            label={`${adminCount} ${adminCount === 1 ? "admin" : "admins"}`}
            sx={{
              bgcolor: "rgba(255,209,0,0.12)",
              color: "#FFD100",
              border: "1px solid rgba(255,209,0,0.30)",
              fontWeight: 700,
            }}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          bgcolor: "#111",
          border: "1px solid #2b2b2b",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.5 }}>
          Members preview
        </Typography>
        <Typography variant="body2" sx={{ color: "#8f8f8f", mb: 2 }}>
          A quick look at people in this group.
        </Typography>

        <Stack spacing={1.25}>
          {previewMembers.length === 0 ? (
            <Typography variant="body2" sx={{ color: "#8f8f8f" }}>
              No members found.
            </Typography>
          ) : (
            previewMembers.map((member) => {
              const fullName =
                `${member?.firstName || ""} ${member?.lastName || ""}`.trim() ||
                member?.email ||
                "Unknown member";

              const isAdmin = adminIds.has(member.id);

              return (
                <Stack
                  key={member.id}
                  direction="row"
                  spacing={1.25}
                  alignItems="center"
                >
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#232323",
                        color: "#FFD100",
                        fontWeight: 700,
                      }}
                    >
                      {member?.firstName?.[0] ?? member?.email?.[0] ?? "?"}
                    </Avatar>

                    {isAdmin && (
                      <Box
                        sx={{
                          position: "absolute",
                          right: -3,
                          bottom: -3,
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: "#FFD100",
                          border: "2px solid #111",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <AdminPanelSettingsIcon sx={{ fontSize: 10, color: "#000" }} />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ color: "#f2f2f2", fontWeight: 600 }} noWrap>
                      {fullName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#8f8f8f" }} noWrap>
                      {member?.email || "No email available"}
                    </Typography>
                  </Box>

                  {isAdmin && (
                    <Chip
                      size="small"
                      label="Admin"
                      sx={{
                        bgcolor: "rgba(255,209,0,0.12)",
                        color: "#FFD100",
                        border: "1px solid rgba(255,209,0,0.30)",
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Stack>
              );
            })
          )}
        </Stack>
      </Box>

      <GroupMembersPanel members={group?.members || []} adminIds={adminIds} />
    </Stack>
  );
};

export default GroupSidebar;