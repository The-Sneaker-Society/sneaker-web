import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useSneakerMember } from "../../../context/MemberContext";
import {
  ADD_COMMENT,
  CREATE_POST,
  DELETE_GROUP,
  DELETE_POST,
  GET_GROUP,
  GET_POSTS_BY_GROUP,
  JOIN_GROUP,
  LEAVE_GROUP,
  LIKE_POST,
  UPDATE_GROUP,
} from "../graphql";

const POSTS_PAGE_SIZE = 10;
const INITIAL_COMMENT_PAGE_SIZE = 3;
const COMMENT_PAGE_SIZE = 5;

const useGroupMembership = ({ groupId, currentUser, skip }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [joinLeaveError, setJoinLeaveError] = useState("");

  const {
    data,
    loading,
    error,
    refetch: refetchGroup,
  } = useQuery(GET_GROUP, {
    variables: { id: groupId },
    skip,
  });

  const group = data?.getGroup;

  const isJoined = useMemo(() => {
    if (!currentUser?.id || !group?.members) return false;
    return group.members.some((member) => member.id === currentUser.id);
  }, [group, currentUser]);

  const isCreator = useMemo(() => {
    if (!currentUser?.id || !group?.createdBy?.id) return false;
    return group.createdBy.id === currentUser.id;
  }, [group, currentUser]);

  const isGroupAdmin = useMemo(() => {
    if (!currentUser?.id || !group?.admins) return false;
    return group.admins.some((admin) => admin.id === currentUser.id);
  }, [group, currentUser]);

  const canManageGroup = isCreator || isGroupAdmin;
  const memberCount = group?.members?.length || 0;
  const adminCount = group?.admins?.length || 0;
  const adminIds = useMemo(
    () => new Set((group?.admins || []).map((admin) => admin.id)),
    [group],
  );

  const [joinGroup, { loading: joining }] = useMutation(JOIN_GROUP, {
    refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onCompleted: () => setJoinLeaveError(""),
    onError: (err) => setJoinLeaveError(err.message),
  });

  const [leaveGroup, { loading: leaving }] = useMutation(LEAVE_GROUP, {
    refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onCompleted: () => setJoinLeaveError(""),
    onError: (err) => setJoinLeaveError(err.message),
  });

  const handleJoinGroup = () => {
    if (!groupId) return;
    setJoinLeaveError("");
    joinGroup({ variables: { groupId } });
  };

  const handleLeaveGroup = () => {
    if (!groupId) return;
    setJoinLeaveError("");
    setModalOpen(false);
    leaveGroup({ variables: { groupId } });
  };

  return {
    loading,
    error,
    group,
    isJoined,
    isCreator,
    isGroupAdmin,
    canManageGroup,
    memberCount,
    adminCount,
    adminIds,
    modalOpen,
    setModalOpen,
    isHovering,
    setIsHovering,
    joinLeaveError,
    joining,
    leaving,
    handleJoinGroup,
    handleLeaveGroup,
    refetchGroup,
  };
};

