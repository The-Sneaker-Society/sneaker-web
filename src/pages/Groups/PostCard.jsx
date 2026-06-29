import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useColors } from "../../theme/colors";

const actionChipButtonSx = {
  textTransform: "none",
  minWidth: "auto",
  borderRadius: "999px",
  px: 1.4,
  py: 0.8,
  fontWeight: 700,
  lineHeight: 1,
};

const formatPostDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

const PostCard = ({
  post,
  currentUser,
  group,
  isJoined,
  canInteractWithPosts,
  liking,
  deleting,
  commentLoading,
  commentValue,
  commentError,
  likeError,
  loadingMoreComments,
  onLike,
  onCommentChange,
  onAddComment,
  onLoadMoreComments,
  onDelete,
}) => {
  const colors = useColors();
  const isDark = colors.isDark;

  const authorName =
    `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim() ||
    post.author?.email ||
    "Unknown user";

  const likeCount = post.likes?.length || 0;
  const commentCount = post.commentCount || 0;
  const visibleComments = post.commentsPage?.items || [];
  const hasMoreComments = !!post.commentsPage?.hasMore;
  const hasLiked = !!post.likes?.some((like) => like.id === currentUser?.id);

  const isPostAuthor = post.author?.id === currentUser?.id;
  const isGroupCreator = group?.createdBy?.id === currentUser?.id;
  const isGroupAdmin = !!group?.admins?.some(
    (admin) => admin.id === currentUser?.id,
  );
  const canDeletePost = isPostAuthor || isGroupCreator || isGroupAdmin;

  const formattedDate = formatPostDate(post.createdAt);

  const cardBg = colors.widgetBg;
  const inputBg = isDark
    ? colors.accent.primary[800]
    : colors.accent.primary[400];
  const commentItemBg = inputBg;

  const borderSubtle = colors.borderSubtle;
  const textPrimary = colors.textPrimary;
  const textSecondary = colors.textSecondary;
  const accent = colors.primary;
  const error = colors.status.error;
  const errorSoft = isDark
    ? colors.accent.redAccent[400]
    : colors.accent.redAccent[600];
  const likeSoftBg = isDark
    ? "rgba(255, 195, 28, 0.10)"
    : "rgba(255, 195, 28, 0.14)";
  const likeSoftBorder = isDark
    ? "rgba(255, 195, 28, 0.30)"
    : "rgba(255, 195, 28, 0.42)";
  const neutralHoverBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const deleteSoftBg = isDark ? "rgba(219,79,74,0.10)" : "rgba(175,63,59,0.08)";
  const deleteSoftHoverBg = isDark
    ? "rgba(219,79,74,0.16)"
    : "rgba(175,63,59,0.14)";
  const deleteSoftBorder = isDark
    ? "rgba(219,79,74,0.28)"
    : "rgba(175,63,59,0.28)";
  const deleteSoftBorderHover = isDark
    ? "rgba(219,79,74,0.42)"
    : "rgba(175,63,59,0.42)";
  const primaryActionText = colors.textInverse;

  const deleteBtnSx = {
    ...actionChipButtonSx,
    color: errorSoft,
    border: `1px solid ${deleteSoftBorder}`,
    bgcolor: deleteSoftBg,
    "&:hover": {
      bgcolor: deleteSoftHoverBg,
      borderColor: deleteSoftBorderHover,
    },
    "&.Mui-disabled": {
      color: textSecondary,
      borderColor: borderSubtle,
    },
  };

  const likeBtnSx = {
    ...actionChipButtonSx,
    color: !canInteractWithPosts
      ? textSecondary
      : hasLiked
        ? accent
        : textSecondary,
    bgcolor: hasLiked ? likeSoftBg : "transparent",
    border: hasLiked
      ? `1px solid ${likeSoftBorder}`
      : `1px solid ${borderSubtle}`,
    "&:hover": {
      bgcolor: hasLiked ? likeSoftBg : neutralHoverBg,
    },
    "&.Mui-disabled": {
      color: textSecondary,
      borderColor: borderSubtle,
    },
  };

  const staticActionChipSx = {
    ...actionChipButtonSx,
    color: textSecondary,
    border: `1px solid ${borderSubtle}`,
    bgcolor: "transparent",
    cursor: "default",
    "&:hover": { bgcolor: "transparent" },
  };

  const commentFieldSx = {
    "& .MuiInputBase-root": {
      bgcolor: inputBg,
      color: textPrimary,
      borderRadius: 2,
    },
    "& .MuiInputBase-input::placeholder": {
      color: textSecondary,
      opacity: 1,
    },
    "& fieldset": {
      borderColor: borderSubtle,
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
      borderColor: accent,
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: accent,
    },
  };

  const primaryActionButtonSx = {
    bgcolor: accent,
    color: primaryActionText,
    textTransform: "none",
    fontWeight: 700,
    borderRadius: "999px",
    boxShadow: "none",
    minHeight: 40,
    px: 2,
    flexShrink: 0,
    "&:hover": {
      bgcolor: colors.accent.yellowAccent[600],
      boxShadow: "none",
    },
    "&.Mui-disabled": {
      bgcolor: borderSubtle,
      color: textSecondary,
    },
  };

  const images = Array.isArray(post.images) ? post.images.slice(0, 4) : [];
  const extraImageCount = Math.max((post.images?.length || 0) - 4, 0);

  const mediaFrameSx = {
    position: "relative",
    overflow: "hidden",
    borderRadius: 2,
    border: `1px solid ${borderSubtle}`,
    bgcolor: commentItemBg,
    width: "100%",
  };

  const mediaImageSx = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const renderMediaImage = (img, i, sx = {}, showOverlay = false) => (
    <Box key={`${img}-${i}`} sx={{ ...mediaFrameSx, ...sx }}>
      <Box
        component="img"
        src={img}
        alt={`Post image ${i + 1}`}
        sx={mediaImageSx}
      />

      {showOverlay && extraImageCount > 0 && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            bgcolor: "rgba(0,0,0,0.42)",
            color: "#fff",
            fontSize: "1.15rem",
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          +{extraImageCount}
        </Box>
      )}
    </Box>
  );

  const renderImageLayout = () => {
    if (images.length === 1) {
      return renderMediaImage(images[0], 0, {
        aspectRatio: "16 / 10",
      });
    }

    if (images.length === 2) {
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          {images.map((img, i) =>
            renderMediaImage(img, i, {
              aspectRatio: "1 / 1",
            }),
          )}
        </Box>
      );
    }

    if (images.length === 3) {
      return (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.35fr 1fr",
            gap: 1,
          }}
        >
          {renderMediaImage(images[0], 0, {
            aspectRatio: "1 / 1",
          })}

          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "repeat(2, minmax(0, 1fr))",
              gap: 1,
            }}
          >
            {renderMediaImage(images[1], 1, {
              aspectRatio: "1 / 1",
            })}
            {renderMediaImage(images[2], 2, {
              aspectRatio: "1 / 1",
            })}
          </Box>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1,
        }}
      >
        {images.map((img, i) =>
          renderMediaImage(
            img,
            i,
            {
              aspectRatio: "1 / 1",
            },
            i === 3 && extraImageCount > 0,
          ),
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: cardBg,
        borderRadius: 3,
        border: `1px solid ${borderSubtle}`,
        boxShadow: isDark
          ? "0 10px 30px rgba(0,0,0,0.18)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        p: { xs: 2, md: 2.5 },
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        mb={1}
      >
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: textPrimary, fontSize: 14 }}
          >
            {authorName}
          </Typography>
          {formattedDate && (
            <Typography
              variant="caption"
              sx={{ color: textSecondary, fontWeight: 600, fontSize: 12 }}
            >
              {formattedDate}
            </Typography>
          )}
        </Box>

        {canDeletePost && (
          <Button
            variant="outlined"
            size="small"
            startIcon={
              deleting ? (
                <CircularProgress size={12} color="inherit" />
              ) : (
                <DeleteOutlineIcon fontSize="small" />
              )
            }
            onClick={onDelete}
            disabled={deleting}
            sx={deleteBtnSx}
          >
            Delete
          </Button>
        )}
      </Stack>

      {!!post.content && (
        <Typography
          variant="body2"
          sx={{ color: textPrimary, mb: 1.5, lineHeight: 1.65, fontSize: 14 }}
        >
          {post.content}
        </Typography>
      )}

      {images.length > 0 && <Box sx={{ mb: 1.5 }}>{renderImageLayout()}</Box>}

      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Button
          size="small"
          startIcon={
            liking ? (
              <CircularProgress size={12} color="inherit" />
            ) : hasLiked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )
          }
          onClick={onLike}
          disabled={!canInteractWithPosts || liking}
          sx={likeBtnSx}
        >
          {hasLiked ? "Liked" : "Like"} · {likeCount}
        </Button>

        <Button
          size="small"
          startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
          disableRipple
          sx={staticActionChipSx}
        >
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </Button>
      </Stack>

      {likeError && (
        <Typography
          variant="caption"
          sx={{ color: error, mb: 1, display: "block" }}
        >
          {likeError}
        </Typography>
      )}

      {(visibleComments.length > 0 || canInteractWithPosts) && (
        <Box>
          <Divider sx={{ borderColor: borderSubtle, mb: 1.5 }} />

          {visibleComments.length > 0 && (
            <Stack spacing={1} mb={1.5}>
              {visibleComments.map((comment) => {
                const commentAuthor =
                  `${comment.author?.firstName || ""} ${
                    comment.author?.lastName || ""
                  }`.trim() ||
                  comment.author?.email ||
                  "Unknown user";

                return (
                  <Box
                    key={comment.id}
                    sx={{
                      bgcolor: commentItemBg,
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      border: `1px solid ${borderSubtle}`,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        color: textPrimary,
                        display: "block",
                        mb: 0.25,
                        fontSize: 12,
                      }}
                    >
                      {commentAuthor}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: textPrimary, fontSize: 13, lineHeight: 1.5 }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
                );
              })}

              {hasMoreComments && (
                <Button
                  size="small"
                  onClick={onLoadMoreComments}
                  disabled={loadingMoreComments}
                  sx={{
                    ...actionChipButtonSx,
                    color: accent,
                    alignSelf: "flex-start",
                    px: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {loadingMoreComments ? (
                    <CircularProgress size={13} color="inherit" />
                  ) : (
                    "Load more comments"
                  )}
                </Button>
              )}
            </Stack>
          )}

          {canInteractWithPosts ? (
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <TextField
                fullWidth
                size="small"
                placeholder="Write a comment..."
                value={commentValue}
                onChange={(e) => onCommentChange(e.target.value)}
                sx={commentFieldSx}
              />
              <Button
                variant="contained"
                size="small"
                onClick={onAddComment}
                disabled={commentLoading}
                sx={primaryActionButtonSx}
              >
                {commentLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  "Comment"
                )}
              </Button>
            </Stack>
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: textSecondary,
                fontSize: 13,
                textAlign: "center",
                py: 1,
              }}
            >
              Join the group to like, comment, and take part in the
              conversation.
            </Typography>
          )}

          {commentError && (
            <Typography
              variant="caption"
              sx={{ color: error, mt: 0.75, display: "block" }}
            >
              {commentError}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default PostCard;
