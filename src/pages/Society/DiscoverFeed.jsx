import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Skeleton,
  Snackbar,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { ExploreOutlined, RefreshOutlined } from "@mui/icons-material";
import { useQuery, useMutation } from "@apollo/client";
import { useColors } from "../../theme/colors";
import {
  GET_DISCOVER_MEMBERS,
  FOLLOW_MEMBER,
  UNFOLLOW_MEMBER,
} from "../../context/graphql/getMembers";
import AccountCard from "./AccountCard";

const PAGE_SIZE = 10;

const AccountCardSkeleton = ({ colors }) => (
  <Box
    sx={{
      p: { xs: 2, sm: 2.5 },
      borderRadius: "16px",
      backgroundColor: colors.isDark ? "#1a1a1a" : "#f0f0f0",
      border: `1px solid ${colors.isDark ? "#2a2a2a" : "#e0e0e0"}`,
      mb: 2,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Skeleton variant="circular" width={52} height={52} sx={{ flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="45%" height={20} />
        <Skeleton variant="text" width="60%" height={16} sx={{ mt: 0.5 }} />
      </Box>
      <Skeleton variant="rounded" width={80} height={34} sx={{ borderRadius: "20px", flexShrink: 0 }} />
    </Box>
    <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
      <Skeleton variant="rounded" width={72} height={24} sx={{ borderRadius: "12px" }} />
      <Skeleton variant="rounded" width={56} height={24} sx={{ borderRadius: "12px" }} />
    </Box>
  </Box>
);

const ErrorState = ({ colors, onRetry }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 2 }}>
    <Box sx={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: colors.isDark ? "#2a1010" : "#fdecea", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <RefreshOutlined sx={{ fontSize: 32, color: "#e74c3c" }} />
    </Box>
    <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "1rem", color: colors.textPrimary, textAlign: "center" }}>
      Couldn't load accounts
    </Typography>
    <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: colors.textSecondary, textAlign: "center", maxWidth: 280 }}>
      Something went wrong fetching the community. Check your connection and try again.
    </Typography>
    <Button onClick={onRetry} startIcon={<RefreshOutlined />} sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.85rem", textTransform: "none", borderRadius: "20px", px: 3, mt: 1, backgroundColor: "#FFD100", color: "#000", "&:hover": { backgroundColor: "#E6BC00" } }}>
      Try again
    </Button>
  </Box>
);

const EmptyState = ({ colors }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, gap: 2 }}>
    <Box sx={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: colors.isDark ? "#1a1a1a" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ExploreOutlined sx={{ fontSize: 40, color: "#FFD100" }} />
    </Box>
    <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: colors.textPrimary, textAlign: "center" }}>
      You've discovered everyone for now
    </Typography>
    <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.85rem", color: colors.textSecondary, textAlign: "center", maxWidth: 300, lineHeight: 1.6 }}>
      New members join the Sneaker Society community all the time. Check back soon to find more people to follow.
    </Typography>
  </Box>
);

const DiscoverFeed = () => {
  const colors = useColors();

  // Accumulated accounts across all loaded pages
  const [allAccounts, setAllAccounts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextOffset, setNextOffset] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [following, setFollowing] = useState({});
  const [pendingIds, setPendingIds] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const sentinelRef = useRef(null);

  const { loading, error, fetchMore, refetch } = useQuery(GET_DISCOVER_MEMBERS, {
    variables: { limit: PAGE_SIZE, offset: 0 },
    onCompleted: (data) => {
      const page = data?.getDiscoverMembers;
      if (!page) return;
      setAllAccounts(page.items);
      setHasMore(page.hasMore);
      setNextOffset(page.nextOffset);
    },
  });

  const [followMember] = useMutation(FOLLOW_MEMBER);
  const [unfollowMember] = useMutation(UNFOLLOW_MEMBER);

  // IntersectionObserver — fires fetchMore when sentinel enters viewport
  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isFetchingMore) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries[0].isIntersecting) return;
        setIsFetchingMore(true);
        try {
          const result = await fetchMore({
            variables: { limit: PAGE_SIZE, offset: nextOffset },
          });
          const page = result.data?.getDiscoverMembers;
          if (!page) return;
          setAllAccounts((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const fresh = page.items.filter((m) => !existingIds.has(m.id));
            return [...prev, ...fresh];
          });
          setHasMore(page.hasMore);
          setNextOffset(page.nextOffset);
        } catch {
          // fetchMore error — leave list as-is, user can scroll up and back
        } finally {
          setIsFetchingMore(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, nextOffset, fetchMore]);

  const handleFollow = useCallback(
    async (memberId) => {
      const currentlyFollowing = !!following[memberId];
      setFollowing((prev) => ({ ...prev, [memberId]: !currentlyFollowing }));
      setPendingIds((prev) => ({ ...prev, [memberId]: true }));
      try {
        if (currentlyFollowing) {
          await unfollowMember({ variables: { memberId } });
        } else {
          await followMember({ variables: { memberId } });
        }
      } catch {
        setFollowing((prev) => ({ ...prev, [memberId]: currentlyFollowing }));
        setSnackbar({
          open: true,
          message: currentlyFollowing
            ? "Failed to unfollow. Please try again."
            : "Failed to follow. Please try again.",
        });
      } finally {
        setPendingIds((prev) => ({ ...prev, [memberId]: false }));
      }
    },
    [following, followMember, unfollowMember]
  );

  const handleRetry = () => {
    setAllAccounts([]);
    setHasMore(false);
    setNextOffset(null);
    refetch({ limit: PAGE_SIZE, offset: 0 });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: { xs: "1.3rem", sm: "1.6rem" }, color: colors.textPrimary, mb: 0.5 }}>
        Recommended Accounts
      </Typography>
      <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: colors.textSecondary, mb: 3 }}>
        Discover members and creators in the Sneaker Society community.
      </Typography>

      {/* Initial loading skeletons */}
      {loading && [...Array(5)].map((_, i) => <AccountCardSkeleton key={i} colors={colors} />)}

      {/* Error state */}
      {!loading && error && <ErrorState colors={colors} onRetry={handleRetry} />}

      {/* Account cards */}
      {!loading && !error && allAccounts.map((member) => (
        <AccountCard
          key={member.id}
          member={member}
          isFollowing={!!following[member.id]}
          isPending={!!pendingIds[member.id]}
          onFollow={handleFollow}
        />
      ))}

      {/* Empty state */}
      {!loading && !error && allAccounts.length === 0 && <EmptyState colors={colors} />}

      {/* Infinite scroll sentinel */}
      {!loading && !error && hasMore && (
        <Box ref={sentinelRef} sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} sx={{ color: "#FFD100" }} />
        </Box>
      )}

      {/* End-of-list */}
      {!loading && !error && !hasMore && allAccounts.length > PAGE_SIZE && (
        <Typography sx={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.8rem", color: colors.textSecondary, textAlign: "center", py: 3, opacity: 0.6 }}>
          You've seen all {allAccounts.length} members
        </Typography>
      )}

      {/* Follow/unfollow error snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ open: false, message: "" })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ open: false, message: "" })} severity="error" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscoverFeed;
