import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import { DynamicFeedOutlined } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import { useColors } from "../../theme/colors";
import { useSneakerMember } from "../../context/MemberContext";
import { GET_MY_SOCIETY_FEED } from "../../context/graphql/getPosts";
import PostCard from "./PostCard";
import PostComposer from "./PostComposer";

const PAGE_SIZE = 10;

const PostCardSkeleton = ({ colors }) => (
  <Box
    sx={{
      backgroundColor: colors.isDark ? "#1a1a1a" : "#f5f5f5",
      borderRadius: "20px",
      border: `1px solid ${colors.isDark ? "#2a2a2a" : "#e0e0e0"}`,
      p: 2,
      mb: 3,
    }}
  >
    <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="40%" height={18} />
        <Skeleton variant="text" width="25%" height={14} />
      </Box>
    </Box>
    <Skeleton variant="text" width="90%" height={16} />
    <Skeleton variant="text" width="75%" height={16} />
    <Skeleton variant="rounded" width="100%" height={180} sx={{ mt: 1, borderRadius: "10px" }} />
  </Box>
);

const MySocietyFeed = () => {
  const colors = useColors();
  const { member: currentMember } = useSneakerMember();
  const sentinelRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);

  const { loading, error, fetchMore, refetch } = useQuery(GET_MY_SOCIETY_FEED, {
    variables: { limit: PAGE_SIZE, offset: 0 },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const page = data?.getMySocietyFeed;
      if (!page) return;
      setPosts(page.items);
      setHasMore(page.hasMore);
      setNextOffset(page.nextOffset);
    },
  });

  // IntersectionObserver triggers next page load
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting || nextOffset === null) return;
        const { data } = await fetchMore({
          variables: { limit: PAGE_SIZE, offset: nextOffset },
        });
        const page = data?.getMySocietyFeed;
        if (!page) return;
        setPosts((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...page.items.filter((p) => !ids.has(p.id))];
        });
        setHasMore(page.hasMore);
        setNextOffset(page.nextOffset);
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, nextOffset, fetchMore]);

  const handlePostCreated = useCallback((newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const handlePostDeleted = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
          color: colors.textPrimary,
          mb: 0.5,
        }}
      >
        My Society
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "0.9rem",
          color: colors.textSecondary,
          mb: 3,
        }}
      >
        Posts from members you follow.
      </Typography>

      {/* Post composer */}
      <PostComposer
        currentMember={currentMember}
        onPostCreated={handlePostCreated}
      />

      {/* Error state */}
      {error && (
        <Alert
          severity="error"
          action={
            <Typography
              onClick={() => refetch()}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.8rem",
                cursor: "pointer",
                textDecoration: "underline",
                color: "inherit",
              }}
            >
              Retry
            </Typography>
          }
          sx={{ mb: 3 }}
        >
          Failed to load posts. Please try again.
        </Alert>
      )}

      {/* Initial loading skeletons */}
      {loading &&
        posts.length === 0 &&
        [0, 1, 2].map((i) => <PostCardSkeleton key={i} colors={colors} />)}

      {/* Post list */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentMemberId={currentMember?.id}
          onDelete={handlePostDeleted}
        />
      ))}

      {/* Empty state */}
      {!loading && !error && posts.length === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            gap: 2,
          }}
        >
          <DynamicFeedOutlined
            sx={{ fontSize: 64, color: colors.textSecondary, opacity: 0.4 }}
          />
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: colors.textSecondary,
              fontSize: "1rem",
              textAlign: "center",
              maxWidth: 300,
            }}
          >
            No posts yet. Follow some members or create the first post!
          </Typography>
        </Box>
      )}

      {/* Infinite scroll sentinel */}
      {!loading && !error && hasMore && (
        <Box
          ref={sentinelRef}
          sx={{ display: "flex", justifyContent: "center", py: 3 }}
        >
          <CircularProgress size={28} sx={{ color: "#FFD100" }} />
        </Box>
      )}

      {/* End of feed */}
      {!loading && !error && !hasMore && posts.length > PAGE_SIZE && (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.8rem",
            color: colors.textSecondary,
            textAlign: "center",
            py: 3,
            opacity: 0.6,
          }}
        >
          You're all caught up!
        </Typography>
      )}
    </Box>
  );
};

export default MySocietyFeed;
