import React, { useState, useCallback, useEffect, useRef } from "react";
import { Box, Typography, Skeleton, Alert, Snackbar, CircularProgress } from "@mui/material";
import { ExploreOutlined } from "@mui/icons-material";
import { useQuery, useMutation } from "@apollo/client";
import { useColors } from "../../theme/colors";
import { useSneakerMember } from "../../context/MemberContext";
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
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: { xs: 2, sm: 2.5 },
      borderRadius: "16px",
      backgroundColor: colors.isDark ? "#1a1a1a" : "#f0f0f0",
      border: `1px solid ${colors.isDark ? "#2a2a2a" : "#e0e0e0"}`,
      mb: 2,
    }}
  >
    <Skeleton variant="circular" width={52} height={52} sx={{ flexShrink: 0 }} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="45%" height={20} />
      <Skeleton variant="text" width="65%" height={16} sx={{ mt: 0.5 }} />
    </Box>
    <Skeleton variant="rounded" width={76} height={34} sx={{ borderRadius: "20px", flexShrink: 0 }} />
  </Box>
);

const DiscoverFeed = () => {
  const colors = useColors();
  const { member: currentMember } = useSneakerMember();

  // How many accounts are currently visible
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Optimistic follow state keyed by memberId
  const [following, setFollowing] = useState({});
  // Track which member IDs have an in-flight mutation
  const [pendingIds, setPendingIds] = useState({});
  // Error snackbar for follow/unfollow failures
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Sentinel ref for IntersectionObserver
  const sentinelRef = useRef(null);

  const { data, loading, error } = useQuery(GET_DISCOVER_MEMBERS);

  const [followMember] = useMutation(FOLLOW_MEMBER);
  const [unfollowMember] = useMutation(UNFOLLOW_MEMBER);

  // Filter out the current logged-in member
  const allAccounts = (data?.members || []).filter(
    (m) => m.id !== currentMember?.id
  );

  const visibleAccounts = allAccounts.slice(0, visibleCount);
  const hasMore = visibleCount < allAccounts.length;

  // IntersectionObserver — load next page when sentinel enters viewport
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, visibleAccounts.length]);

  const handleFollow = useCallback(
    async (memberId) => {
      const currentlyFollowing = !!following[memberId];

      // Optimistic update — flip state immediately
      setFollowing((prev) => ({ ...prev, [memberId]: !currentlyFollowing }));
      setPendingIds((prev) => ({ ...prev, [memberId]: true }));

      try {
        if (currentlyFollowing) {
          await unfollowMember({ variables: { memberId } });
        } else {
          await followMember({ variables: { memberId } });
        }
      } catch {
        // Revert optimistic update on failure
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
        Recommended Accounts
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "0.9rem",
          color: colors.textSecondary,
          mb: 3,
        }}
      >
        Discover members and creators in the Sneaker Society community.
      </Typography>

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load accounts. Please refresh and try again.
        </Alert>
      )}

      {/* Initial loading skeletons */}
      {loading &&
        [...Array(5)].map((_, i) => (
          <AccountCardSkeleton key={i} colors={colors} />
        ))}

      {/* Account cards */}
      {!loading &&
        !error &&
        visibleAccounts.map((member) => (
          <AccountCard
            key={member.id}
            member={member}
            isFollowing={!!following[member.id]}
            isPending={!!pendingIds[member.id]}
            onFollow={handleFollow}
          />
        ))}

      {/* Empty state */}
      {!loading && !error && allAccounts.length === 0 && (
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
          <ExploreOutlined
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
            No accounts to discover yet. Check back soon!
          </Typography>
        </Box>
      )}

      {/* Infinite scroll sentinel — triggers next page load */}
      {!loading && !error && hasMore && (
        <Box
          ref={sentinelRef}
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 3,
          }}
        >
          <CircularProgress size={28} sx={{ color: "#FFD100" }} />
        </Box>
      )}

      {/* End-of-list indicator */}
      {!loading && !error && !hasMore && allAccounts.length > PAGE_SIZE && (
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
          You've seen all {allAccounts.length} members
        </Typography>
      )}

      {/* Error snackbar for follow/unfollow failures */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: "" })}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscoverFeed;
