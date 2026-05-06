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
import {
  FeedSectionHeader,
  PageLoadingState,
  StatePanel,
} from "./components/GroupPageStates";
import { pageContainerSx, primaryButtonSx } from "./styles/groupPageStyles";

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
    openDeleteGroupModal,
    handleUpdateGroup,
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

        <GroupPageModals
          editModalOpen={editModalOpen}
          setEditModalOpen={setEditModalOpen}
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
          <Typography variant="caption" color="error.main">
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
          isCreator={isCreator}
          joining={joining}
          currentUser={currentUser}
          group={group}
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
