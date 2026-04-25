import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";

const imageThumbSx = {
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: 1,
  border: "1px solid #333",
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
  onLike,
  onCommentChange,
  onAddComment,
  onDelete,
  onEditPost,
  onCancelEditPost,
  onEditPostContentChange,
  onEditPostImagesChange,
  onRemoveEditPostImage,
  onSavePostEdit,
  editingPostId,
  editingPostContent,
  editingPostImages,
  editPostError,
  savingPostId,
  onEditComment,
  onCancelEditComment,
  onEditCommentChange,
  onSaveCommentEdit,
  onDeleteComment,
  editingCommentId,
  editingCommentContent,
  commentActionErrors,
  savingCommentId,
  deletingCommentId,
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
  const isGroupAdmin = !!group.admins?.some((admin) => admin.id === currentUser?.id);
  const canDeletePost = isPostAuthor || isGroupCreator || isGroupAdmin;
  const isEditingPost = editingPostId === post.id;

  return (
    <Box sx={{ bgcolor: "#111", borderRadius: 2, p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography fontWeight={700} sx={{ color: "#fff" }}>
          {authorName}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          {isPostAuthor && (
            <Button
              onClick={isEditingPost ? onCancelEditPost : onEditPost}
              sx={{
                textTransform: "none",
                minWidth: "auto",
                p: 0,
                color: "#FFD100",
                "&:hover": { backgroundColor: "transparent", color: "#ffde33" },
              }}
            >
              {isEditingPost ? "Cancel edit" : "Edit"}
            </Button>
          )}

          {canDeletePost && (
            <Button
              onClick={onDelete}
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
      </Stack>

      {isEditingPost ? (
        <Box sx={{ mb: 1.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={editingPostContent}
            onChange={(e) => onEditPostContentChange(e.target.value)}
            sx={{
              mb: 1,
              "& .MuiInputBase-root": { bgcolor: "#000", color: "#fff" },
              "& fieldset": { borderColor: "#333" },
            }}
          />

          {editPostError && (
            <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mb: 1 }}>
              {editPostError}
            </Typography>
          )}

          {editingPostImages?.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
              {editingPostImages.map((img, i) => (
                <Box key={`${post.id}-edit-image-${i}`} sx={{ position: "relative" }}>
                  <Box component="img" src={img} alt={`edit-post-${i}`} sx={imageThumbSx} />
                  <IconButton
                    size="small"
                    onClick={() => onRemoveEditPostImage(i)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(0,0,0,0.72)",
                      color: "#fff",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.88)" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              component="label"
              startIcon={<InsertPhotoIcon />}
              sx={{ textTransform: "none", color: "#aaa", "&:hover": { color: "#FFD100" } }}
            >
              Add Photo
              <input hidden type="file" accept="image/*" multiple onChange={onEditPostImagesChange} />
            </Button>

            <Stack direction="row" spacing={1}>
              <Button onClick={onCancelEditPost} sx={{ textTransform: "none", color: "#aaa" }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={onSavePostEdit}
                disabled={savingPostId === post.id}
                sx={{
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#FFD100",
                  color: "#000",
                  "&:hover": { bgcolor: "#ffde33" },
                }}
              >
                {savingPostId === post.id ? (
                  <CircularProgress size={16} sx={{ color: "#000" }} />
                ) : (
                  "Save"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <>
          <Typography sx={{ color: "#fff", mb: 1 }}>{post.content}</Typography>

          {post.images && post.images.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
              {post.images.map((img, i) => (
                <Box key={i} component="img" src={img} alt={`post-${i}`} sx={imageThumbSx} />
              ))}
            </Stack>
          )}
        </>
      )}

      <Typography variant="caption" sx={{ color: "#888", display: "block", mb: 1 }}>
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button
          onClick={onLike}
          disabled={!isJoined || liking}
          startIcon={
            liking ? (
              <CircularProgress size={16} sx={{ color: hasLiked ? "#FFD100" : "#aaa" }} />
            ) : hasLiked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
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

        <Button
          disabled
          startIcon={<ChatBubbleOutlineIcon fontSize="small" />}
          sx={{ textTransform: "none", color: "#aaa", minWidth: "auto", p: 0 }}
        >
          {commentCount}
        </Button>

        <Typography sx={{ color: "#aaa" }}>Shares · {shareCount}</Typography>
      </Stack>

      {likeError && (
        <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mb: 1 }}>
          {likeError}
        </Typography>
      )}

      {post.comments?.length > 0 && (
        <Box sx={{ mb: 1.5 }}>
          {post.comments.map((comment) => {
            const commentAuthor =
              `${comment.author?.firstName || ""} ${comment.author?.lastName || ""}`.trim() ||
              comment.author?.email ||
              "Unknown user";

            const canEditComment = comment.author?.id === currentUser?.id;
            const canDeleteComment =
              canEditComment || isGroupCreator || isGroupAdmin;
            const isEditingComment = editingCommentId === comment.id;

            return (
              <Box key={comment.id} sx={{ bgcolor: "#181818", borderRadius: 2, px: 1.5, py: 1.25, mb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: "#FFD100", fontWeight: 700, fontSize: 13, mb: 0.5 }}>
                      {commentAuthor}
                    </Typography>

                    {isEditingComment ? (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          value={editingCommentContent}
                          onChange={(e) => onEditCommentChange(e.target.value)}
                          sx={{
                            mb: 1,
                            "& .MuiInputBase-root": { bgcolor: "#000", color: "#fff" },
                            "& fieldset": { borderColor: "#333" },
                          }}
                        />

                        {commentActionErrors && (
                          <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mb: 1 }}>
                            {commentActionErrors}
                          </Typography>
                        )}

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            onClick={onCancelEditComment}
                            sx={{ textTransform: "none", color: "#aaa", minWidth: "auto", p: 0 }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="small"
                            onClick={onSaveCommentEdit}
                            disabled={savingCommentId === comment.id}
                            sx={{ textTransform: "none", color: "#FFD100", minWidth: "auto", p: 0 }}
                          >
                            {savingCommentId === comment.id ? (
                              <CircularProgress size={14} sx={{ color: "#FFD100" }} />
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <Typography sx={{ color: "#ddd", fontSize: 14 }}>{comment.content}</Typography>
                    )}
                  </Box>

                  <Stack direction="row" spacing={0.5}>
                    {canEditComment && !isEditingComment && (
                      <IconButton size="small" onClick={onEditComment} sx={{ color: "#FFD100" }}>
                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                    {canDeleteComment && (
                      <IconButton
                        size="small"
                        onClick={onDeleteComment}
                        disabled={deletingCommentId === comment.id}
                        sx={{ color: "#ff6b6b" }}
                      >
                        {deletingCommentId === comment.id ? (
                          <CircularProgress size={14} sx={{ color: "#ff6b6b" }} />
                        ) : (
                          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    )}
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Box>
      )}

      {isJoined ? (
        <>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
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
              onClick={onAddComment}
              disabled={commentLoading}
              sx={{ textTransform: "none", color: "#FFD100", minWidth: 80 }}
            >
              {commentLoading ? <CircularProgress size={16} sx={{ color: "#FFD100" }} /> : "Comment"}
            </Button>
          </Stack>

          {commentError && (
            <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mt: 1 }}>
              {commentError}
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="caption" sx={{ color: "#777" }}>
          Join to interact
        </Typography>
      )}
    </Box>
  );
};

export default PostCard;