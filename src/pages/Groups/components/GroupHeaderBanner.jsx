import {
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const GroupHeaderBanner = ({
  group,
  memberCount,
  isJoined,
  isCreator,
  canManageGroup,
  joining,
  leaving,
  isHovering,
  setIsHovering,
  onJoin,
  onOpenLeave,
  onEditGroup,
  onDeleteGroup,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid #2b2b2b",
        background:
          "linear-gradient(135deg, rgba(255,209,0,0.18) 0%, rgba(17,17,17,1) 42%, rgba(0,0,0,1) 100%)",
        mb: 3,
      }}
    >
      <Box
        sx={{
          height: 168,
          backgroundImage: group.avatar ? `url(${group.avatar})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.64) 68%, rgba(0,0,0,0.92) 100%)",
          }}
        />
      </Box>

      <Box sx={{ position: "relative", px: 3, pb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          sx={{ mt: -5.5, mb: 2 }}
        >
          <Avatar
            src={group.avatar || undefined}
            sx={{
              width: 96,
              height: 96,
              bgcolor: "#232323",
              color: "#FFD100",
              border: "3px solid #111",
              fontSize: 34,
              fontWeight: 800,
            }}
          >
            {group.name?.[0] || "G"}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              sx={{ color: "#fff", fontWeight: 800, lineHeight: 1.1 }}
            >
              {group.name}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              <Chip
                size="small"
                label={`${memberCount} ${memberCount === 1 ? "member" : "members"}`}
                sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#fff" }}
              />
              <Chip
                size="small"
                label={isJoined ? "Member" : "Public community"}
                sx={{
                  bgcolor: isJoined
                    ? "rgba(255,209,0,0.15)"
                    : "rgba(255,255,255,0.08)",
                  color: isJoined ? "#FFD100" : "#fff",
                }}
              />
              {isCreator && (
                <Chip
                  size="small"
                  icon={<CheckCircleIcon sx={{ color: "#000 !important" }} />}
                  label="Creator"
                  sx={{ bgcolor: "#FFD100", color: "#000", fontWeight: 700 }}
                />
              )}
            </Stack>
          </Box>
        </Stack>

        {group.description && (
          <Typography sx={{ color: "#cfcfcf", maxWidth: 620, mb: 2 }}>
            {group.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1.25} sx={{ flexWrap: "wrap" }}>
          {canManageGroup && (
            <>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEditGroup}
                sx={{
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#FFD100",
                  color: "#000",
                  "&:hover": { bgcolor: "#ffde33" },
                }}
              >
                Edit Group
              </Button>

              {isCreator && (
                <Button
                  variant="outlined"
                  startIcon={<DeleteForeverIcon />}
                  onClick={onDeleteGroup}
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#ff6b6b",
                    borderColor: "#ff6b6b",
                    "&:hover": {
                      bgcolor: "rgba(255,107,107,0.08)",
                      borderColor: "#ff6b6b",
                    },
                  }}
                >
                  Delete Group
                </Button>
              )}
            </>
          )}

          {!isCreator && (
            <>
              {isJoined ? (
                <Button
                  variant="outlined"
                  onClick={onOpenLeave}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  disabled={leaving}
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 700,
                    color: isHovering ? "#ff6b6b" : "#FFD100",
                    borderColor: isHovering ? "#ff6b6b" : "#FFD100",
                    "&:hover": {
                      bgcolor: "rgba(255,107,107,0.08)",
                      borderColor: "#ff6b6b",
                    },
                  }}
                >
                  {leaving ? (
                    <CircularProgress size={16} sx={{ color: "#FFD100" }} />
                  ) : isHovering ? (
                    "Leave Group"
                  ) : (
                    "Joined ✓"
                  )}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={onJoin}
                  disabled={joining}
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#FFD100",
                    color: "#000",
                    "&:hover": { bgcolor: "#ffde33" },
                  }}
                >
                  {joining ? (
                    <CircularProgress size={16} sx={{ color: "#000" }} />
                  ) : (
                    "Join Group"
                  )}
                </Button>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default GroupHeaderBanner;
