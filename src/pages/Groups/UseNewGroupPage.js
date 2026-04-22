import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useSneakerMember } from "../../context/MemberContext";
import {
  GET_GROUP,
  GET_POSTS_BY_GROUP,
  JOIN_GROUP,
  LEAVE_GROUP,
  CREATE_POST,
  LIKE_POST,
  ADD_COMMENT,
  DELETE_POST,
} from "./graphql";

export const useNewGroupPage = () => {
  const { id } = useParams();
  const groupId = id;
  const skip = !groupId;

  const { member: currentUser, loading: currentUserLoading } =
    useSneakerMember();

  const pendingCommentPostIdRef = useRef(null);
  const fileInputRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [joinLeaveError, setJoinLeaveError] = useState("");
  const [likeError, setLikeError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [postContent, setPostContent] = useState("");
  const [imageSrcs, setImageSrcs] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [postError, setPostError] = useState("");

  const [commentInputs, setCommentInputs] = useState({});
  const [commentErrors, setCommentErrors] = useState({});

  const [likingPostId, setLikingPostId] = useState(null);
  const [commentLoadingByPost, setCommentLoadingByPost] = useState({});
  const [deletingPostId, setDeletingPostId] = useState(null);

  const { data, loading, error } = useQuery(GET_GROUP, {
    variables: { id: groupId },
    skip,
  });

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useQuery(GET_POSTS_BY_GROUP, {
    variables: { groupId },
    skip,
  });

  const group = data?.getGroup;
  const posts = postsData?.getPostsByGroup || [];

  const isJoined = useMemo(() => {
    if (!currentUser?.id || !group?.members) return false;
    return group.members.some((m) => m.id === currentUser.id);
  }, [group, currentUser]);

  const refetchPostQueries = [
    { query: GET_POSTS_BY_GROUP, variables: { groupId } },
  ];

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

  const [createPost, { loading: posting }] = useMutation(CREATE_POST, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      imageSrcs.forEach((url) => URL.revokeObjectURL(url));
      setPostContent("");
      setImageSrcs([]);
      setImageFiles([]);
      setPostError("");
    },
    onError: (err) => setPostError(err.message),
  });

  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setLikeError("");
      setLikingPostId(null);
    },
    onError: (err) => {
      setLikeError(err.message);
      setLikingPostId(null);
    },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onError: (err) => {
      if (pendingCommentPostIdRef.current) {
        const failedPostId = pendingCommentPostIdRef.current;

        setCommentErrors((prev) => ({
          ...prev,
          [failedPostId]: err.message,
        }));

        setCommentLoadingByPost((prev) => ({
          ...prev,
          [failedPostId]: false,
        }));
      }
    },
  });

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: refetchPostQueries,
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

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    imageSrcs.forEach((url) => URL.revokeObjectURL(url));

    const urls = files.map((file) => URL.createObjectURL(file));
    setImageSrcs(urls);
    setImageFiles(files);
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

  const handleLikePost = async (postId) => {
    if (!isJoined || likingPostId === postId) return;

    setLikeError("");
    setLikingPostId(postId);

    try {
      await likePost({ variables: { postId } });
    } catch {}
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));

    setCommentErrors((prev) => ({
      ...prev,
      [postId]: "",
    }));
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

    setCommentLoadingByPost((prev) => ({
      ...prev,
      [postId]: true,
    }));

    try {
      await addComment({
        variables: { postId, content },
      });

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));

      setCommentErrors((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch {
    } finally {
      setCommentLoadingByPost((prev) => ({
        ...prev,
        [postId]: false,
      }));
      pendingCommentPostIdRef.current = null;
    }
  };

  const memberCount = group?.members?.length || 0;
  const isCreator =
    currentUser?.id && group?.createdBy
      ? group.createdBy.id === currentUser.id
      : false;

  return {
    loading,
    error,
    group,
    posts,
    postsLoading,
    postsError,
    currentUser,
    currentUserLoading,
    isJoined,
    isCreator,
    memberCount,

    modalOpen,
    setModalOpen,
    isHovering,
    setIsHovering,

    joinLeaveError,
    likeError,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteError,
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
    openDeletePostModal,
    handleDeletePost,
    handleFileInputChange,
    handlePostSubmit,
    handleLikePost,
    handleCommentChange,
    handleAddComment,
  };
};