import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { ExploreOutlined } from "@mui/icons-material";
import { useColors } from "../../theme/colors";

// Layout shell for the Discover tab.
// Data fetching (GraphQL accounts, follow/unfollow) is wired up in follow-up tickets.

const AccountCardSkeleton = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      p: 2,
      borderRadius: "16px",
      backgroundColor: "#D9D9D9",
      mb: 2,
    }}
  >
    <Skeleton variant="circular" width={48} height={48} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="70%" height={16} />
    </Box>
    <Skeleton variant="rounded" width={80} height={34} sx={{ borderRadius: "20px" }} />
  </Box>
);

const DiscoverFeed = () => {
  const colors = useColors();

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          fontSize: { xs: "1.3rem", sm: "1.6rem" },
          color: colors.textPrimary,
          mb: 1,
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

      {/* Skeleton placeholders — replaced by real data in the GraphQL fetch ticket */}
      {[...Array(4)].map((_, i) => (
        <AccountCardSkeleton key={i} />
      ))}

      {/* Empty state icon — visible once real data loads and returns empty */}
      <Box
        sx={{
          display: "none", // toggled on when data is empty
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          gap: 2,
        }}
        id="discover-empty-state"
      >
        <ExploreOutlined sx={{ fontSize: 64, color: colors.textSecondary, opacity: 0.5 }} />
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            color: colors.textSecondary,
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          No accounts to discover yet. Check back soon!
        </Typography>
      </Box>
    </Box>
  );
};

export default DiscoverFeed;
