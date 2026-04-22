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
  onLike,
  onCommentChange,
  onAddComment,
  onDelete,
}) => {
  const authorName =
    `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim() ||
    post.author?.email ||
    "Unknown user";

  const likeCount = post.likes?.length || 0;
  const commentCount = post.comments?.length || 0;
  const shareCount = post.shares || 0;

  const hasLiked = !!post.likes?.some((like) => like.id === currentUser?.id);

  const isPostAuthor = post.author?.id === currentUser?.id;
  const isGroupCreator = group.createdBy?.id === currentUser?.id;
  const isGroupAdmin = !!group.admins?.some(
    (admin) => admin.id === currentUser?.id,
  );
  const canDeletePost = isPostAuthor || isGroupCreator || isGroupAdmin;

  return (
    <Box
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: "#111",
        border: "1px solid #2a2a2a",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 700 }}>
          {authorName}
        </Typography>

        {canDeletePost && (
          <Button
            size="small"
            onClick={onDelete}
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
            disabled={deleting}
            sx={{
              textTransform: "none",
              minWidth: "auto",
              p: 0,
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

      <Typography sx={{ color: "#ddd", mb: post.images?.length ? 2 : 0 }}>
        {post.content}
      </Typography>

      {post.images && post.images.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {post.images.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              alt={`post-${post.id}-image-${i + 1}`}
              sx={{
                width: 110,
                height: 110,
                objectFit: "cover",
                borderRadius: 1,
                mt: 1,
              }}
            />
          ))}
        </Stack>
      )}

      <Typography sx={{ color: "#777", fontSize: 12, mt: 1.5 }}>
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 1.5, mb: 1 }}>
        <Button
          size="small"
          onClick={onLike}
          disabled={!isJoined || liking}
          startIcon={
            liking ? (
              <CircularProgress size={16} sx={{ color: "#FFD100" }} />
            ) : hasLiked ? (
              <FavoriteIcon sx={{ fontSize: 18 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            textTransform: "none",
            color: !isJoined ? "#666" : hasLiked ? "#FFD100" : "#aaa",
            minWidth: "auto",
            p: 0,
            "&.Mui-disabled": {
              color: "#666",
            },
          }}
        >
          {hasLiked ? "Liked" : "Like"} · {likeCount}
        </Button>

        <Typography
          sx={{
            color: "#aaa",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
          {commentCount}
        </Typography>

        <Typography sx={{ color: "#aaa", fontSize: 14 }}>
          Shares · {shareCount}
        </Typography>
      </Stack>

      {likeError && (
        <Typography
          variant="caption"
          sx={{
            color: "#ff6b6b",
            display: "block",
            mb: 1,
          }}
        >
          {likeError}
        </Typography>
      )}

      {post.comments?.length > 0 && (
        <Stack spacing={1} sx={{ mt: 1 }}>
          {post.comments.map((comment) => {
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
                  bgcolor: "#1a1a1a",
                  borderRadius: 1,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography
                  sx={{ color: "#fff", fontSize: 13, fontWeight: 700 }}
                >
                  {commentAuthor}
                </Typography>
                <Typography sx={{ color: "#ccc", fontSize: 13 }}>
                  {comment.content}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}

      {isJoined ? (
        <>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
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
            <Button
              variant="contained"
              onClick={onAddComment}
              disabled={commentLoading || !commentValue.trim()}
              sx={{
                textTransform: "none",
                bgcolor: "#FFD100",
                color: "#000",
                "&:hover": { bgcolor: "#ffde33" },
                "&:disabled": { bgcolor: "#555", color: "#888" },
              }}
            >
              {commentLoading ? (
                <CircularProgress size={16} sx={{ color: "#000" }} />
              ) : (
                "Comment"
              )}
            </Button>
          </Stack>

          {commentError && (
            <Typography
              variant="caption"
              sx={{
                color: "#ff6b6b",
                display: "block",
                mt: 1,
              }}
            >
              {commentError}
            </Typography>
          )}
        </>
      ) : (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1.5,
            color: "#888",
            fontStyle: "italic",
          }}
        >
          Join to interact
        </Typography>
      )}
    </Box>
  );
};

export default PostCard;
