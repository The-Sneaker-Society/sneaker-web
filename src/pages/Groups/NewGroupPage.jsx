import { Box, Button, Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNewGroupPage } from "./hooks/useNewGroupPage";
import GroupPageLayout from "./layout/GroupPageLayout";
import GroupHeaderBanner from "../Groups/components/GroupHeaderBanner";
import GroupSidebar from "../Groups/components/GroupSidebar";
import DeletePostModal from "./DeletePostModal";
import GroupComposerCard from "./components/GroupComposerCard";
import GroupFeedSection from "./components/GroupFeedSection";
import GroupPageModals from "./components/GroupPageModals";
import EditPostModal from "./components/EditPostModal";
import {
  FeedSectionHeader,
  PageLoadingState,
  StatePanel,
} from "./components/GroupPageStates";
import { useGroupPageStyles } from "./styles/groupPageStyles";

const NewGroupPage = () => {
  const { colors, pageContainerSx, primaryButtonSx } = useGroupPageStyles();

  const {
    loading,
    error,
    group,
    posts,
    postsLoading,
    postsError,
    currentUserLoading,
    currentUser,
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
    deleteError,
    setDeleteError,
    postToDelete,
    editModalOpen,
    postToEdit,
    editContent,
    setEditContent,
    editImages,
    setEditImages,
    editError,
    setEditError,
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
    updatingPostId,
    handleJoinGroup,
    handleLeaveGroup,
    closeDeletePostModal,
    handleDeletePost,
    openEditPostModal,
    closeEditPostModal,
    handleUpdatePost,
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
    editGroupModalOpen,
    setEditGroupModalOpen,
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
    openDeleteGroupModal,
    handleUpdateGroup,
    handleDeleteGroup,
    isJoined,
    isCreator,
    canManageGroup,
    canInteractWithPosts,
    isVisitor,
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

  const handleOpenEditGroup = () => {
    if (!canManageGroup) return;
    openEditGroupModal();
  };

  const handleOpenDeleteGroup = () => {
    if (!canManageGroup) return;
    openDeleteGroupModal();
  };

  const isDeleteModerationAction =
    !!postToDelete &&
    postToDelete.author?.id &&
    postToDelete.author.id !== currentUser?.id;

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
      onEditGroup={handleOpenEditGroup}
      onDeleteGroup={handleOpenDeleteGroup}
    />
  );

  const sidebar = (
    <GroupSidebar group={group} memberCount={memberCount} adminIds={adminIds} />
  );

  return (
    <GroupPageLayout header={header} sidebar={sidebar}>
      <Stack spacing={3}>
        <DeletePostModal
          open={deleteModalOpen}
          onClose={() => {
            closeDeletePostModal();
            setDeleteError("");
          }}
          onConfirm={handleDeletePost}
          loading={postToDelete?.id && deletingPostId === postToDelete.id}
          error={deleteError}
          isModerationAction={isDeleteModerationAction}
        />

        <EditPostModal
          open={editModalOpen}
          onClose={closeEditPostModal}
          onConfirm={handleUpdatePost}
          loading={postToEdit?.id && updatingPostId === postToEdit.id}
          error={editError}
          content={editContent}
          setContent={setEditContent}
        />

        <GroupPageModals
          editModalOpen={editGroupModalOpen}
          setEditModalOpen={setEditGroupModalOpen}
          deleteGroupModalOpen={deleteGroupModalOpen}
          setDeleteGroupModalOpen={setDeleteGroupModalOpen}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          editName={editName}
          setEditName={setEditName}
          editDescription={editDescription}
          setEditDescription={setEditDescription}
          editAvatar={editAvatar}
          setEditAvatar={setEditAvatar}
          editGroupError={editGroupError}
          deleteGroupError={deleteGroupError}
          joinLeaveError={joinLeaveError}
          updatingGroup={updatingGroup}
          deletingGroup={deletingGroup}
          leaving={leaving}
          handleUpdateGroup={handleUpdateGroup}
          handleDeleteGroup={handleDeleteGroup}
          handleLeaveGroup={handleLeaveGroup}
        />

        {joinLeaveError && !modalOpen && !isCreator && (
          <Typography variant="caption" sx={{ color: colors.status.error }}>
            {joinLeaveError}
          </Typography>
        )}

        {isJoined && (
          <GroupComposerCard
            postContent={postContent}
            setPostContent={setPostContent}
            postError={postError}
            imageSrcs={imageSrcs}
            fileInputRef={fileInputRef}
            handleFileInputChange={handleFileInputChange}
            handleRemoveImage={handleRemoveImage}
            handlePostSubmit={handlePostSubmit}
            posting={posting}
          />
        )}

        <FeedSectionHeader postCount={posts.length} />

        <GroupFeedSection
          posts={posts}
          postsLoading={postsLoading}
          postsError={postsError}
          isJoined={isJoined}
          canInteractWithPosts={canInteractWithPosts}
          isVisitor={isVisitor}
          isCreator={isCreator}
          joining={joining}
          currentUser={currentUser}
          group={group}
          editModalOpen={editModalOpen}
          postToEdit={postToEdit}
          editContent={editContent}
          setEditContent={setEditContent}
          editImages={editImages}
          setEditImages={setEditImages}
          editError={editError}
          setEditError={setEditError}
          updatingPostId={updatingPostId}
          closeEditPostModal={closeEditPostModal}
          handleUpdatePost={handleUpdatePost}
          openEditPostModal={openEditPostModal}
          likingPostId={likingPostId}
          deletingPostId={deletingPostId}
          commentLoadingByPost={commentLoadingByPost}
          commentInputs={commentInputs}
          commentErrors={commentErrors}
          likeErrors={likeErrors}
          loadingMoreCommentsByPost={loadingMoreCommentsByPost}
          hasMorePosts={hasMorePosts}
          loadingMorePosts={loadingMorePosts}
          refetchPosts={refetchPosts}
          handleJoinGroup={handleJoinGroup}
          handleLikePost={handleLikePost}
          handleCommentChange={handleCommentChange}
          handleAddComment={handleAddComment}
          handleLoadMoreComments={handleLoadMoreComments}
          openDeletePostModal={openDeletePostModal}
          handleLoadMorePosts={handleLoadMorePosts}
        />
      </Stack>
    </GroupPageLayout>
  );
};

export default NewGroupPage;
