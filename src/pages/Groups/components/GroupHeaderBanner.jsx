import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
          pt: { xs: 9, md: 12 },
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
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "3.1rem" },
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                mb: 1.25,
              }}
            >
              {title}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mb: 2 }}
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
                maxWidth: 760,
                lineHeight: 1.65,
                mb: 2.5,
              }}
            >
              {description}
            </Typography>

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
                    Edit Group
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
                    Delete Group
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
                  {leaving ? "Leaving..." : "Leave Group"}
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
                  {joining ? "Joining..." : "Join Group"}
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
