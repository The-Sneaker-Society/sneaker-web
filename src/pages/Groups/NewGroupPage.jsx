import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Modal,
  Stack,
  CircularProgress,
  IconButton,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";
import { useNewGroupPage } from "./hooks/useNewGroupPage";
import PostCard from "./PostCard";
import DeletePostModal from "./DeletePostModal";
import GroupHeaderBanner from "./components/GroupHeaderBanner";
import GroupSidebar from "./components/GroupSidebar";
import GroupActionSnackbar from "./components/GroupActionSnackbar";
import GroupPageLayout from "./layout/GroupPageLayout";

const modalSx = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#1a1a1a",
  borderRadius: 2,
  p: 4,
  width: "min(92vw, 480px)",
  boxShadow: 24,
};

const stateCardSx = {
  bgcolor: "#111",
  border: "1px solid #2b2b2b",
  borderRadius: 3,
  px: 3,
  py: 4,
  textAlign: "center",
};

const imageThumbSx = {
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: 1,
  border: "1px solid #333",
};

const ErrorStateCard = ({ title, description, onRetry }) => (
  <Box sx={stateCardSx}>
    <Typography sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>{title}</Typography>
    <Typography sx={{ color: "#9a9a9a", mb: 2 }}>{description}</Typography>
    <Button
      variant="outlined"
      onClick={onRetry}
      sx={{
        borderRadius: "999px",
        textTransform: "none",
        fontWeight: 700,
        color: "#FFD100",
        borderColor: "#FFD100",
        "&:hover": { borderColor: "#ffde33", bgcolor: "rgba(255,209,0,0.08)" },
      }}
    >
      Try again
    </Button>
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
    editGroupModalOpen,
    setEditGroupModalOpen,
    deleteGroupModalOpen,
    setDeleteGroupModalOpen,
    groupActionError,
    editGroupName,
    setEditGroupName,
    editGroupDescription,
    setEditGroupDescription,
    editGroupAvatar,
    editAvatarInputRef,
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
    updatingGroup,
    deletingGroup,
    likingPostId,
    commentLoadingByPost,
    deletingPostId,
    actionToast,
    closeToast,
    handleRetryGroupLoad,
    handleRetryPostsLoad,
    handleJoinGroup,
    handleLeaveGroup,
    openEditGroupModal,
    openDeleteGroupModal,
    handleEditGroupAvatarChange,
    handleUpdateGroup,
    handleDeleteGroup,
    handleDeletePost,
    handleFileInputChange,
    handleRemoveComposerImage,
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
      <Box sx={{ maxWidth: 680, mx: "auto", px: 2, py: 4 }}>
        <ErrorStateCard
          title="We couldn't load this group"
          description="Something went wrong while fetching the group details. Please try again."
          onRetry={handleRetryGroupLoad}
        />
      </Box>
    );
  }

  return (
    <>
      <GroupPageLayout
        header={
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
        }
        sidebar={<GroupSidebar group={group} memberCount={memberCount} adminIds={adminIds} />}
      >
        {joinLeaveError && (
          <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mb: 2 }}>
            {joinLeaveError}
          </Typography>
        )}

        <Typography sx={{ color: "#fff", fontWeight: 700, mb: 1.5 }}>Discussion</Typography>
        <Divider sx={{ borderColor: "#333", mb: 3 }} />

        {isJoined && (
          <Box sx={{ bgcolor: "#111", borderRadius: 2, p: 2, mb: 3, border: "1px solid #2b2b2b" }}>
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
              <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mb: 1 }}>
                {postError}
              </Typography>
            )}

            {imageSrcs.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                {imageSrcs.map((src, i) => (
                  <Box key={i} sx={{ position: "relative" }}>
                    <Box component="img" src={src} alt={`preview-${i}`} sx={imageThumbSx} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveComposerImage(i)}
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

            <Stack direction="row" alignItems="center" justifyContent="space-between">
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
                sx={{ textTransform: "none", color: "#aaa", "&:hover": { color: "#FFD100" } }}
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
                  "&.Mui-disabled": { bgcolor: "#555", color: "#888" },
                }}
              >
                {posting ? <CircularProgress size={16} sx={{ color: "#000" }} /> : "Post"}
              </Button>
            </Stack>
          </Box>
        )}

        {postsLoading ? (
          <Typography sx={{ color: "#999", textAlign: "center", mt: 3 }}>Loading posts...</Typography>
        ) : postsError ? (
          <ErrorStateCard
            title="We couldn't load the post feed"
            description="The group loaded, but the post feed did not. Try fetching the posts again."
            onRetry={handleRetryPostsLoad}
          />
        ) : posts.length === 0 ? (
          <Box sx={stateCardSx}>
            <Typography sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>No posts yet</Typography>
            <Typography sx={{ color: "#9a9a9a" }}>
              {isJoined
                ? "Be the first to start the conversation in this group."
                : "Join the group to start participating in the conversation."}
            </Typography>
          </Box>
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
              commentError={commentErrors[post.id] || ""}
              likeError={likeErrors[post.id] || ""}
              onLike={() => handleLikePost(post.id)}
              onCommentChange={(value) => handleCommentChange(post.id, value)}
              onAddComment={() => handleAddComment(post.id)}
              onDelete={() => openDeletePostModal(post)}
            />
          ))
        )}
      </GroupPageLayout>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={modalSx}>
          <Typography sx={{ color: "#fff", mb: 2 }}>Are you sure you want to leave this group?</Typography>
          <Button fullWidth variant="contained" onClick={handleLeaveGroup} sx={{ bgcolor: "#ff6b6b", color: "#fff", mb: 1, "&:hover": { bgcolor: "#e05555" } }}>
            Yes, leave group
          </Button>
          <Button fullWidth variant="outlined" color="inherit" onClick={() => setModalOpen(false)} sx={{ color: "#aaa", borderColor: "#444" }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      <Modal open={editGroupModalOpen} onClose={() => setEditGroupModalOpen(false)}>
        <Box sx={modalSx}>
          <Typography variant="h6" sx={{ color: "#FFD100", fontWeight: 700, mb: 3 }}>Edit Group</Typography>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <input ref={editAvatarInputRef} accept="image/*" style={{ display: "none" }} id="edit-group-avatar" type="file" onChange={handleEditGroupAvatarChange} />
            <label htmlFor="edit-group-avatar">
              <IconButton component="span">
                <Box component="img" src={editGroupAvatar || group.avatar || undefined} alt={group.name} sx={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", bgcolor: "#333" }} />
              </IconButton>
            </label>
            <Typography variant="caption" sx={{ color: "#b3b3b3", mt: 1, display: "block" }}>Upload Group Photo</Typography>
          </Box>
          <TextField fullWidth label="Group Name" variant="outlined" value={editGroupName} onChange={(e) => setEditGroupName(e.target.value)} sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "#000", color: "#fff" }, "& .MuiInputLabel-root": { color: "#b3b3b3" } }} />
          <TextField fullWidth label="Description" variant="outlined" multiline rows={3} value={editGroupDescription} onChange={(e) => setEditGroupDescription(e.target.value)} sx={{ mb: 2, "& .MuiInputBase-root": { bgcolor: "#000", color: "#fff" }, "& .MuiInputLabel-root": { color: "#b3b3b3" } }} />
          {groupActionError && <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mb: 2 }}>{groupActionError}</Typography>}
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button onClick={() => setEditGroupModalOpen(false)} sx={{ color: "#aaa", textTransform: "none" }}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateGroup} disabled={updatingGroup} sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#FFD100", color: "#000", "&:hover": { bgcolor: "#ffde33" } }}>
              {updatingGroup ? <CircularProgress size={16} sx={{ color: "#000" }} /> : "Save Changes"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={deleteGroupModalOpen} onClose={() => setDeleteGroupModalOpen(false)}>
        <Box sx={modalSx}>
          <Typography variant="h6" sx={{ color: "#ff6b6b", fontWeight: 700, mb: 2 }}>Delete Group</Typography>
          <Typography sx={{ color: "#fff", mb: 2 }}>Are you sure you want to delete <strong>{group.name}</strong>? This action cannot be undone.</Typography>
          {groupActionError && <Typography variant="caption" sx={{ color: "#ff6b6b", display: "block", mb: 2 }}>{groupActionError}</Typography>}
          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => setDeleteGroupModalOpen(false)} sx={{ color: "#aaa", borderColor: "#444", textTransform: "none" }}>Cancel</Button>
            <Button variant="contained" onClick={handleDeleteGroup} disabled={deletingGroup} sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#ff6b6b", color: "#fff", "&:hover": { bgcolor: "#e05555" } }}>
              {deletingGroup ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : "Delete Group"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <DeletePostModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteError(""); }}
        onConfirm={handleDeletePost}
        loading={postToDelete?.id && deletingPostId === postToDelete.id}
        error={deleteError}
      />

      <GroupActionSnackbar open={actionToast.open} onClose={closeToast} message={actionToast.message} severity={actionToast.severity} />
    </>
  );
};

export default NewGroupPage;