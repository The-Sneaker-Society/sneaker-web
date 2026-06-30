import { useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_COMMENT,
  DELETE_POST,
  GET_POSTS_BY_GROUP,
  LIKE_POST,
  UPDATE_POST,
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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editError, setEditError] = useState("");

  const [commentInputs, setCommentInputs] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [likingPostId, setLikingPostId] = useState(null);
  const [commentLoadingByPost, setCommentLoadingByPost] = useState({});
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [updatingPostId, setUpdatingPostId] = useState(null);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [loadingMoreCommentsByPost, setLoadingMoreCommentsByPost] = useState(
    {},
  );

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
    refetchQueries: [
      { query: GET_POSTS_BY_GROUP, variables: baseFeedVariables },
    ],
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
    refetchQueries: [
      { query: GET_POSTS_BY_GROUP, variables: baseFeedVariables },
    ],
    awaitRefetchQueries: true,
    onError: (err) => {
      if (pendingCommentPostIdRef.current) {
        const failedPostId = pendingCommentPostIdRef.current;
        setCommentErrors((prev) => ({ ...prev, [failedPostId]: err.message }));
        setCommentLoadingByPost((prev) => ({
          ...prev,
          [failedPostId]: false,
        }));
      }
    },
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    refetchQueries: [
      { query: GET_POSTS_BY_GROUP, variables: baseFeedVariables },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setEditModalOpen(false);
      setPostToEdit(null);
      setEditContent("");
      setEditImages([]);
      setEditError("");
      setUpdatingPostId(null);
    },
    onError: (err) => {
      setEditError(err.message);
      setUpdatingPostId(null);
    },
  });

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [
      { query: GET_POSTS_BY_GROUP, variables: baseFeedVariables },
    ],
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

  const openEditPostModal = (post) => {
    setPostToEdit(post);
    setEditContent(post?.content || "");
    setEditImages(Array.isArray(post?.images) ? post.images : []);
    setEditError("");
    setEditModalOpen(true);
  };

  const closeEditPostModal = () => {
    if (updatingPostId) return;
    setEditModalOpen(false);
    setPostToEdit(null);
    setEditContent("");
    setEditImages([]);
    setEditError("");
  };

  const handleUpdatePost = async () => {
    if (!postToEdit?.id || updatingPostId === postToEdit.id) return;

    const trimmedContent = editContent.trim();
    if (!trimmedContent) {
      setEditError("Post content is required.");
      return;
    }

    setEditError("");
    setUpdatingPostId(postToEdit.id);

    try {
      await updatePost({
        variables: {
          postId: postToEdit.id,
          content: trimmedContent,
          images: editImages,
        },
      });
    } catch {}
  };

  const openDeletePostModal = (post) => {
    setPostToDelete(post);
    setDeleteError("");
    setDeleteModalOpen(true);
  };

  const closeDeletePostModal = () => {
    if (deletingPostId) return;
    setDeleteModalOpen(false);
    setPostToDelete(null);
    setDeleteError("");
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
              items: [
                ...(previousPage?.items || []),
                ...(nextPage.items || []),
              ],
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

    if (nextOffset == null || loadingMoreCommentsByPost[postId]) return;

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
    editModalOpen,
    setEditModalOpen,
    postToEdit,
    editContent,
    setEditContent,
    editImages,
    setEditImages,
    editError,
    setEditError,
    commentInputs,
    commentErrors,
    likingPostId,
    commentLoadingByPost,
    deletingPostId,
    updatingPostId,
    openEditPostModal,
    closeEditPostModal,
    handleUpdatePost,
    openDeletePostModal,
    closeDeletePostModal,
    handleDeletePost,
    handleLikePost,
    handleCommentChange,
    handleAddComment,
    handleLoadMorePosts,
    handleLoadMoreComments,
    refetchPosts,
  };
};
