import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const GroupMembersPanel = ({ members = [], adminIds = new Set() }) => {
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
        Members
      </Typography>
      <Typography variant="body2" sx={{ color: "#8f8f8f", mb: 2 }}>
        People currently in this group.
      </Typography>

      <Stack spacing={1.25}>
        {members.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#8f8f8f" }}>
            No members found.
          </Typography>
        ) : (
          members.map((member) => {
            const fullName =
              `${member?.firstName || ""} ${member?.lastName || ""}`.trim() ||
              member?.email ||
              "Unknown member";

            const isAdmin = adminIds.has(member.id);

            return (
              <Stack key={member.id} direction="row" spacing={1.25} alignItems="center">
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <Avatar
                    sx={{
                      bgcolor: "#232323",
                      color: "#FFD100",
                      width: 40,
                      height: 40,
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
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        bgcolor: "#FFD100",
                        border: "2px solid #111",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AdminPanelSettingsIcon sx={{ fontSize: 11, color: "#000" }} />
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
                    icon={<AdminPanelSettingsIcon sx={{ color: "#FFD100 !important" }} />}
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
  );
};

export default GroupMembersPanel;