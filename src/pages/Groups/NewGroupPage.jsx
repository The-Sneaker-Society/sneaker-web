import { useState, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  TextField,
  Modal,
  Stack,
  AvatarGroup,
  CircularProgress,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useSneakerMember } from "../../context/MemberContext";

const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      name
      description
      avatar
      members {
        id
        firstName
        lastName
        email
      }
      createdBy {
        id
      }
      admins {
        id
      }
      createdAt
    }
  }
`;

const GET_POSTS_BY_GROUP = gql`
  query GetPostsByGroup($groupId: ID!) {
    getPostsByGroup(groupId: $groupId) {
      id
      content
      images
      shares
      createdAt
      author {
        id
        firstName
        lastName
        email
      }
      likes {
        id
      }
      comments {
        id
        content
        createdAt
        author {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

const JOIN_GROUP = gql`
  mutation JoinGroup($groupId: ID!) {
    joinGroup(groupId: $groupId) {
      id
      members {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const LEAVE_GROUP = gql`
  mutation LeaveGroup($groupId: ID!) {
    leaveGroup(groupId: $groupId) {
      id
      members {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($groupId: ID!, $content: String!, $images: [String!]) {
    createPost(groupId: $groupId, content: $content, images: $images) {
      id
      content
      images
      shares
      createdAt
      author {
        id
        firstName
        lastName
        email
      }
      likes {
        id
      }
      comments {
        id
        content
        createdAt
        author {
          id
          firstName
          lastName
          email
        }
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $content: String!) {
    addComment(postId: ID!, content: $content) {
      id
      content
      createdAt
      author {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const NewGroupPage = () => {
  const { id } = useParams();
  const groupId = id;
  const skip = !groupId;

  const { member: currentUser, loading: currentUserLoading } =
    useSneakerMember();

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

  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [postContent, setPostContent] = useState("");
  const [imageSrcs, setImageSrcs] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [postError, setPostError] = useState("");

  const [commentInputs, setCommentInputs] = useState({});
  const [commentError, setCommentError] = useState("");

  const fileInputRef = useRef(null);

  const refetchPostQueries = [
    { query: GET_POSTS_BY_GROUP, variables: { groupId } },
  ];

  const [joinGroup, { loading: joining }] = useMutation(JOIN_GROUP, {
    refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onError: (err) => console.error("Join error:", err.message),
  });

  const [leaveGroup, { loading: leaving }] = useMutation(LEAVE_GROUP, {
    refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onError: (err) => console.error("Leave error:", err.message),
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

  const [likePost, { loading: likingPost }] = useMutation(LIKE_POST, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onError: (err) => console.error("Like error:", err.message),
  });

  const [addComment, { loading: addingComment }] = useMutation(ADD_COMMENT, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onError: (err) => setCommentError(err.message),
  });

  const [deletePost, { loading: deletingPost }] = useMutation(DELETE_POST, {
    refetchQueries: refetchPostQueries,
    awaitRefetchQueries: true,
    onCompleted: () => {
      setDeleteModalOpen(false);
      setPostToDelete(null);
      setDeleteError("");
    },
    onError: (err) => setDeleteError(err.message),
  });

  const handleJoinGroup = () => {
    if (!groupId) return;
    joinGroup({ variables: { groupId } });
  };

  const handleLeaveGroup = () => {
    if (!groupId) return;
    setModalOpen(false);
    leaveGroup({ variables: { groupId } });
  };

  const openDeletePostModal = (post) => {
    setPostToDelete(post);
    setDeleteError("");
    setDeleteModalOpen(true);
  };

  const handleDeletePost = () => {
    if (!postToDelete?.id) return;
    deletePost({ variables: { postId: postToDelete.id } });
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

  const handleLikePost = (postId) => {
    likePost({ variables: { postId } });
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
    setCommentError("");
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId]?.trim();

    if (!content) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    await addComment({
      variables: {
        postId,
        content,
      },
    });

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: "",
    }));
  };

  if (loading || currentUserLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress sx={{ color: "#FFD100" }} />
      </Box>
    );
  }

  if (error || !group) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Unable to load group.</Typography>
      </Box>
    );
  }

  const memberCount = group.members?.length || 0;
  const isCreator =
    currentUser?.id && group.createdBy
      ? group.createdBy.id === currentUser.id
      : false;

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", px: 2, py: 4 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ color: "#FFD100", mb: 0.5 }}
      >
        {group.name}
      </Typography>

      <Typography variant="body2" sx={{ color: "#aaa", mb: 1 }}>
        {memberCount} {memberCount === 1 ? "member" : "members"}
      </Typography>

      {group.description && (
        <Typography variant="body2" sx={{ color: "#bbb", mb: 2 }}>
          {group.description}
        </Typography>
      )}

      <AvatarGroup max={6} sx={{ justifyContent: "flex-start", mb: 2 }}>
        {(group.members || []).map((member) => (
          <Avatar
            key={member.id}
            sx={{ bgcolor: "#333", color: "#FFD100", width: 36, height: 36 }}
          >
            {member.firstName?.[0] ?? member.email?.[0] ?? "?"}
          </Avatar>
        ))}
      </AvatarGroup>

      {!isCreator && (
        <>
          {isJoined ? (
            <Button
              variant="outlined"
              onClick={() => setModalOpen(true)}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={leaving}
              sx={{
                mb: 2,
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 700,
                color: isHovering ? "#ff6b6b" : "#FFD100",
                borderColor: isHovering ? "#ff6b6b" : "#FFD100",
                "&:hover": {
                  bgcolor: "rgba(255,107,107,0.08)",
                  borderColor: "#ff6b6b",
                },
              }}
            >
              {leaving ? (
                <CircularProgress size={16} sx={{ color: "#FFD100" }} />
              ) : isHovering ? (
                "Leave Group"
              ) : (
                "Joined ✓"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleJoinGroup}
              disabled={joining}
              sx={{
                mb: 2,
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "#FFD100",
                color: "#000",
                "&:hover": { bgcolor: "#ffde33" },
              }}
            >
              {joining ? (
                <CircularProgress size={16} sx={{ color: "#000" }} />
              ) : (
                "Join Group"
              )}
            </Button>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#1a1a1a",
            borderRadius: 2,
            p: 4,
            width: 320,
          }}
        >
          <Typography sx={{ color: "#fff", mb: 2 }}>
            Are you sure you want to leave this group?
          </Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={handleLeaveGroup}
            sx={{
              bgcolor: "#ff6b6b",
              color: "#fff",
              mb: 1,
              "&:hover": { bgcolor: "#e05555" },
            }}
          >
            Yes, leave group
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => setModalOpen(false)}
            sx={{ color: "#aaa", borderColor: "#444" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#1a1a1a",
            borderRadius: 2,
            p: 4,
            width: 340,
          }}
        >
          <Typography sx={{ color: "#fff", mb: 2, fontWeight: 700 }}>
            Delete post?
          </Typography>

          <Typography sx={{ color: "#aaa", mb: 2, fontSize: 14 }}>
            This action cannot be undone.
          </Typography>

          {deleteError && (
            <Typography
              variant="caption"
              sx={{ color: "#ff6b6b", display: "block", mb: 1.5 }}
            >
              {deleteError}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleDeletePost}
            disabled={deletingPost}
            sx={{
              bgcolor: "#ff6b6b",
              color: "#fff",
              mb: 1,
              "&:hover": { bgcolor: "#e05555" },
              "&:disabled": { bgcolor: "#555", color: "#999" },
            }}
          >
            {deletingPost ? "Deleting..." : "Delete Post"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => setDeleteModalOpen(false)}
            sx={{ color: "#aaa", borderColor: "#444" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <Divider sx={{ borderColor: "#333", mb: 3 }} />

      {isJoined && (
        <Box sx={{ bgcolor: "#111", borderRadius: 2, p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Write something to the group..."
            value={postContent}
            onChange={(e) => {
              setPostContent(e.target.value);
              setPostError("");
            }}
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
            <Typography
              variant="caption"
              sx={{ color: "#ff6b6b", display: "block", mb: 1 }}
            >
              {postError}
            </Typography>
          )}

          {imageSrcs.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1, flexWrap: "wrap" }}
            >
              {imageSrcs.map((src, i) => (
                <Box
                  key={i}
                  component="img"
                  src={src}
                  alt={`preview-${i}`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid #333",
                  }}
                />
              ))}
            </Stack>
          )}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
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
              sx={{
                textTransform: "none",
                color: "#aaa",
                "&:hover": { color: "#FFD100" },
              }}
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
                "&:disabled": { bgcolor: "#555", color: "#888" },
              }}
            >
              {posting ? (
                <CircularProgress size={16} sx={{ color: "#000" }} />
              ) : (
                "Post"
              )}
            </Button>
          </Stack>
        </Box>
      )}

      {postsLoading ? (
        <Typography sx={{ color: "#999", textAlign: "center", mt: 3 }}>
          Loading posts...
        </Typography>
      ) : postsError ? (
        <Typography sx={{ color: "error.main", textAlign: "center", mt: 3 }}>
          Failed to load posts.
        </Typography>
      ) : posts.length === 0 ? (
        <Typography sx={{ color: "#999", textAlign: "center", mt: 3 }}>
          No posts yet
        </Typography>
      ) : (
        posts.map((post) => {
          const authorName =
            `${post.author?.firstName || ""} ${
              post.author?.lastName || ""
            }`.trim() ||
            post.author?.email ||
            "Unknown user";

          const likeCount = post.likes?.length || 0;
          const commentCount = post.comments?.length || 0;
          const shareCount = post.shares || 0;
          const hasLiked = !!post.likes?.some(
            (like) => like.id === currentUser?.id,
          );

          const isPostAuthor = post.author?.id === currentUser?.id;
          const isGroupCreator = group.createdBy?.id === currentUser?.id;
          const isGroupAdmin = !!group.admins?.some(
            (admin) => admin.id === currentUser?.id,
          );
          const canDeletePost =
            isPostAuthor || isGroupCreator || isGroupAdmin;

          return (
            <Box
              key={post.id}
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "#111",
                border: "1px solid #2a2a2a",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                  {authorName}
                </Typography>

                {canDeletePost && (
                  <Button
                    size="small"
                    onClick={() => openDeletePostModal(post)}
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      textTransform: "none",
                      minWidth: "auto",
                      p: 0,
                      color: "#ff6b6b",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#ff8a8a",
                      },
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Stack>

              <Typography
                sx={{ color: "#ddd", mb: post.images?.length ? 2 : 0 }}
              >
                {post.content}
              </Typography>

              {post.images && post.images.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {post.images.map((img, i) => (
                    <Box
                      key={i}
                      component="img"
                      src={img}
                      alt={`post-${post.id}-image-${i + 1}`}
                      sx={{
                        width: 110,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 1,
                        mt: 1,
                      }}
                    />
                  ))}
                </Stack>
              )}

              <Typography sx={{ color: "#777", fontSize: 12, mt: 1.5 }}>
                {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 1.5, mb: 1 }}>
                <Button
                  size="small"
                  onClick={() => handleLikePost(post.id)}
                  disabled={likingPost}
                  startIcon={
                    hasLiked ? (
                      <FavoriteIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                    )
                  }
                  sx={{
                    textTransform: "none",
                    color: hasLiked ? "#FFD100" : "#aaa",
                    minWidth: "auto",
                    p: 0,
                  }}
                >
                  {hasLiked ? "Liked" : "Like"} · {likeCount}
                </Button>

                <Typography
                  sx={{
                    color: "#aaa",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
                  {commentCount}
                </Typography>

                <Typography sx={{ color: "#aaa", fontSize: 14 }}>
                  Shares · {shareCount}
                </Typography>
              </Stack>

              {post.comments?.length > 0 && (
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {post.comments.map((comment) => {
                    const commentAuthor =
                      `${comment.author?.firstName || ""} ${
                        comment.author?.lastName || ""
                      }`.trim() ||
                      comment.author?.email ||
                      "Unknown user";

                    return (
                      <Box
                        key={comment.id}
                        sx={{
                          bgcolor: "#1a1a1a",
                          borderRadius: 1,
                          px: 1.5,
                          py: 1,
                        }}
                      >
                        <Typography
                          sx={{ color: "#fff", fontSize: 13, fontWeight: 700 }}
                        >
                          {commentAuthor}
                        </Typography>
                        <Typography sx={{ color: "#ccc", fontSize: 13 }}>
                          {comment.content}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              )}

              {isJoined && (
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: "#000",
                        color: "#fff",
                      },
                      "& fieldset": { borderColor: "#333" },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleAddComment(post.id)}
                    disabled={
                      addingComment || !(commentInputs[post.id] || "").trim()
                    }
                    sx={{
                      textTransform: "none",
                      bgcolor: "#FFD100",
                      color: "#000",
                      "&:hover": { bgcolor: "#ffde33" },
                      "&:disabled": { bgcolor: "#555", color: "#888" },
                    }}
                  >
                    Comment
                  </Button>
                </Stack>
              )}
            </Box>
          );
        })
      )}

      {commentError && (
        <Typography
          variant="caption"
          sx={{
            color: "#ff6b6b",
            display: "block",
            mt: 2,
            textAlign: "center",
          }}
        >
          {commentError}
        </Typography>
      )}
    </Box>
  );
};

export default NewGroupPage;