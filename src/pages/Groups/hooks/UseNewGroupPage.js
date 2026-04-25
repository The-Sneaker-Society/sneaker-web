import { useState, useRef, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useSneakerMember } from "../../context/MemberContext";
import {
  GET_GROUP,
  GET_POSTS_BY_GROUP,
  JOIN_GROUP,
  LEAVE_GROUP,
  UPDATE_GROUP,
  DELETE_GROUP,
  CREATE_POST,
  UPDATE_POST,
  LIKE_POST,
  ADD_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  DELETE_POST,
} from "../graphql";

export const useNewGroupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const groupId = id;
  const skip = !groupId;
  const { member: currentUser, loading: currentUserLoading } =
    useSneakerMember();
  const pendingCommentPostIdRef = useRef(null);
  const fileInputRef = useRef(null);
  const editAvatarInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [joinLeaveError, setJoinLeaveError] = useState("");
  const [likeErrors, setLikeErrors] = useState({});
  const [actionToast, setActionToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [groupActionError, setGroupActionError] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDescription, setEditGroupDescription] = useState("");
  const [editGroupAvatar, setEditGroupAvatar] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [imageSrcs, setImageSrcs] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [postError, setPostError] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [commentErrors, setCommentErrors] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostContent, setEditingPostContent] = useState("");
  const [editingPostImages, setEditingPostImages] = useState([]);
  const [editingPostImageFiles, setEditingPostImageFiles] = useState([]);
  const [editPostError, setEditPostError] = useState("");
  const [editingCommentIdByPost, setEditingCommentIdByPost] = useState({});
  const [editingCommentContentById, setEditingCommentContentById] = useState(
    {},
  );
  const [commentActionErrors, setCommentActionErrors] = useState({});
  const [likingPostId, setLikingPostId] = useState(null);
  const [commentLoadingByPost, setCommentLoadingByPost] = useState({});
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [savingPostId, setSavingPostId] = useState(null);
  const [savingCommentId, setSavingCommentId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const showToast = (message, severity = "success") =>
    setActionToast({ open: true, message, severity });
  const closeToast = () => setActionToast((prev) => ({ ...prev, open: false }));
  const {
    data,
    loading,
    error,
    refetch: refetchGroup,
  } = useQuery(GET_GROUP, { variables: { id: groupId }, skip });
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery(GET_POSTS_BY_GROUP, { variables: { groupId }, skip });
  const group = data?.getGroup;
  const posts = postsData?.getPostsByGroup || [];
  useEffect(() => {
    if (!group) return;
    setEditGroupName(group.name || "");
    setEditGroupDescription(group.description || "");
    setEditGroupAvatar(group.avatar || null);
  }, [group]);
  const isJoined = useMemo(() => {
    if (!currentUser?.id || !group?.members) return false;
    return group.members.some((m) => m.id === currentUser.id);
  }, [group, currentUser]);
  const isCreator =
    currentUser?.id && group?.createdBy
      ? group.createdBy.id === currentUser.id
      : false;
  const isAdmin = useMemo(() => {
    if (!currentUser?.id || !group?.admins) return false;
    return group.admins.some((admin) => admin.id === currentUser.id);
  }, [group, currentUser]);
  const canManageGroup = isCreator || isAdmin;
  const memberCount = group?.members?.length || 0;
  const adminIds = useMemo(
    () => new Set((group?.admins || []).map((admin) => admin.id)),
    [group],
  );
  const refetchGroupQueries = [
    { query: GET_GROUP, variables: { id: groupId } },
  ];
  const refetchPostQueries = [
    { query: GET_POSTS_BY_GROUP, variables: { groupId } },
  ];
  const [joinGroup, { loading: joining }] = useMutation(JOIN_GROUP, {
    refetchQueries: refetchGroupQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setJoinLeaveError("");
      showToast("You joined the group.");
    },
    onError: (err) => setJoinLeaveError(err.message),
  });
  const [leaveGroup, { loading: leaving }] = useMutation(LEAVE_GROUP, {
    refetchQueries: refetchGroupQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setJoinLeaveError("");
      showToast("You left the group.");
    },
    onError: (err) => setJoinLeaveError(err.message),
  });
  const [updateGroup, { loading: updatingGroup }] = useMutation(UPDATE_GROUP, {
    refetchQueries: refetchGroupQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setGroupActionError("");
      setEditGroupModalOpen(false);
      showToast("Group details updated.");
    },
    onError: (err) => setGroupActionError(err.message),
  });
  const [deleteGroup, { loading: deletingGroup }] = useMutation(DELETE_GROUP, {
    onCompleted: () => {
      setGroupActionError("");
      setDeleteGroupModalOpen(false);
      navigate("/member/groups");
    },
    onError: (err) => setGroupActionError(err.message),
  });
  const [createPost, { loading: posting }] = useMutation(CREATE_POST, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setPostContent("");
      setImageSrcs([]);
      setImageFiles([]);
      setPostError("");
      showToast("Post published.");
    },
    onError: (err) => setPostError(err.message),
  });
  const [updatePost] = useMutation(UPDATE_POST, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setEditingPostId(null);
      setEditingPostContent("");
      setEditingPostImages([]);
      setEditingPostImageFiles([]);
      setEditPostError("");
      setSavingPostId(null);
      showToast("Post updated.");
    },
    onError: (err) => {
      setEditPostError(err.message);
      setSavingPostId(null);
    },
  });
  const [likePost] = useMutation(LIKE_POST, {
    refetchQueries: refetchPostQueries,
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
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: () => showToast("Comment added."),
    onError: (err) => {
      if (pendingCommentPostIdRef.current) {
        const failedPostId = pendingCommentPostIdRef.current;
        setCommentErrors((prev) => ({ ...prev, [failedPostId]: err.message }));
        setCommentLoadingByPost((prev) => ({ ...prev, [failedPostId]: false }));
      }
    },
  });
  const [updateComment] = useMutation(UPDATE_COMMENT, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: (_, { variables }) => {
      const { postId, commentId } = variables;
      setEditingCommentIdByPost((prev) => ({ ...prev, [postId]: null }));
      setEditingCommentContentById((prev) => ({ ...prev, [commentId]: "" }));
      setCommentActionErrors((prev) => ({ ...prev, [commentId]: "" }));
      setSavingCommentId(null);
      showToast("Comment updated.");
    },
    onError: (err, { variables }) => {
      setCommentActionErrors((prev) => ({
        ...prev,
        [variables.commentId]: err.message,
      }));
      setSavingCommentId(null);
    },
  });
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setDeletingCommentId(null);
      showToast("Comment deleted.");
    },
    onError: (err, { variables }) => {
      setCommentActionErrors((prev) => ({
        ...prev,
        [variables.commentId]: err.message,
      }));
      setDeletingCommentId(null);
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
      showToast("Post deleted.");
    },
    onError: (err) => {
      setDeleteError(err.message);
      setDeletingPostId(null);
    },
  });
  const handleRetryGroupLoad = () => {
    if (!groupId) return;
    refetchGroup({ id: groupId });
  };
  const handleRetryPostsLoad = () => {
    if (!groupId) return;
    refetchPosts({ groupId });
  };
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
  const openEditGroupModal = () => {
    if (!group) return;
    setGroupActionError("");
    setEditGroupName(group.name || "");
    setEditGroupDescription(group.description || "");
    setEditGroupAvatar(group.avatar || null);
    setEditGroupModalOpen(true);
  };
  const openDeleteGroupModal = () => {
    setGroupActionError("");
    setDeleteGroupModalOpen(true);
  };
  const handleEditGroupAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditGroupAvatar(reader.result);
    reader.readAsDataURL(file);
  };
  const handleUpdateGroup = async () => {
    if (!groupId) return;
    if (!editGroupName.trim()) {
      setGroupActionError("Group name cannot be empty.");
      return;
    }
    setGroupActionError("");
    try {
      await updateGroup({
        variables: {
          id: groupId,
          name: editGroupName.trim(),
          description: editGroupDescription.trim(),
          avatar: editGroupAvatar,
          memberIds: (group?.members || []).map((member) => member.id),
        },
      });
    } catch {}
  };
  const handleDeleteGroup = async () => {
    if (!groupId) return;
    setGroupActionError("");
    try {
      await deleteGroup({ variables: { id: groupId } });
    } catch {}
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
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageSrcs(urls);
    setImageFiles(files);
  };
  const handleRemoveComposerImage = (index) => {
    setImageSrcs((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index),
    );
    setImageFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
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
    isAdmin,
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
    editingPostId,
    editingPostContent,
    setEditingPostContent,
    editingPostImages,
    editPostError,
    editingCommentIdByPost,
    editingCommentContentById,
    commentActionErrors,
    joining,
    leaving,
    posting,
    updatingGroup,
    deletingGroup,
    likingPostId,
    commentLoadingByPost,
    deletingPostId,
    savingPostId,
    savingCommentId,
    deletingCommentId,
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
    openDeletePostModal,
  };
};
