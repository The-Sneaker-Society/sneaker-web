import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";
import { useGroupPageStyles } from "../styles/groupPageStyles";

const GroupComposerCard = ({
  postContent,
  setPostContent,
  postError,
  imageSrcs,
  fileInputRef,
  handleFileInputChange,
  handleRemoveImage,
  handlePostSubmit,
  posting,
}) => {
  const { colors, isDark, cardSx, filledUtilityButtonSx, primaryButtonSx } =
    useGroupPageStyles();

  const composerFieldSx = {
    "& .MuiInputBase-root": {
      bgcolor: isDark ? "#0d0e10" : "#f5f5f7",
      color: colors.textPrimary,
      borderRadius: 2.5,
    },
    "& .MuiInputBase-input::placeholder": {
      color: colors.textSecondary,
      opacity: 1,
    },
    "& fieldset": {
      borderColor: colors.borderSubtle,
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
      borderColor: colors.primary,
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: colors.primary,
    },
  };

  return (
    <Box sx={cardSx}>
      <Stack spacing={2}>
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ color: colors.textPrimary, fontWeight: 800, mb: 0.5 }}
          >
            Create a post
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
          >
            Share an update, ask a question, or post a few photos with the
            group.
          </Typography>
        </Box>

        <TextField
          fullWidth
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Share something with the group..."
          multiline
          minRows={3}
          sx={composerFieldSx}
        />

        {postError && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: -0.5,
              color: colors.status.error,
              fontWeight: 600,
            }}
          >
            {postError}
          </Typography>
        )}

        {imageSrcs.length > 0 && (
          <Stack
            direction="row"
            spacing={1.25}
            sx={{ flexWrap: "wrap" }}
            useFlexGap
          >
            {imageSrcs.map((src, i) => (
              <Box
                key={`${src}-${i}`}
                sx={{
                  position: "relative",
                  width: 92,
                  height: 92,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: `1px solid ${colors.borderSubtle}`,
                  bgcolor: isDark ? "#0d0e10" : "#f5f5f7",
                }}
              >
                <Box
                  component="img"
                  src={src}
                  alt={`Selected upload ${i + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <Button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  aria-label={`Remove selected image ${i + 1}`}
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    minWidth: 0,
                    width: 26,
                    height: 26,
                    p: 0,
                    borderRadius: "50%",
                    bgcolor: isDark
                      ? "rgba(17,17,17,0.78)"
                      : "rgba(255,255,255,0.92)",
                    color: colors.textPrimary,
                    border: `1px solid ${colors.borderSubtle}`,
                    "&:hover": {
                      bgcolor: colors.status.error,
                      color: "#fff",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </Button>
              </Box>
            ))}
          </Stack>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileInputChange}
        />

        <Box
          sx={{
            mt: 0.5,
            pt: 1.75,
            borderTop: `1px solid ${colors.borderSubtle}`,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={1.5}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 0.9, sm: 1.5 }}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <Button
                variant="contained"
                startIcon={<InsertPhotoIcon />}
                onClick={() => fileInputRef.current?.click()}
                sx={filledUtilityButtonSx}
              >
                Add photos
              </Button>

              <Typography
                variant="caption"
                sx={{
                  color: colors.textSecondary,
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                }}
              >
                Up to 4 images, 5MB each
              </Typography>
            </Stack>

            <Button
              variant="contained"
              onClick={handlePostSubmit}
              disabled={posting}
              sx={{
                ...primaryButtonSx,
                alignSelf: { xs: "stretch", sm: "auto" },
                minWidth: { sm: 116 },
              }}
            >
              {posting ? (
                <CircularProgress
                  size={18}
                  sx={{ color: colors.textInverse }}
                />
              ) : (
                "Post to group"
              )}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default GroupComposerCard;