const MAX_IMAGES_PER_POST = 4;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const useGroupComposer = ({ groupId }) => {
  const fileInputRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const [imageSrcs, setImageSrcs] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [postError, setPostError] = useState("");

  useEffect(() => {
    return () => {
      imageSrcs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageSrcs]);

  const [createPost, { loading: posting }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_POSTS_BY_GROUP,
        variables: {
          groupId,
          limit: POSTS_PAGE_SIZE,
          offset: 0,
          commentLimit: INITIAL_COMMENT_PAGE_SIZE,
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      imageSrcs.forEach((url) => URL.revokeObjectURL(url));
      setPostContent("");
      setImageSrcs([]);
      setImageFiles([]);
      setPostError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (err) => setPostError(err.message),
  });

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const invalidTypeFiles = files.filter(
      (file) => !file.type.startsWith("image/"),
    );
    const imageOnlyFiles = files.filter((file) =>
      file.type.startsWith("image/"),
    );
    const oversizedFiles = imageOnlyFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE_BYTES,
    );
    const validFiles = imageOnlyFiles.filter(
      (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
    );

    const nextFiles = validFiles.slice(0, MAX_IMAGES_PER_POST);
    const errors = [];

    if (invalidTypeFiles.length > 0) {
      errors.push("Only image files can be uploaded.");
    }

    if (files.length > MAX_IMAGES_PER_POST) {
      errors.push(
        `You can upload up to ${MAX_IMAGES_PER_POST} images per post.`,
      );
    }

    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles.map((file) => file.name).join(", ");
      errors.push(
        `Each image must be ${MAX_IMAGE_SIZE_MB}MB or smaller. Too large: ${oversizedNames}.`,
      );
    }

    imageSrcs.forEach((url) => URL.revokeObjectURL(url));

    const urls = nextFiles.map((file) => URL.createObjectURL(file));
    setImageSrcs(urls);
    setImageFiles(nextFiles);
    setPostError(errors.join(" "));

    if (fileInputRef.current && nextFiles.length === 0) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageSrcs((prev) => {
      const next = [...prev];
      const [removedUrl] = next.splice(indexToRemove, 1);
      if (removedUrl) {
        URL.revokeObjectURL(removedUrl);
      }
      return next;
    });

    setImageFiles((prev) => {
      const next = prev.filter((_, index) => index !== indexToRemove);
      if (fileInputRef.current && next.length === 0) {
        fileInputRef.current.value = "";
      }
      return next;
    });
  };

  const handlePostSubmit = () => {
    if (!postContent.trim()) {
      setPostError("Post content cannot be empty.");
      return;
    }

    if (!groupId) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    Promise.all(imageFiles.map(toBase64)).then((base64Images) => {
      createPost({
        variables: {
          groupId,
          content: postContent.trim(),
          images: base64Images,
        },
      });
    });
  };

  return {
    fileInputRef,
    postContent,
    setPostContent,
    imageSrcs,
    postError,
    posting,
    handleFileInputChange,
    handleRemoveImage,
    handlePostSubmit,
  };
};

const useGroupFeed = ({ groupId, skip, isJoined }) => {
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

const useGroupManagement = ({ groupId, group, skip }) => {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editGroupError, setEditGroupError] = useState("");
  const [deleteGroupError, setDeleteGroupError] = useState("");

  useEffect(() => {
    if (!editModalOpen || !group) return;
    setEditName(group.name || "");
    setEditDescription(group.description || "");
    setEditAvatar(group.avatar || "");
  }, [editModalOpen, group]);

  const [updateGroup, { loading: updatingGroup }] = useMutation(UPDATE_GROUP, {
    refetchQueries: skip
      ? []
      : [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setEditGroupError("");
      setEditModalOpen(false);
    },
    onError: (err) => setEditGroupError(err.message),
  });

  const [deleteGroup, { loading: deletingGroup }] = useMutation(DELETE_GROUP, {
    onCompleted: () => {
      setDeleteGroupError("");
      setDeleteGroupModalOpen(false);
      navigate("/groups");
    },
    onError: (err) => setDeleteGroupError(err.message),
  });

  const openEditGroupModal = () => {
    if (!group) return;
    setEditName(group.name || "");
    setEditDescription(group.description || "");
    setEditAvatar(group.avatar || "");
    setEditGroupError("");
    setEditModalOpen(true);
  };

  const handleUpdateGroup = async (event) => {
    event?.preventDefault?.();

    if (!groupId) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setEditGroupError("Group name cannot be empty.");
      return;
    }

    setEditGroupError("");

    try {
      await updateGroup({
        variables: {
          id: groupId,
          name: trimmedName,
          description: editDescription.trim(),
          avatar: editAvatar.trim(),
        },
      });
    } catch {}
  };

  const openDeleteGroupModal = () => {
    setDeleteGroupError("");
    setDeleteGroupModalOpen(true);
  };

  const handleDeleteGroup = async () => {
    if (!groupId) return;
    setDeleteGroupError("");

    try {
      await deleteGroup({ variables: { id: groupId } });
    } catch {}
  };

  return {
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
  };
};

export const useNewGroupPage = () => {
  const { id } = useParams();
  const groupId = id;
  const skip = !groupId;

  const { member: currentUser, loading: currentUserLoading } =
    useSneakerMember();

  const membership = useGroupMembership({
    groupId,
    currentUser,
    skip,
  });

  const composer = useGroupComposer({
    groupId,
  });

  const feed = useGroupFeed({
    groupId,
    skip,
    isJoined: membership.isJoined,
  });

  const management = useGroupManagement({
    groupId,
    group: membership.group,
    skip,
  });

  return {
    currentUser,
    currentUserLoading,
    ...membership,
    ...composer,
    ...feed,
    ...management,
  };
};
