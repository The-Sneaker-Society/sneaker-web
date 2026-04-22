import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  TextField,
  Modal,
  Stack,
  AvatarGroup,
  CircularProgress,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useNewGroupPage } from "./useNewGroupPage";
import PostCard from "./PostCard";
import DeletePostModal from "./DeletePostModal";

const NewGroupPage = () => {
  const {
    loading,
    error,
    group,
    posts,
    postsLoading,
    postsError,
    currentUserLoading,
    currentUser,
    isJoined,
    isCreator,
    memberCount,

    modalOpen,
    setModalOpen,
    isHovering,
    setIsHovering,

    joinLeaveError,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteError,
    postToDelete,

    postContent,
    setPostContent,
    imageSrcs,
    postError,
    commentInputs,
    commentErrors,
    fileInputRef,

    joining,
    leaving,
    posting,

    likingPostId,
    commentLoadingByPost,
    deletingPostId,

    handleJoinGroup,
    handleLeaveGroup,
    handleDeletePost,
    handleFileInputChange,
    handlePostSubmit,
    handleLikePost,
    handleCommentChange,
    handleAddComment,
    openDeletePostModal,
  } = useNewGroupPage();

  if (loading || currentUserLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress sx={{ color: "#FFD100" }} />
      </Box>
    );
  }

  if (error || !group) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Unable to load group.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", px: 2, py: 4 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ color: "#FFD100", mb: 0.5 }}
      >
        {group.name}
      </Typography>

      <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
        {memberCount} {memberCount === 1 ? "member" : "members"}
      </Typography>

      {group.description && (
        <Typography variant="body2" sx={{ color: "#bbb", mb: 2 }}>
          {group.description}
        </Typography>
      )}

      <AvatarGroup max={6} sx={{ justifyContent: "flex-start", mb: 2 }}>
        {(group.members || []).map((member) => (
          <Avatar
            key={member.id}
            sx={{ bgcolor: "#333", color: "#FFD100", width: 36, height: 36 }}
          >
            {member.firstName?.[0] ?? member.email?.[0] ?? "?"}
          </Avatar>
        ))}
      </AvatarGroup>

      {!isCreator && (
        <>
          {isJoined ? (
            <Button
              variant="outlined"
              onClick={() => setModalOpen(true)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={leaving}
              sx={{
                mb: 2,
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
              onClick={handleJoinGroup}
              disabled={joining}
              sx={{
                mb: 2,
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

          {joinLeaveError && (
            <Typography
              variant="caption"
              sx={{ color: "#ff6b6b", display: "block", mb: 2 }}
            >
              {joinLeaveError}
            </Typography>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#1a1a1a",
            borderRadius: 2,
            p: 4,
            width: 320,
          }}
        >
          <Typography sx={{ color: "#fff", mb: 2 }}>
            Are you sure you want to leave this group?
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleLeaveGroup}
            sx={{
              bgcolor: "#ff6b6b",
              color: "#fff",
              mb: 1,
              "&:hover": { bgcolor: "#e05555" },
            }}
          >
            Yes, leave group
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => setModalOpen(false)}
            sx={{ color: "#aaa", borderColor: "#444" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <DeletePostModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeletePost}
        loading={postToDelete?.id && deletingPostId === postToDelete.id}
        error={deleteError}
      />

      <Divider sx={{ borderColor: "#333", mb: 3 }} />

      {isJoined && (
        <Box sx={{ bgcolor: "#111", borderRadius: 2, p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Write something to the group..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            multiline
            minRows={2}
            sx={{
              mb: 1,
              "& .MuiInputBase-root": {
                bgcolor: "#000",
                color: "#fff",
                borderRadius: 1,
              },
              "& fieldset": { borderColor: "#333" },
            }}
          />

          {postError && (
            <Typography
              variant="caption"
              sx={{ color: "#ff6b6b", display: "block", mb: 1 }}
            >
              {postError}
            </Typography>
          )}

          {imageSrcs.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1, flexWrap: "wrap" }}
            >
              {imageSrcs.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt={`preview-${i}`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid #333",
                  }}
                />
              ))}
            </Stack>
          )}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />

            <Button
              startIcon={<InsertPhotoIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                textTransform: "none",
                color: "#aaa",
                "&:hover": { color: "#FFD100" },
              }}
            >
              Photo
            </Button>

            <Button
              variant="contained"
              onClick={handlePostSubmit}
              disabled={posting || !postContent.trim()}
              sx={{
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#FFD100",
                color: "#000",
                "&:hover": { bgcolor: "#ffde33" },
                "&:disabled": { bgcolor: "#555", color: "#888" },
              }}
            >
              {posting ? (
                <CircularProgress size={16} sx={{ color: "#000" }} />
              ) : (
                "Post"
              )}
            </Button>
          </Stack>
        </Box>
      )}

      {postsLoading ? (
        <Typography sx={{ color: "#999", textAlign: "center", mt: 3 }}>
          Loading posts...
        </Typography>
      ) : postsError ? (
        <Typography sx={{ color: "error.main", textAlign: "center", mt: 3 }}>
          Failed to load posts.
        </Typography>
      ) : posts.length === 0 ? (
        <Typography sx={{ color: "#999", textAlign: "center", mt: 3 }}>
          No posts yet
        </Typography>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            group={group}
            isJoined={isJoined}
            liking={likingPostId === post.id}
            deleting={deletingPostId === post.id}
            commentLoading={!!commentLoadingByPost[post.id]}
            commentValue={commentInputs[post.id] || ""}
            commentError={commentErrors[post.id]}
            likeError={likeError}
            onLike={() => handleLikePost(post.id)}
            onCommentChange={(value) => handleCommentChange(post.id, value)}
            onAddComment={() => handleAddComment(post.id)}
            onDelete={() => openDeletePostModal(post)}
          />
        ))
      )}
    </Box>
  );
};

export default NewGroupPage;