import { useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_COMMENT,
  DELETE_POST,
  GET_POSTS_BY_GROUP,
  LIKE_POST,
} from "../graphql";

const POSTS_PAGE_SIZE = 10;
const INITIAL_COMMENT_PAGE_SIZE = 3;
const COMMENT_PAGE_SIZE = 5;

export const useGroupFeed = ({ groupId, skip, isJoined }) => {
  const pendingCommentPostIdRef = useRef(null);

  const [likeErrors, setLikeErrors] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [likingPostId, setLikingPostId] = useState(null);
  const [commentLoadingByPost, setCommentLoadingByPost] = useState({});
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [loadingMoreCommentsByPost, setLoadingMoreCommentsByPost] = useState({});

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    fetchMore,
    refetch: refetchPosts,
  } = useQuery(GET_POSTS_BY_GROUP, {
    variables: {
      groupId,
      limit: POSTS_PAGE_SIZE,
      offset: 0,
      commentLimit: INITIAL_COMMENT_PAGE_SIZE,
    },
    skip,
    notifyOnNetworkStatusChange: true,
  });

  const postsPage = postsData?.getPostsByGroup;
  const posts = postsPage?.items || [];
  const hasMorePosts = !!postsPage?.hasMore;

  const baseFeedVariables = {
    groupId,
    limit: POSTS_PAGE_SIZE,
    offset: 0,
    commentLimit: INITIAL_COMMENT_PAGE_SIZE,
  };

  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_POSTS_BY_GROUP, variables: baseFeedVariables }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      if (likingPostId) {
        setLikeErrors((prev) => ({ ...prev, [likingPostId]: "" }));
        setLikingPostId(null);
      }
    },
    onError: (err) => {
      if (likingPostId) {
        setLikeErrors((prev) => ({ ...prev, [likingPostId]: err.message }));
        setLikingPostId(null);
      }
    },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_POSTS_BY_GROUP, variables: baseFeedVariables }],
    awaitRefetchQueries: true,
    onError: (err) => {
      if (pendingCommentPostIdRef.current) {
        const failedPostId = pendingCommentPostIdRef.current;
        setCommentErrors((prev) => ({ ...prev, [failedPostId]: err.message }));
        setCommentLoadingByPost((prev) => ({ ...prev, [failedPostId]: false }));
      }
    },
  });

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_POSTS_BY_GROUP, variables: baseFeedVariables }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setDeleteModalOpen(false);
      setPostToDelete(null);
      setDeleteError("");
      setDeletingPostId(null);
    },
    onError: (err) => {
      setDeleteError(err.message);
      setDeletingPostId(null);
    },
  });

  const openDeletePostModal = (post) => {
    setPostToDelete(post);
    setDeleteError("");
    setDeleteModalOpen(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete?.id || deletingPostId === postToDelete.id) return;

    setDeleteError("");
    setDeletingPostId(postToDelete.id);

    try {
      await deletePost({ variables: { postId: postToDelete.id } });
    } catch {}
  };

  const handleLikePost = async (postId) => {
    if (!isJoined || likingPostId === postId) return;

    setLikeErrors((prev) => ({ ...prev, [postId]: "" }));
    setLikingPostId(postId);

    try {
      await likePost({ variables: { postId } });
    } catch {}
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
    setCommentErrors((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleAddComment = async (postId) => {
    if (!isJoined || commentLoadingByPost[postId]) return;

    const content = commentInputs[postId]?.trim();
    if (!content) {
      setCommentErrors((prev) => ({
        ...prev,
        [postId]: "Comment cannot be empty.",
      }));
      return;
    }

    pendingCommentPostIdRef.current = postId;
    setCommentLoadingByPost((prev) => ({ ...prev, [postId]: true }));

    try {
      await addComment({ variables: { postId, content } });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setCommentErrors((prev) => ({ ...prev, [postId]: "" }));
    } catch {
    } finally {
      setCommentLoadingByPost((prev) => ({ ...prev, [postId]: false }));
      pendingCommentPostIdRef.current = null;
    }
  };

  const handleLoadMorePosts = async () => {
    if (!hasMorePosts || loadingMorePosts) return;

    setLoadingMorePosts(true);
    try {
      await fetchMore({
        variables: {
          groupId,
          limit: POSTS_PAGE_SIZE,
          offset: posts.length,
          commentLimit: INITIAL_COMMENT_PAGE_SIZE,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult?.getPostsByGroup) return previousResult;

          const previousPage = previousResult?.getPostsByGroup;
          const nextPage = fetchMoreResult.getPostsByGroup;

          return {
            getPostsByGroup: {
              ...nextPage,
              items: [...(previousPage?.items || []), ...(nextPage.items || [])],
            },
          };
        },
      });
    } finally {
      setLoadingMorePosts(false);
    }
  };

  const handleLoadMoreComments = async (postId) => {
    const post = posts.find((item) => item.id === postId);
    const nextOffset = post?.commentsPage?.nextOffset;

    if (!nextOffset || loadingMoreCommentsByPost[postId]) return;

    setLoadingMoreCommentsByPost((prev) => ({ ...prev, [postId]: true }));

    try {
      await fetchMore({
        variables: {
          groupId,
          limit: Math.max(posts.length, POSTS_PAGE_SIZE),
          offset: 0,
          commentLimit: nextOffset + COMMENT_PAGE_SIZE,
        },
        updateQuery: (previousResult, { fetchMoreResult }) =>
          fetchMoreResult || previousResult,
      });
    } finally {
      setLoadingMoreCommentsByPost((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return {
    posts,
    postsLoading,
    postsError,
    hasMorePosts,
    loadingMorePosts,
    loadingMoreCommentsByPost,
    likeErrors,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteError,
    setDeleteError,
    postToDelete,
    commentInputs,
    commentErrors,
    likingPostId,
    commentLoadingByPost,
    deletingPostId,
    openDeletePostModal,
    handleDeletePost,
    handleLikePost,
    handleCommentChange,
    handleAddComment,
    handleLoadMorePosts,
    handleLoadMoreComments,
    refetchPosts,
  };
};