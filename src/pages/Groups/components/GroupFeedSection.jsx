import { Box, Button, CircularProgress, Stack } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import PostCard from "../PostCard";
import { FeedLoadingSkeleton, StatePanel } from "./GroupPageStates";
import { secondaryButtonSx, primaryButtonSx } from "../styles/groupPageStyles";

const GroupFeedSection = ({
  posts,
  postsLoading,
  postsError,
  isJoined,
  isCreator,
  joining,
  currentUser,
  group,
  likingPostId,
  deletingPostId,
  commentLoadingByPost,
  commentInputs,
  commentErrors,
  likeErrors,
  loadingMoreCommentsByPost,
  hasMorePosts,
  loadingMorePosts,
  refetchPosts,
  handleJoinGroup,
  handleLikePost,
  handleCommentChange,
  handleAddComment,
  handleLoadMoreComments,
  openDeletePostModal,
  handleLoadMorePosts,
}) => {
  if (postsLoading && posts.length === 0) {
    return <FeedLoadingSkeleton />;
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

export default GroupFeedSection;
