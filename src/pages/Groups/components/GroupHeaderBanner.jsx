import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

const pillChipSx = {
  height: 28,
  borderRadius: "999px",
  bgcolor: "rgba(255,255,255,0.10)",
  color: "#f3f3f3",
  fontWeight: 700,
  border: "1px solid rgba(255,255,255,0.08)",
  "& .MuiChip-label": {
    px: 1.25,
    fontWeight: 700,
  },
};

const creatorChipSx = {
  ...pillChipSx,
  bgcolor: "#FFD100",
  color: "#111",
  border: "none",
};

const actionButtonBaseSx = {
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  minHeight: 44,
  px: 2.25,
  boxShadow: "none",
};

const statPillSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.9,
  px: 1.35,
  py: 0.95,
  borderRadius: "999px",
  bgcolor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#d8dbe0",
};

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
  const title = group?.name || "Group";
  const description = group?.description || "No description provided.";
  const postCount = group?.postCount ?? group?.postsCount ?? null;

  const stats = [
    {
      key: "members",
      icon: <GroupOutlinedIcon sx={{ fontSize: 17, color: "#FFD100" }} />,
      label: `${memberCount || 0} member${memberCount === 1 ? "" : "s"}`,
    },
    ...(postCount !== null
      ? [
          {
            key: "posts",
            icon: <ForumOutlinedIcon sx={{ fontSize: 17, color: "#FFD100" }} />,
            label: `${postCount} post${postCount === 1 ? "" : "s"}`,
          },
        ]
      : []),
    {
      key: "access",
      icon: <ShieldOutlinedIcon sx={{ fontSize: 17, color: "#FFD100" }} />,
      label: canManageGroup
        ? "Admin access"
        : isJoined
          ? "Member access"
          : "View only",
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,209,0,0.10) 0%, rgba(7,7,8,1) 34%, rgba(10,11,14,1) 100%)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top left, rgba(255,209,0,0.14), transparent 28%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          px: { xs: 2, md: 3 },
          pt: { xs: 8, md: 10 },
          pb: { xs: 3, md: 4 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 2.5, md: 2.75 }}
          alignItems={{ xs: "flex-start", md: "flex-end" }}
        >
          <Box
            sx={{
              width: { xs: 84, md: 96 },
              height: { xs: 84, md: 96 },
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: "#1b1d22",
              color: "#FFD100",
              fontWeight: 800,
              fontSize: { xs: "1.9rem", md: "2.2rem" },
              border: "2px solid rgba(255,255,255,0.08)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              flexShrink: 0,
            }}
          >
            {title.charAt(0).toUpperCase()}
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2rem", md: "2.65rem" },
                lineHeight: 1.06,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                mb: 1.1,
                color: "#fff",
              }}
            >
              {title}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 1.75 }}
            >
              <Chip
                label={`${memberCount || 0} member${memberCount === 1 ? "" : "s"}`}
                sx={pillChipSx}
              />
              {isJoined && <Chip label="Member" sx={pillChipSx} />}
              {isCreator && (
                <Chip
                  icon={<CheckCircleIcon sx={{ color: "#111 !important" }} />}
                  label="Creator"
                  sx={creatorChipSx}
                />
              )}
            </Stack>

            <Typography
              variant="body1"
              sx={{
                color: "#c7c9ce",
                maxWidth: 680,
                lineHeight: 1.7,
                mb: 2.25,
              }}
            >
              {description}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 2.5 }}
            >
              {stats.map((stat) => (
                <Box key={stat.key} sx={statPillSx}>
                  {stat.icon}
                  <Typography
                    variant="caption"
                    sx={{
                      color: "inherit",
                      fontWeight: 800,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              {canManageGroup ? (
                <>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={onEditGroup}
                    sx={{
                      ...actionButtonBaseSx,
                      bgcolor: "#FFD100",
                      color: "#111",
                      "&:hover": {
                        bgcolor: "#f5c400",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Edit group
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={onDeleteGroup}
                    sx={{
                      ...actionButtonBaseSx,
                      color: "#ff8e8e",
                      borderColor: "rgba(255,107,107,0.45)",
                      "&:hover": {
                        borderColor: "#ff6b6b",
                        bgcolor: "rgba(255,107,107,0.08)",
                      },
                    }}
                  >
                    Delete group
                  </Button>
                </>
              ) : isJoined ? (
                <Button
                  variant="outlined"
                  onClick={onOpenLeave}
                  onMouseEnter={() => setIsHovering?.(true)}
                  onMouseLeave={() => setIsHovering?.(false)}
                  disabled={leaving}
                  sx={{
                    ...actionButtonBaseSx,
                    color: isHovering ? "#fff" : "#FFD100",
                    borderColor: isHovering
                      ? "rgba(255,107,107,0.7)"
                      : "rgba(255,209,0,0.55)",
                    bgcolor: isHovering
                      ? "rgba(255,107,107,0.14)"
                      : "transparent",
                    "&:hover": {
                      borderColor: "#ff6b6b",
                      bgcolor: "rgba(255,107,107,0.14)",
                    },
                  }}
                >
                  {leaving ? "Leaving..." : "Leave group"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={onJoin}
                  disabled={joining}
                  sx={{
                    ...actionButtonBaseSx,
                    bgcolor: "#FFD100",
                    color: "#111",
                    "&:hover": {
                      bgcolor: "#f5c400",
                      boxShadow: "none",
                    },
                  }}
                >
                  {joining ? "Joining..." : "Join group"}
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default GroupHeaderBanner;