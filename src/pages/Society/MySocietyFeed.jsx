import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useColors } from "../../theme/colors";

// Placeholder posts — will be replaced by real GraphQL data in a follow-up ticket
const PLACEHOLDER_POSTS = [
  {
    id: 1,
    username: "Username",
    caption: "Just got some new kicks to customize! Can't wait to show the after!",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
    ],
    likes: 20,
    comments: 10,
    shares: 11,
  },
  {
    id: 2,
    username: "Username",
    caption: "Just got some new kicks to customize! Can't wait to show the after!",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop",
    ],
    likes: 20,
    comments: 10,
    shares: 11,
  },
];

const PostCard = ({ post, onLike, onComment, onShare }) => {
  const colors = useColors();

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#D9D9D9",
        borderRadius: { xs: "20px", sm: "28px" },
        padding: { xs: 2, sm: 3 },
        mb: { xs: 3, sm: 4 },
      }}
    >
      {/* User info */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: { xs: 32, sm: 40 },
            height: { xs: 32, sm: 40 },
            backgroundColor: "#000",
            borderRadius: "50%",
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            fontSize: { xs: "14px", sm: "15px" },
            color: "#000",
          }}
        >
          {post.username}
        </Typography>
      </Box>

      {/* Caption */}
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: { xs: "14px", sm: "15px" },
          color: "#000",
          mb: 3,
          wordWrap: "break-word",
        }}
      >
        {post.caption}
      </Typography>

      {/* Images */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "center" }}>
        {post.images.map((src, i) => (
          <Box
            key={i}
            component="img"
            src={src}
            alt={`Post image ${i + 1}`}
            sx={{
              width: "45%",
              height: { xs: "120px", sm: "150px" },
              objectFit: "cover",
              borderRadius: "10px",
              border: "2px solid #e0e0e0",
            }}
          />
        ))}
      </Box>

      {/* Stats */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
        {[`${post.likes} likes`, `${post.comments} comments`, `${post.shares} shares`].map((stat) => (
          <Typography
            key={stat}
            sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "12px", color: "#000" }}
          >
            {stat}
          </Typography>
        ))}
      </Box>

      <Box sx={{ height: "2px", backgroundColor: "#000", mb: 2 }} />

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        {[
          { label: "Like", handler: () => onLike(post.id) },
          { label: "Comment", handler: () => onComment(post.id) },
          { label: "Share", handler: () => onShare(post.id) },
        ].map(({ label, handler }) => (
          <Button
            key={label}
            onClick={handler}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: { xs: "14px", sm: "15px" },
              color: "#000",
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.08)" },
            }}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

const MySocietyFeed = () => {
  const [posts, setPosts] = useState(PLACEHOLDER_POSTS);

  const handleLike = (postId) =>
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );

  const handleComment = (postId) => console.log("Comment on post:", postId);
  const handleShare = (postId) => console.log("Share post:", postId);

  const handleCreatePost = () => console.log("Create new post");

  return (
    <>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
          color: "#fff",
          mb: 3,
        }}
      >
        My Posts
      </Typography>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      ))}

      {/* Create Post FAB */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 20, sm: 32 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Button
          onClick={handleCreatePost}
          sx={{
            backgroundColor: "#FFD100",
            borderRadius: "30px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 800,
            fontSize: { xs: "15px", sm: "17px" },
            color: "#000",
            textTransform: "none",
            px: { xs: 3, sm: 4 },
            py: 1.5,
            boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
            "&:hover": { backgroundColor: "#E6BC00" },
          }}
        >
          Create Post
        </Button>
      </Box>
    </>
  );
};

export default MySocietyFeed;
