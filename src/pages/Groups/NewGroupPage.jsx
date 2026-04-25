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

const pageContainerSx = {
  minHeight: "100vh",
  bgcolor: "#111",
  color: "#fff",
  px: { xs: 2, md: 4 },
  py: 4,
};

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
    hasMorePosts,
    loadingMorePosts,
    loadingMoreCommentsByPost,

    modalOpen,
    setModalOpen,
    isHovering,
    setIsHovering,

    joinLeaveError,
    likeErrors,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteError,
    setDeleteError,
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
    handleLoadMorePosts,
    handleLoadMoreComments,
    openDeletePostModal,
  } = useNewGroupPage();

  if (loading || currentUserLoading) {
    return (
      <Box sx={{ ...pageContainerSx, display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#FFD100" }} />
      </Box>
    );
  }

  if (error || !group) {
    return (
      <Box sx={{ ...pageContainerSx, display: "grid", placeItems: "center" }}>
        <Typography color="error.main">Unable to load group.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={pageContainerSx}>
      <Stack spacing={3} maxWidth="900px" mx="auto">
        <Box sx={{ p: 3, bgcolor: "#1a1a1a", borderRadius: 3, border: "1px solid #2a2a2a" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ color: "#FFD100", mb: 1 }}>
                {group.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </Typography>
              {group.description && (
                <Typography variant="body1" sx={{ color: "#ddd" }}>
                  {group.description}
                </Typography>
              )}
            </Box>

            <Stack spacing={2} alignItems={{ xs: "flex-start", md: "flex-end" }}>
              <AvatarGroup max={6}>
                {(group.members || []).map((member) => (
                  <Avatar key={member.id} sx={{ bgcolor: "#333", color: "#FFD100" }}>
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
                      {leaving ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : isHovering ? "Leave Group" : "Joined ✓"}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleJoinGroup}
                      disabled={joining}
                      sx={{
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: 700,
                        bgcolor: "#FFD100",
                        color: "#111",
                        "&:hover": { bgcolor: "#f5c400" },
                      }}
                    >
                      {joining ? <CircularProgress size={18} sx={{ color: "#111" }} /> : "Join Group"}
                    </Button>
                  )}

                  {joinLeaveError && (
                    <Typography variant="caption" color="error.main">
                      {joinLeaveError}
                    </Typography>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Box>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              bgcolor: "#1a1a1a",
              color: "#fff",
              p: 3,
              borderRadius: 3,
              border: "1px solid #333",
              width: "min(420px, calc(100vw - 32px))",
              mx: "auto",
              mt: "20vh",
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">Are you sure you want to leave this group?</Typography>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => setModalOpen(false)}
                  sx={{ color: "#aaa", borderColor: "#444", textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLeaveGroup}
                  sx={{ bgcolor: "#ff6b6b", textTransform: "none", "&:hover": { bgcolor: "#ff5252" } }}
                >
                  Yes, leave group
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>

        <DeletePostModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeleteError("");
          }}
          onConfirm={handleDeletePost}
          loading={postToDelete?.id && deletingPostId === postToDelete.id}
          error={deleteError}
        />

        {isJoined && (
          <Box sx={{ p: 3, bgcolor: "#1a1a1a", borderRadius: 3, border: "1px solid #2a2a2a" }}>
            <TextField
              fullWidth
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share something with the group..."
              multiline
              minRows={2}
              sx={{
                mb: 1,
                "& .MuiInputBase-root": {
                  bgcolor: "#000",
                  color: "#fff",
                  borderRadius: 2,
                },
                "& fieldset": { borderColor: "#333" },
              }}
            />

            {postError && (
              <Typography variant="caption" color="error.main">
                {postError}
              </Typography>
            )}

            {imageSrcs.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ my: 2, flexWrap: "wrap" }}>
                {imageSrcs.map((src, i) => (
                  <Box
                    key={`${src}-${i}`}
                    component="img"
                    src={src}
                    alt={`Selected upload ${i + 1}`}
                    sx={{ width: 88, height: 88, objectFit: "cover", borderRadius: 2 }}
                  />
                ))}
              </Stack>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileInputChange}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Button
                startIcon={<InsertPhotoIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ textTransform: "none", color: "#aaa", "&:hover": { color: "#FFD100" } }}
              >
                Photo
              </Button>
              <Button
                variant="contained"
                onClick={handlePostSubmit}
                disabled={posting}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  bgcolor: "#FFD100",
                  color: "#111",
                  "&:hover": { bgcolor: "#f5c400" },
                }}
              >
                {posting ? <CircularProgress size={18} sx={{ color: "#111" }} /> : "Post"}
              </Button>
            </Stack>
          </Box>
        )}

        <Divider sx={{ borderColor: "#2a2a2a" }} />

        {postsLoading && posts.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ color: "#aaa" }}>Loading posts...</Typography>
          </Box>
        ) : postsError ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography color="error.main">Failed to load posts.</Typography>
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ color: "#aaa" }}>No posts yet</Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {posts.map((post) => (
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
                commentError={commentErrors[post.id] || ""}
                likeError={likeErrors[post.id] || ""}
                loadingMoreComments={!!loadingMoreCommentsByPost[post.id]}
                onLike={() => handleLikePost(post.id)}
                onCommentChange={(value) => handleCommentChange(post.id, value)}
                onAddComment={() => handleAddComment(post.id)}
                onLoadMoreComments={() => handleLoadMoreComments(post.id)}
                onDelete={() => openDeletePostModal(post)}
              />
            ))}

            {hasMorePosts && (
              <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMorePosts}
                  disabled={loadingMorePosts}
                  sx={{
                    textTransform: "none",
                    borderRadius: "999px",
                    color: "#FFD100",
                    borderColor: "#FFD100",
                  }}
                >
                  {loadingMorePosts ? <CircularProgress size={18} sx={{ color: "#FFD100" }} /> : "Load more posts"}
                </Button>
              </Box>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default NewGroupPage;