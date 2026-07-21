import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Collapse,
  Skeleton,
} from "@mui/material";
import {
  FavoriteBorderOutlined,
  Favorite,
  ChatBubbleOutlineOutlined,
  ShareOutlined,
  DeleteOutlineOutlined,
  SendOutlined,
} from "@mui/icons-material";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useColors } from "../../theme/colors";
import {
  LIKE_POST,
  UNLIKE_POST,
  SHARE_POST,
  DELETE_POST,
  ADD_COMMENT,
  GET_POST_COMMENTS,
} from "../../context/graphql/getPosts";

const COMMENT_PAGE_SIZE = 5;

const getMemberName = (member) =>
  member?.businessName || `${member?.firstName ?? ""} ${member?.lastName ?? ""}`.trim() || "Member";

const getInitials = (member) => {
  const first = member?.firstName?.charAt(0) ?? "";
  const last = member?.lastName?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
};

const stringToColor = (str = "") => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 50%, 40%)`;
};

const Avatar = ({ member, size = 36 }) => {
  const initials = getInitials(member);
  const bg = stringToColor(`${member?.firstName}${member?.lastName}`);
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: size * 0.33,
        }}
      >
        {initials}
      </Typography>
    </Box>
  );
};

const formatRelative = (isoString) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString();
};

const PostCard = ({ post, currentMemberId, onDelete }) => {
  const colors = useColors();

  const [liked, setLiked] = useState(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [shareCount, setShareCount] = useState(post.shareCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsOffset, setCommentsOffset] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(post.commentCount);

  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const [sharePost] = useMutation(SHARE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const [addComment] = useMutation(ADD_COMMENT);
  const [fetchComments, { loading: commentsLoading }] = useLazyQuery(GET_POST_COMMENTS, {
    fetchPolicy: "network-only",
  });

  const isOwner = String(post.member?.id) === String(currentMemberId);

  const handleLike = useCallback(async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => c + (wasLiked ? -1 : 1));
    try {
      if (wasLiked) {
        await unlikePost({ variables: { postId: post.id } });
      } else {
        await likePost({ variables: { postId: post.id } });
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => c + (wasLiked ? 1 : -1));
    }
  }, [liked, post.id, likePost, unlikePost]);

  const handleShare = useCallback(async () => {
    setShareCount((c) => c + 1);
    try {
      await sharePost({ variables: { postId: post.id } });
    } catch {
      setShareCount((c) => c - 1);
    }
  }, [post.id, sharePost]);

  const handleDelete = useCallback(async () => {
    try {
      await deletePost({ variables: { postId: post.id } });
      onDelete(post.id);
    } catch {
      // silent — post stays visible if delete fails
    }
  }, [post.id, deletePost, onDelete]);

  const loadComments = useCallback(
    async (offset = 0) => {
      const { data } = await fetchComments({
        variables: { postId: post.id, limit: COMMENT_PAGE_SIZE, offset },
      });
      const result = data?.getPostComments;
      if (!result) return;
      if (offset === 0) {
        setComments(result.items);
      } else {
        setComments((prev) => [...prev, ...result.items]);
      }
      setHasMoreComments(result.hasMore);
      setCommentsOffset(offset + result.items.length);
    },
    [fetchComments, post.id]
  );

  const handleToggleComments = useCallback(async () => {
    if (!showComments && comments.length === 0) {
      await loadComments(0);
    }
    setShowComments((v) => !v);
  }, [showComments, comments.length, loadComments]);

  const handleLoadMoreComments = useCallback(async () => {
    setLoadingMore(true);
    await loadComments(commentsOffset);
    setLoadingMore(false);
  }, [commentsOffset, loadComments]);

  const handleSubmitComment = useCallback(async () => {
    const text = commentText.trim();
    if (!text) return;
    setSubmittingComment(true);
    try {
      const { data } = await addComment({
        variables: { postId: post.id, content: text },
      });
      if (data?.addComment) {
        setComments((prev) => [...prev, data.addComment]);
        setLocalCommentCount((c) => c + 1);
        setCommentText("");
      }
    } finally {
      setSubmittingComment(false);
    }
  }, [commentText, post.id, addComment]);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: colors.isDark ? "#1a1a1a" : "#f5f5f5",
        borderRadius: "20px",
        border: `1px solid ${colors.isDark ? "#2a2a2a" : "#e0e0e0"}`,
        mb: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2, pb: 1 }}>
        <Avatar member={post.member} size={40} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: colors.textPrimary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {getMemberName(post.member)}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.72rem",
              color: colors.textSecondary,
            }}
          >
            {formatRelative(post.createdAt)}
          </Typography>
        </Box>
        {isOwner && (
          <IconButton onClick={handleDelete} size="small" sx={{ color: colors.textSecondary }}>
            <DeleteOutlineOutlined fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Content */}
      {post.content && (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.9rem",
            color: colors.textPrimary,
            px: 2,
            py: 1,
            wordBreak: "break-word",
          }}
        >
          {post.content}
        </Typography>
      )}

      {/* Media */}
      {post.mediaUrls?.length > 0 && post.mediaType === "image" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: post.mediaUrls.length === 1 ? "1fr" : "1fr 1fr",
            gap: 0.5,
            mx: 2,
            mb: 1,
          }}
        >
          {post.mediaUrls.map((url, i) => (
            <Box
              key={i}
              component="img"
              src={url}
              alt=""
              sx={{
                width: "100%",
                height: post.mediaUrls.length === 1 ? { xs: 220, sm: 300 } : { xs: 140, sm: 180 },
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          ))}
        </Box>
      )}

      {post.mediaUrls?.length > 0 && post.mediaType === "video" && (
        <Box sx={{ mx: 2, mb: 1 }}>
          <Box
            component="video"
            src={post.mediaUrls[0]}
            controls
            sx={{ width: "100%", borderRadius: "10px", maxHeight: 320 }}
          />
        </Box>
      )}

      {/* Stats bar */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 2,
          pt: 0.5,
          pb: 0.5,
        }}
      >
        {likeCount > 0 && (
          <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: colors.textSecondary }}>
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </Typography>
        )}
        {localCommentCount > 0 && (
          <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: colors.textSecondary }}>
            {localCommentCount} {localCommentCount === 1 ? "comment" : "comments"}
          </Typography>
        )}
        {shareCount > 0 && (
          <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.75rem", color: colors.textSecondary }}>
            {shareCount} {shareCount === 1 ? "share" : "shares"}
          </Typography>
        )}
      </Box>

      {/* Divider */}
      <Box sx={{ height: "1px", backgroundColor: colors.isDark ? "#2a2a2a" : "#e0e0e0", mx: 2 }} />

      {/* Action buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-around", px: 1, py: 0.5 }}>
        <Button
          onClick={handleLike}
          startIcon={liked ? <Favorite sx={{ color: "#e74c3c" }} /> : <FavoriteBorderOutlined />}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.8rem",
            color: liked ? "#e74c3c" : colors.textSecondary,
            textTransform: "none",
            flex: 1,
          }}
        >
          Like
        </Button>
        <Button
          onClick={handleToggleComments}
          startIcon={<ChatBubbleOutlineOutlined />}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.8rem",
            color: colors.textSecondary,
            textTransform: "none",
            flex: 1,
          }}
        >
          Comment
        </Button>
        <Button
          onClick={handleShare}
          startIcon={<ShareOutlined />}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.8rem",
            color: colors.textSecondary,
            textTransform: "none",
            flex: 1,
          }}
        >
          Share
        </Button>
      </Box>

      {/* Comments section */}
      <Collapse in={showComments}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Box sx={{ height: "1px", backgroundColor: colors.isDark ? "#2a2a2a" : "#e0e0e0", mb: 1.5 }} />

          {/* Comment input */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmitComment()}
              multiline
              maxRows={3}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: "Montserrat, sans-serif",
                  fontSize: "0.85rem",
                  backgroundColor: colors.isDark ? "#111" : "#fff",
                },
              }}
            />
            <IconButton
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || submittingComment}
              sx={{ color: "#FFD100" }}
            >
              {submittingComment ? <CircularProgress size={20} /> : <SendOutlined />}
            </IconButton>
          </Box>

          {/* Comment list */}
          {commentsLoading && comments.length === 0 ? (
            [0, 1, 2].map((i) => (
              <Box key={i} sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="rounded" width="80%" height={36} sx={{ borderRadius: "10px" }} />
              </Box>
            ))
          ) : (
            comments.map((c) => (
              <Box key={c.id} sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <Avatar member={c.member} size={28} />
                <Box
                  sx={{
                    backgroundColor: colors.isDark ? "#111" : "#fff",
                    borderRadius: "12px",
                    px: 1.5,
                    py: 0.75,
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      color: colors.textPrimary,
                    }}
                  >
                    {getMemberName(c.member)}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.82rem",
                      color: colors.textPrimary,
                    }}
                  >
                    {c.content}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "0.68rem",
                      color: colors.textSecondary,
                      mt: 0.25,
                    }}
                  >
                    {formatRelative(c.createdAt)}
                  </Typography>
                </Box>
              </Box>
            ))
          )}

          {hasMoreComments && (
            <Button
              onClick={handleLoadMoreComments}
              disabled={loadingMore}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.78rem",
                color: colors.textSecondary,
                textTransform: "none",
              }}
            >
              {loadingMore ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
              Load more comments
            </Button>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default PostCard;
