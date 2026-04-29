import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Modal,
  Stack,
  CircularProgress,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNewGroupPage } from "./hooks/useNewGroupPage";
import GroupPageLayout from "./layout/GroupPageLayout";
import GroupHeaderBanner from "./GroupHeaderBanner";
import GroupSidebar from "./GroupSidebar";
import PostCard from "./PostCard";
import DeletePostModal from "./DeletePostModal";

const cardSx = {
  p: 3,
  bgcolor: "#1a1a1a",
  borderRadius: 3,
  border: "1px solid #2a2a2a",
};

const pageContainerSx = {
  minHeight: "100vh",
  bgcolor: "#111",
  color: "#fff",
};

const stateCardSx = {
  ...cardSx,
  py: 5,
  px: 4,
  textAlign: "center",
};

const StatePanel = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}) => (
  <Box sx={stateCardSx}>
    <Stack spacing={2} alignItems="center">
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "#202020",
          color: "#FFD100",
          border: "1px solid #2a2a2a",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#aaa", maxWidth: 480, mx: "auto", lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      </Box>

      {(primaryAction || secondaryAction) && (
        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          justifyContent="center"
        >
          {primaryAction}
          {secondaryAction}
        </Stack>
      )}
    </Stack>
  </Box>
);

const PageLoadingState = () => (
  <Box sx={{ ...pageContainerSx, display: "grid", placeItems: "center", px: 2 }}>
    <Box sx={{ ...stateCardSx, width: "min(560px, 100%)" }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress sx={{ color: "#FFD100" }} />
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
          Loading group
        </Typography>
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          Fetching group details, members, and recent activity.
        </Typography>
      </Stack>
    </Box>
  </Box>
);

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
    canManageGroup,
    memberCount,
    adminIds,
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
    handleRemoveImage,
    handlePostSubmit,
    handleLikePost,
    handleCommentChange,
    handleAddComment,
    handleLoadMorePosts,
    handleLoadMoreComments,
    openDeletePostModal,
    refetchGroup,
    refetchPosts,
    editModalOpen,
    setEditModalOpen,
    deleteGroupModalOpen,
    setDeleteGroupModalOpen,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editAvatar,
    setEditAvatar,
    editGroupError,
    deleteGroupError,
    updatingGroup,
    deletingGroup,
    openEditGroupModal,
    handleUpdateGroup,
    openDeleteGroupModal,
    handleDeleteGroup,
  } = useNewGroupPage();

  if (loading || currentUserLoading) {
    return <PageLoadingState />;
  }

  if (error || !group) {
    return (
      <Box sx={{ ...pageContainerSx, display: "grid", placeItems: "center", px: 2 }}>
        <Box sx={{ width: "min(560px, 100%)" }}>
          <StatePanel
            icon={<ErrorOutlineIcon />}
            title="We couldn’t load this group"
            description="This can happen if the group was removed, the link is invalid, or the request failed. Try again to reload the group page."
            primaryAction={
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => refetchGroup?.()}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  bgcolor: "#FFD100",
                  color: "#111",
                  "&:hover": { bgcolor: "#f5c400" },
                }}
              >
                Retry
              </Button>
            }
          />
        </Box>
      </Box>
    );
  }

  const header = (
    <GroupHeaderBanner
      group={group}
      memberCount={memberCount}
      isJoined={isJoined}
      isCreator={isCreator}
      canManageGroup={canManageGroup}
      joining={joining}
      leaving={leaving}
      isHovering={isHovering}
      setIsHovering={setIsHovering}
      onJoin={handleJoinGroup}
      onOpenLeave={() => setModalOpen(true)}
      onEditGroup={openEditGroupModal}
      onDeleteGroup={openDeleteGroupModal}
    />
  );

  const sidebar = (
    <GroupSidebar group={group} memberCount={memberCount} adminIds={adminIds} />
  );

  const renderFeed = () => {
    if (postsLoading && posts.length === 0) {
      return (
        <StatePanel
          icon={<ForumOutlinedIcon />}
          title="Loading posts"
          description="Fetching the latest conversations from this group."
        />
      );
    }

    if (postsError) {
      return (
        <StatePanel
          icon={<ErrorOutlineIcon />}
          title="We couldn’t load the posts"
          description="The group loaded, but the feed didn’t. Try again to refresh the latest posts and comments."
          primaryAction={
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetchPosts?.()}
              sx={{
                textTransform: "none",
                borderRadius: "999px",
                color: "#FFD100",
                borderColor: "#FFD100",
              }}
            >
              Retry
            </Button>
          }
        />
      );
    }

    if (posts.length === 0) {
      return (
        <StatePanel
          icon={<ForumOutlinedIcon />}
          title={isJoined ? "No posts yet" : "This group is quiet right now"}
          description={
            isJoined
              ? "Be the first to start the conversation by sharing an update, question, or photo with the group."
              : "Join the group to take part in the conversation and see new activity as members start posting."
          }
          primaryAction={
            isJoined ? (
              <Button
                variant="contained"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  bgcolor: "#FFD100",
                  color: "#111",
                  "&:hover": { bgcolor: "#f5c400" },
                }}
              >
                Create first post
              </Button>
            ) : !isCreator ? (
              <Button
                variant="contained"
                onClick={handleJoinGroup}
                disabled={joining}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  bgcolor: "#FFD100",
                  color: "#111",
                  "&:hover": { bgcolor: "#f5c400" },
                }}
              >
                {joining ? (
                  <CircularProgress size={18} sx={{ color: "#111" }} />
                ) : (
                  "Join Group"
                )}
              </Button>
            ) : null
          }
        />
      );
    }

    return (
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
              {loadingMorePosts ? (
                <CircularProgress size={18} sx={{ color: "#FFD100" }} />
              ) : (
                "Load more posts"
              )}
            </Button>
          </Box>
        )}
      </Stack>
    );
  };

  return (
    <GroupPageLayout header={header} sidebar={sidebar} variant="dark">
      <Stack spacing={3}>
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

        <Modal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          aria-labelledby="edit-group-title"
          aria-describedby="edit-group-description"
        >
          <Box
            sx={{
              bgcolor: "#1a1a1a",
              color: "#fff",
              p: 3,
              borderRadius: 3,
              border: "1px solid #333",
              width: "min(480px, calc(100vw - 32px))",
              mx: "auto",
              mt: "15vh",
            }}
          >
            <form onSubmit={handleUpdateGroup}>
              <Stack spacing={2}>
                <Typography id="edit-group-title" variant="h6" sx={{ fontWeight: 700 }}>
                  Edit group details
                </Typography>

                <Typography id="edit-group-description" variant="body2" sx={{ color: "#aaa" }}>
                  Update this group’s basic information.
                </Typography>

                <TextField
                  fullWidth
                  label="Group name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: "#000",
                      color: "#fff",
                      borderRadius: 2,
                    },
                    "& fieldset": { borderColor: "#333" },
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  multiline
                  minRows={3}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: "#000",
                      color: "#fff",
                      borderRadius: 2,
                    },
                    "& fieldset": { borderColor: "#333" },
                  }}
                />

                <TextField
                  fullWidth
                  label="Avatar URL"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: "#000",
                      color: "#fff",
                      borderRadius: 2,
                    },
                    "& fieldset": { borderColor: "#333" },
                  }}
                />

                {editGroupError && (
                  <Typography variant="caption" color="error.main">
                    {editGroupError}
                  </Typography>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => setEditModalOpen(false)}
                    sx={{
                      color: "#aaa",
                      borderColor: "#444",
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updatingGroup}
                    sx={{
                      bgcolor: "#FFD100",
                      color: "#111",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#f5c400" },
                    }}
                  >
                    {updatingGroup ? (
                      <CircularProgress size={18} sx={{ color: "#111" }} />
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Modal>

        <Modal
          open={deleteGroupModalOpen}
          onClose={() => setDeleteGroupModalOpen(false)}
          aria-labelledby="delete-group-title"
          aria-describedby="delete-group-description"
        >
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
              <Typography id="delete-group-title" variant="h6" sx={{ fontWeight: 700 }}>
                Delete this group?
              </Typography>
              <Typography id="delete-group-description" variant="body2" sx={{ color: "#aaa" }}>
                This will remove the group and all of its posts for all members.
                This action cannot be undone.
              </Typography>

              {deleteGroupError && (
                <Typography variant="caption" color="error.main">
                  {deleteGroupError}
                </Typography>
              )}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => setDeleteGroupModalOpen(false)}
                  sx={{
                    color: "#aaa",
                    borderColor: "#444",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDeleteGroup}
                  disabled={deletingGroup}
                  sx={{
                    bgcolor: "#ff6b6b",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#ff5252" },
                  }}
                >
                  {deletingGroup ? (
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                  ) : (
                    "Yes, delete group"
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="leave-group-title"
          aria-describedby="leave-group-description"
        >
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
              <Typography id="leave-group-title" variant="h6">
                Are you sure you want to leave this group?
              </Typography>
              <Typography id="leave-group-description" variant="body2" sx={{ color: "#aaa" }}>
                You will need to join again to post, like, or comment.
              </Typography>
              {joinLeaveError && (
                <Typography variant="caption" color="error.main">
                  {joinLeaveError}
                </Typography>
              )}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => setModalOpen(false)}
                  sx={{
                    color: "#aaa",
                    borderColor: "#444",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLeaveGroup}
                  disabled={leaving}
                  sx={{
                    bgcolor: "#ff6b6b",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#ff5252" },
                  }}
                >
                  {leaving ? (
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                  ) : (
                    "Yes, leave group"
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>

        {joinLeaveError && !modalOpen && !isCreator && (
          <Typography variant="caption" color="error.main">
            {joinLeaveError}
          </Typography>
        )}

        {isJoined && (
          <Box sx={cardSx}>
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
              <Stack direction="row" spacing={1.25} sx={{ my: 2, flexWrap: "wrap" }}>
                {imageSrcs.map((src, i) => (
                  <Box
                    key={`${src}-${i}`}
                    sx={{
                      position: "relative",
                      width: 88,
                      height: 88,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #2a2a2a",
                      bgcolor: "#000",
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt={`Selected upload ${i + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    <Button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        minWidth: 0,
                        width: 24,
                        height: 24,
                        p: 0,
                        borderRadius: "50%",
                        bgcolor: "rgba(17,17,17,0.78)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.14)",
                        "&:hover": {
                          bgcolor: "rgba(255,107,107,0.9)",
                        },
                      }}
                      aria-label={`Remove selected image ${i + 1}`}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </Button>
                  </Box>
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
                disabled={posting}
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  bgcolor: "#FFD100",
                  color: "#111",
                  "&:hover": { bgcolor: "#f5c400" },
                }}
              >
                {posting ? (
                  <CircularProgress size={18} sx={{ color: "#111" }} />
                ) : (
                  "Post"
                )}
              </Button>
            </Stack>
          </Box>
        )}

        <Divider sx={{ borderColor: "#2a2a2a" }} />

        {renderFeed()}
      </Stack>
    </GroupPageLayout>
  );
};

export default NewGroupPage;