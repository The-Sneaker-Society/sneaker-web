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

const actionChipButtonSx = {
  textTransform: "none",
  minWidth: "auto",
  borderRadius: "999px",
  px: 1.4,
  py: 0.8,
  fontWeight: 700,
  lineHeight: 1,
};

const subtleMetaSx = {
  color: "#8b9097",
  fontWeight: 600,
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

  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        bgcolor: "#151618",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Stack spacing={0.35} sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#fff",
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {authorName}
            </Typography>

            {formattedDate && (
              <Typography
                variant="caption"
                sx={{
                  ...subtleMetaSx,
                  display: "block",
                }}
              >
                {formattedDate}
              </Typography>
            )}
          </Stack>

          {canDeletePost && (
            <Button
              startIcon={
                deleting ? (
                  <CircularProgress size={14} sx={{ color: "#ff8a8a" }} />
                ) : (
                  <DeleteOutlineIcon fontSize="small" />
                )
              }
              onClick={onDelete}
              disabled={deleting}
              sx={{
                ...actionChipButtonSx,
                color: "#ff8a8a",
                border: "1px solid rgba(255,107,107,0.22)",
                bgcolor: "rgba(255,107,107,0.08)",
                "&:hover": {
                  bgcolor: "rgba(255,107,107,0.14)",
                  borderColor: "rgba(255,107,107,0.32)",
                },
                "&.Mui-disabled": {
                  color: "#777",
                  borderColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Delete
            </Button>
          )}
        </Stack>

        {!!post.content && (
          <Typography
            variant="body1"
            sx={{
              color: "#eceef1",
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
            }}
          >
            {post.content}
          </Typography>
        )}

        {post.images?.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }} useFlexGap>
            {post.images.map((img, i) => (
              <Box
                key={`${img}-${i}`}
                component="img"
                src={img}
                alt={`Post image ${i + 1}`}
                sx={{
                  width: { xs: "calc(50% - 4px)", sm: 132 },
                  height: { xs: 132, sm: 132 },
                  objectFit: "cover",
                  borderRadius: 2.25,
                  border: "1px solid rgba(255,255,255,0.08)",
                  bgcolor: "#0d0e10",
                  display: "block",
                }}
              />
            ))}
          </Stack>
        )}

        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: "wrap" }}
          useFlexGap
        >
          <Button
            startIcon={
              liking ? (
                <CircularProgress size={16} sx={{ color: "#FFD100" }} />
              ) : hasLiked ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )
            }
            onClick={onLike}
            disabled={!isJoined || liking}
            sx={{
              ...actionChipButtonSx,
              color: !isJoined ? "#666" : hasLiked ? "#FFD100" : "#c8cbd1",
              bgcolor: hasLiked
                ? "rgba(255,209,0,0.10)"
                : "rgba(255,255,255,0.03)",
              border: hasLiked
                ? "1px solid rgba(255,209,0,0.28)"
                : "1px solid rgba(255,255,255,0.08)",
              "&:hover": {
                bgcolor: hasLiked
                  ? "rgba(255,209,0,0.15)"
                  : "rgba(255,255,255,0.06)",
              },
              "&.Mui-disabled": {
                color: "#666",
                borderColor: "rgba(255,255,255,0.06)",
              },
            }}
          >
            {hasLiked ? "Liked" : "Like"} · {likeCount}
          </Button>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1.35,
              py: 0.85,
              borderRadius: "999px",
              color: "#a5abb3",
              bgcolor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 17 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: "inherit" }}>
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </Typography>
          </Box>
        </Stack>

        {likeError && (
          <Typography variant="caption" color="error.main">
            {likeError}
          </Typography>
        )}

        {(visibleComments.length > 0 || isJoined) && (
          <Box
            sx={{
              p: { xs: 1.5, sm: 1.75 },
              borderRadius: 2.5,
              bgcolor: "#111214",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Stack spacing={1.4}>
              {visibleComments.length > 0 && (
                <Stack spacing={1.1}>
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
                          p: 1.35,
                          bgcolor: "#17181b",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#FFD100",
                            display: "block",
                            mb: 0.45,
                            fontWeight: 700,
                          }}
                        >
                          {commentAuthor}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#d8dbe0",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {comment.content}
                        </Typography>
                      </Box>
                    );
                  })}

                  {hasMoreComments && (
                    <Button
                      variant="text"
                      onClick={onLoadMoreComments}
                      disabled={loadingMoreComments}
                      sx={{
                        alignSelf: "flex-start",
                        textTransform: "none",
                        color: "#FFD100",
                        px: 0,
                        fontWeight: 700,
                      }}
                    >
                      {loadingMoreComments ? (
                        <CircularProgress size={16} sx={{ color: "#FFD100" }} />
                      ) : (
                        "Load more comments"
                      )}
                    </Button>
                  )}
                </Stack>
              )}

              {isJoined ? (
                <Stack spacing={1.1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentValue}
                    onChange={(e) => onCommentChange(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: "#0b0c0e",
                        color: "#fff",
                        borderRadius: 2,
                      },
                      "& .MuiInputBase-input::placeholder": {
                        color: "#7f848c",
                        opacity: 1,
                      },
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.10)",
                      },
                      "& .MuiOutlinedInput-root:hover fieldset": {
                        borderColor: "rgba(255,209,0,0.28)",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        borderColor: "#FFD100",
                      },
                    }}
                  />

                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      onClick={onAddComment}
                      disabled={commentLoading}
                      sx={{
                        textTransform: "none",
                        borderRadius: "999px",
                        fontWeight: 700,
                        bgcolor: "#FFD100",
                        color: "#111",
                        px: 2,
                        minHeight: 40,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#f5c400", boxShadow: "none" },
                      }}
                    >
                      {commentLoading ? (
                        <CircularProgress size={18} sx={{ color: "#111" }} />
                      ) : (
                        "Comment"
                      )}
                    </Button>
                  </Stack>

                  {commentError && (
                    <Typography variant="caption" color="error.main">
                      {commentError}
                    </Typography>
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: "#7f848c" }}>
                  Join the group to like, comment, and take part in the conversation.
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default PostCard;