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
import GroupHeaderBanner from "../Groups/components/GroupHeaderBanner";
import GroupSidebar from "../Groups/components/GroupSidebar";
import PostCard from "./PostCard";
import DeletePostModal from "./DeletePostModal";

const cardSx = {
  p: { xs: 2, md: 2.5 },
  bgcolor: "#151618",
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
};

const pageContainerSx = {
  minHeight: "100vh",
  bgcolor: "#0b0b0c",
  color: "#fff",
};

const stateCardSx = {
  ...cardSx,
  py: { xs: 4, md: 5 },
  px: { xs: 2.5, md: 4 },
  textAlign: "center",
};

const modalCardSx = {
  bgcolor: "#151618",
  color: "#fff",
  p: 3,
  borderRadius: 3,
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.34)",
  width: "min(440px, calc(100vw - 32px))",
  mx: "auto",
  mt: { xs: "12vh", sm: "16vh" },
};

const modalFieldSx = {
  "& .MuiInputBase-root": {
    bgcolor: "#0d0e10",
    color: "#fff",
    borderRadius: 2,
  },
  "& .MuiInputLabel-root": {
    color: "#9ea3ab",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FFD100",
  },
  "& fieldset": {
    borderColor: "rgba(255,255,255,0.10)",
  },
  "& .MuiOutlinedInput-root:hover fieldset": {
    borderColor: "rgba(255,209,0,0.35)",
  },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "#FFD100",
  },
};

const secondaryButtonSx = {
  color: "#c2c6cc",
  borderColor: "rgba(255,255,255,0.14)",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  px: 2,
  minHeight: 44,
  "&:hover": {
    borderColor: "rgba(255,209,0,0.35)",
    bgcolor: "rgba(255,255,255,0.02)",
  },
};

const primaryButtonSx = {
  bgcolor: "#FFD100",
  color: "#111",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  boxShadow: "none",
  px: 2,
  minHeight: 44,
  "&:hover": {
    bgcolor: "#f5c400",
    boxShadow: "none",
  },
};

const destructiveButtonSx = {
  bgcolor: "#ff6b6b",
  color: "#fff",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  boxShadow: "none",
  px: 2,
  minHeight: 44,
  "&:hover": {
    bgcolor: "#ff5252",
    boxShadow: "none",
  },
};

const filledUtilityButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  alignSelf: "flex-start",
  minHeight: 42,
  px: 1.75,
  bgcolor: "#23252a",
  color: "#fff",
  boxShadow: "none",
  border: "1px solid rgba(255,255,255,0.10)",
  "&:hover": {
    bgcolor: "#2c2f35",
    boxShadow: "none",
    borderColor: "rgba(255,209,0,0.35)",
  },
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
  <Box
    sx={{ ...pageContainerSx, display: "grid", placeItems: "center", px: 2 }}
  >
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
      <Box
        sx={{
          ...pageContainerSx,
          display: "grid",
          placeItems: "center",
          px: 2,
        }}
      >
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
                sx={primaryButtonSx}
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
                ...secondaryButtonSx,
                color: "#FFD100",
                borderColor: "#FFD100",
                "&:hover": {
                  borderColor: "#FFD100",
                  bgcolor: "rgba(255,209,0,0.05)",
                },
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
                sx={primaryButtonSx}
              >
                Create first post
              </Button>
            ) : !isCreator ? (
              <Button
                variant="contained"
                onClick={handleJoinGroup}
                disabled={joining}
                sx={primaryButtonSx}
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
                ...secondaryButtonSx,
                color: "#FFD100",
                borderColor: "#FFD100",
                "&:hover": {
                  borderColor: "#FFD100",
                  bgcolor: "rgba(255,209,0,0.05)",
                },
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
          <Box sx={modalCardSx}>
            <form onSubmit={handleUpdateGroup}>
              <Stack spacing={2}>
                <Typography
                  id="edit-group-title"
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  Edit group details
                </Typography>

                <Typography
                  id="edit-group-description"
                  variant="body2"
                  sx={{ color: "#aaa" }}
                >
                  Update this group’s basic information.
                </Typography>

                <TextField
                  fullWidth
                  label="Group name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={modalFieldSx}
                />

                <TextField
                  fullWidth
                  label="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  multiline
                  minRows={3}
                  InputLabelProps={{ shrink: true }}
                  sx={modalFieldSx}
                />

                <TextField
                  fullWidth
                  label="Avatar URL"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={modalFieldSx}
                />

                {editGroupError && (
                  <Typography variant="caption" color="error.main">
                    {editGroupError}
                  </Typography>
                )}

                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  spacing={1.5}
                  justifyContent="flex-end"
                >
                  <Button
                    variant="outlined"
                    onClick={() => setEditModalOpen(false)}
                    sx={secondaryButtonSx}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updatingGroup}
                    sx={primaryButtonSx}
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
          <Box sx={modalCardSx}>
            <Stack spacing={2}>
              <Typography
                id="delete-group-title"
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Delete this group?
              </Typography>

              <Typography
                id="delete-group-description"
                variant="body2"
                sx={{ color: "#aaa", lineHeight: 1.6 }}
              >
                This will remove the group and all of its posts for all members.
                This action cannot be undone.
              </Typography>

              {deleteGroupError && (
                <Typography variant="caption" color="error.main">
                  {deleteGroupError}
                </Typography>
              )}

              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={1.5}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => setDeleteGroupModalOpen(false)}
                  sx={secondaryButtonSx}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleDeleteGroup}
                  disabled={deletingGroup}
                  sx={destructiveButtonSx}
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
          <Box sx={modalCardSx}>
            <Stack spacing={2}>
              <Typography
                id="leave-group-title"
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Leave this group?
              </Typography>

              <Typography
                id="leave-group-description"
                variant="body2"
                sx={{ color: "#aaa", lineHeight: 1.6 }}
              >
                You will need to join again to post, like, or comment.
              </Typography>

              {joinLeaveError && (
                <Typography variant="caption" color="error.main">
                  {joinLeaveError}
                </Typography>
              )}

              <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                spacing={1.5}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => setModalOpen(false)}
                  sx={secondaryButtonSx}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleLeaveGroup}
                  disabled={leaving}
                  sx={destructiveButtonSx}
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
              minRows={3}
              sx={{
                mb: 1.75,
                "& .MuiInputBase-root": {
                  bgcolor: "#0d0e10",
                  color: "#fff",
                  borderRadius: 2.5,
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#7f848c",
                  opacity: 1,
                },
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.10)",
                },
                "& .MuiOutlinedInput-root:hover fieldset": {
                  borderColor: "rgba(255,209,0,0.35)",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#FFD100",
                },
              }}
            />

            {postError && (
              <Typography
                variant="caption"
                color="error.main"
                sx={{ display: "block", mb: 1 }}
              >
                {postError}
              </Typography>
            )}

            {imageSrcs.length > 0 && (
              <Stack
                direction="row"
                spacing={1.25}
                sx={{ my: 2, flexWrap: "wrap" }}
                useFlexGap
              >
                {imageSrcs.map((src, i) => (
                  <Box
                    key={`${src}-${i}`}
                    sx={{
                      position: "relative",
                      width: 92,
                      height: 92,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.08)",
                      bgcolor: "#0d0e10",
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
                        width: 26,
                        height: 26,
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "center" }}
              spacing={1.5}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.9, sm: 1.5 }}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Button
                  variant="contained"
                  startIcon={<InsertPhotoIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  sx={filledUtilityButtonSx}
                >
                  Photo
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#aeb3bb",
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                  }}
                >
                  Up to 4 images, 5MB each
                </Typography>
              </Stack>

              <Button
                variant="contained"
                onClick={handlePostSubmit}
                disabled={posting}
                sx={{
                  ...primaryButtonSx,
                  alignSelf: { xs: "stretch", sm: "auto" },
                  minWidth: { sm: 108 },
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