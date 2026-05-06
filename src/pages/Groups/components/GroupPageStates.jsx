import {
  Box,
  Typography,
  Stack,
  Divider,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  cardSx,
  stateCardSx,
  pageContainerSx,
  feedSectionLabelSx,
} from "../styles/groupPageStyles";

export const StatePanel = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}) => (
  <Box sx={stateCardSx}>
    <Stack spacing={2} alignItems="center">
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "#202020",
          color: "#FFD100",
          border: "1px solid #2a2a2a",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#aaa", maxWidth: 480, mx: "auto", lineHeight: 1.6 }}
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

export const FeedSectionHeader = ({ postCount }) => (
  <Stack spacing={1.25}>
    <Box sx={feedSectionLabelSx}>
      <Stack spacing={0.25}>
        <Typography
          variant="overline"
          sx={{
            color: "#FFD100",
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
            color: "#9ea3ab",
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
            color: "#7f848c",
            fontWeight: 700,
            display: { xs: "none", sm: "block" },
          }}
        >
          Newest activity first
        </Typography>
      )}
    </Box>

    <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
  </Stack>
);

export const FeedLoadingSkeleton = () => (
  <Stack spacing={2}>
    {[0, 1, 2].map((item) => (
      <Box key={item} sx={cardSx}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Skeleton
              variant="circular"
              width={44}
              height={44}
              sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                width="32%"
                height={28}
                sx={{ bgcolor: "rgba(255,255,255,0.08)" }}
              />
              <Skeleton
                variant="text"
                width="20%"
                height={22}
                sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
              />
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Skeleton
              variant="text"
              width="92%"
              height={24}
              sx={{ bgcolor: "rgba(255,255,255,0.07)" }}
            />
            <Skeleton
              variant="text"
              width="84%"
              height={24}
              sx={{ bgcolor: "rgba(255,255,255,0.07)" }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={24}
              sx={{ bgcolor: "rgba(255,255,255,0.07)" }}
            />
          </Stack>

          <Skeleton
            variant="rounded"
            height={220}
            sx={{ borderRadius: 2.5, bgcolor: "rgba(255,255,255,0.06)" }}
          />

          <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

          <Stack direction="row" spacing={1.25}>
            <Skeleton
              variant="rounded"
              width={96}
              height={36}
              sx={{ borderRadius: "999px", bgcolor: "rgba(255,255,255,0.06)" }}
            />
            <Skeleton
              variant="rounded"
              width={112}
              height={36}
              sx={{ borderRadius: "999px", bgcolor: "rgba(255,255,255,0.06)" }}
            />
          </Stack>
        </Stack>
      </Box>
    ))}
  </Stack>
);

export const PageLoadingState = () => (
  <Box
    sx={{ ...pageContainerSx, display: "grid", placeItems: "center", px: 2 }}
  >
    <Box sx={{ ...stateCardSx, width: "min(560px, 100%)" }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress sx={{ color: "#FFD100" }} />
        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
          Loading group
        </Typography>
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          Fetching group details, members, and recent activity.
        </Typography>
      </Stack>
    </Box>
  </Box>
);
