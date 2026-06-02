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

  // Derived theme-aware values
  const cardBg = isDark ? "#151618" : "#ffffff";
  const inputBg = isDark ? "#0b0c0e" : "#f3f4f6";
  const borderSubtle = colors.borderSubtle;
  const textPrimary = colors.textPrimary;
  const textSecondary = colors.textSecondary;
  const accent = colors.primary; // yellowAccent[500]

  const deleteBtnSx = {
    ...actionChipButtonSx,
    color: isDark ? "#ff8a8a" : "#c0392b",
    border: `1px solid ${isDark ? "rgba(255,107,107,0.22)" : "rgba(192,57,43,0.25)"}`,
    bgcolor: isDark ? "rgba(255,107,107,0.08)" : "rgba(192,57,43,0.06)",
    "&:hover": {
      bgcolor: isDark ? "rgba(255,107,107,0.14)" : "rgba(192,57,43,0.12)",
      borderColor: isDark ? "rgba(255,107,107,0.32)" : "rgba(192,57,43,0.4)",
    },
    "&.Mui-disabled": {
      color: textSecondary,
      borderColor: borderSubtle,
    },
  };

  const likeBtnSx = {
    ...actionChipButtonSx,
    color: !isJoined ? textSecondary : hasLiked ? accent : textSecondary,
    bgcolor: hasLiked
      ? isDark
        ? "rgba(255,209,0,0.10)"
        : "rgba(255,195,28,0.12)"
      : "transparent",
    border: hasLiked
      ? `1px solid ${isDark ? "rgba(255,209,0,0.28)" : "rgba(255,195,28,0.4)"}`
      : `1px solid ${borderSubtle}`,
    "&:hover": {
      bgcolor: hasLiked
        ? isDark
          ? "rgba(255,209,0,0.15)"
          : "rgba(255,195,28,0.2)"
        : isDark
          ? "rgba(255,255,255,0.06)"
          : "rgba(0,0,0,0.04)",
    },
    "&.Mui-disabled": {
      color: textSecondary,
      borderColor: borderSubtle,
    },
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
      borderColor: `${accent}66`,
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: accent,
    },
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
      {/* Header */}
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

      {/* Post content */}
      {!!post.content && (
        <Typography
          variant="body2"
          sx={{ color: textPrimary, mb: 1.5, lineHeight: 1.65, fontSize: 14 }}
        >
          {post.content}
        </Typography>
      )}

      {/* Post images */}
      {post.images?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 1.5,
          }}
        >
          {post.images.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              alt={`post-image-${i}`}
              sx={{
                width: post.images.length === 1 ? "100%" : "calc(50% - 4px)",
                maxHeight: 320,
                objectFit: "cover",
                borderRadius: 2,
                border: `1px solid ${borderSubtle}`,
              }}
            />
          ))}
        </Box>
      )}

      {/* Action row */}
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
          disabled={!isJoined || liking}
          sx={likeBtnSx}
        >
          {hasLiked ? "Liked" : "Like"} · {likeCount}
        </Button>

        <Button
          size="small"
          startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
          disableRipple
          sx={{
            ...actionChipButtonSx,
            color: textSecondary,
            border: `1px solid ${borderSubtle}`,
            bgcolor: "transparent",
            cursor: "default",
            "&:hover": { bgcolor: "transparent" },
          }}
        >
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </Button>
      </Stack>

      {likeError && (
        <Typography
          variant="caption"
          sx={{ color: colors.status.error, mb: 1, display: "block" }}
        >
          {likeError}
        </Typography>
      )}

      {/* Comments section */}
      {(visibleComments.length > 0 || isJoined) && (
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
                      bgcolor: isDark ? "#0d0e10" : "#f7f8fa",
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

          {isJoined ? (
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
                sx={{
                  bgcolor: accent,
                  color: isDark ? "#111" : "#000",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "999px",
                  boxShadow: "none",
                  minHeight: 40,
                  px: 2,
                  flexShrink: 0,
                  "&:hover": {
                    bgcolor: isDark ? "#f5c400" : "#e6a800",
                    boxShadow: "none",
                  },
                }}
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
              sx={{ color: colors.status.error, mt: 0.75, display: "block" }}
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
