import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const actionButtonSx = {
  textTransform: "none",
  minWidth: "auto",
  p: 0,
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

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#1a1a1a",
        borderRadius: 3,
        border: "1px solid #2a2a2a",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ color: "#FFD100", fontWeight: 700 }}
            >
              {authorName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#777" }}>
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
            </Typography>
          </Box>

          {canDeletePost && (
            <Button
              startIcon={<DeleteOutlineIcon />}
              onClick={onDelete}
              disabled={deleting}
              sx={{
                ...actionButtonSx,
                color: "#ff6b6b",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#ff8a8a",
                },
                "&.Mui-disabled": {
                  color: "#777",
                },
              }}
            >
              Delete
            </Button>
          )}
        </Stack>

        <Typography variant="body1" sx={{ color: "#eee", whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>

        {post.images?.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {post.images.map((img, i) => (
              <Box
                key={`${img}-${i}`}
                component="img"
                src={img}
                alt={`Post image ${i + 1}`}
                sx={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #2a2a2a",
                }}
              />
            ))}
          </Stack>
        )}

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ color: "#aaa", flexWrap: "wrap" }}
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
              ...actionButtonSx,
              color: !isJoined ? "#666" : hasLiked ? "#FFD100" : "#aaa",
              "&.Mui-disabled": {
                color: "#666",
              },
            }}
          >
            {hasLiked ? "Liked" : "Like"} · {likeCount}
          </Button>

          <Stack direction="row" spacing={0.75} alignItems="center">
            <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "#888" }} />
            <Typography variant="body2" sx={{ color: "#888" }}>
              {commentCount}
            </Typography>
          </Stack>
        </Stack>

        {likeError && (
          <Typography variant="caption" color="error.main">
            {likeError}
          </Typography>
        )}

        {visibleComments.length > 0 && (
          <Stack spacing={1.25}>
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
                    p: 1.5,
                    bgcolor: "#141414",
                    border: "1px solid #2a2a2a",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#FFD100",
                      display: "block",
                      mb: 0.5,
                      fontWeight: 700,
                    }}
                  >
                    {commentAuthor}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#ddd" }}>
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
          <Stack spacing={1.25}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentValue}
              onChange={(e) => onCommentChange(e.target.value)}
              sx={{
                "& .MuiInputBase-root": {
                  bgcolor: "#000",
                  color: "#fff",
                },
                "& fieldset": { borderColor: "#333" },
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
                  bgcolor: "#FFD100",
                  color: "#111",
                  "&:hover": { bgcolor: "#f5c400" },
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
          <Typography variant="body2" sx={{ color: "#777" }}>
            Join to interact
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default PostCard;