import {
  Box,
  Typography,
  Stack,
  Divider,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { useGroupPageStyles } from "../styles/groupPageStyles";

export const StatePanel = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  const { colors, isDark, stateCardSx } = useGroupPageStyles();

  return (
    <Box sx={stateCardSx}>
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: isDark ? "#202020" : "#f2f3f5",
            color: colors.primary,
            border: `1px solid ${colors.borderSubtle}`,
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{ color: colors.textPrimary, fontWeight: 700, mb: 1 }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textSecondary,
              maxWidth: 480,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </Box>

        {(primaryAction || secondaryAction) && (
          <Stack
            direction="row"
            spacing={1.5}
            flexWrap="wrap"
            justifyContent="center"
          >
            {primaryAction}
            {secondaryAction}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export const FeedSectionHeader = ({ postCount }) => {
  const { colors, feedSectionLabelSx } = useGroupPageStyles();

  return (
    <Stack spacing={1.25}>
      <Box sx={feedSectionLabelSx}>
        <Stack spacing={0.25}>
          <Typography
            variant="overline"
            sx={{
              color: colors.primary,
              fontWeight: 800,
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            Group feed
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: colors.textSecondary,
              fontWeight: 600,
            }}
          >
            {postCount > 0
              ? `${postCount} ${postCount === 1 ? "post" : "posts"}`
              : "Recent conversations and updates"}
          </Typography>
        </Stack>

        {postCount > 0 && (
          <Typography
            variant="caption"
            sx={{
              color: colors.textSecondary,
              fontWeight: 700,
              display: { xs: "none", sm: "block" },
            }}
          >
            Newest activity first
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: colors.borderSubtle }} />
    </Stack>
  );
};

export const FeedLoadingSkeleton = () => {
  const { colors, isDark, cardSx } = useGroupPageStyles();

  const skeletonBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const skeletonBgSoft = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const skeletonBgText = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";

  return (
    <Stack spacing={2}>
      {[0, 1, 2].map((item) => (
        <Box key={item} sx={cardSx}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Skeleton
                variant="circular"
                width={44}
                height={44}
                sx={{ bgcolor: skeletonBg }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="32%"
                  height={28}
                  sx={{ bgcolor: skeletonBg }}
                />
                <Skeleton
                  variant="text"
                  width="20%"
                  height={22}
                  sx={{ bgcolor: skeletonBgSoft }}
                />
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Skeleton
                variant="text"
                width="92%"
                height={24}
                sx={{ bgcolor: skeletonBgText }}
              />
              <Skeleton
                variant="text"
                width="84%"
                height={24}
                sx={{ bgcolor: skeletonBgText }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={24}
                sx={{ bgcolor: skeletonBgText }}
              />
            </Stack>

            <Skeleton
              variant="rounded"
              height={220}
              sx={{ borderRadius: 2.5, bgcolor: skeletonBgSoft }}
            />

            <Divider sx={{ borderColor: colors.borderSubtle }} />

            <Stack direction="row" spacing={1.25}>
              <Skeleton
                variant="rounded"
                width={96}
                height={36}
                sx={{ borderRadius: "999px", bgcolor: skeletonBgSoft }}
              />
              <Skeleton
                variant="rounded"
                width={112}
                height={36}
                sx={{ borderRadius: "999px", bgcolor: skeletonBgSoft }}
              />
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export const PageLoadingState = () => {
  const { colors, pageContainerSx, stateCardSx } = useGroupPageStyles();

  return (
    <Box
      sx={{ ...pageContainerSx, display: "grid", placeItems: "center", px: 2 }}
    >
      <Box sx={{ ...stateCardSx, width: "min(560px, 100%)" }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress sx={{ color: colors.primary }} />
          <Typography
            variant="h6"
            sx={{ color: colors.textPrimary, fontWeight: 700 }}
          >
            Loading group
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            Fetching group details, members, and recent activity.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};
