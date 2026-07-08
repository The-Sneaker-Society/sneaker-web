import {
  Modal,
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useGroupPageStyles } from "../styles/groupPageStyles";

const EditPostModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  error,
  content,
  setContent,
}) => {
  const { colors, modalCardSx, secondaryButtonSx, primaryButtonSx } =
    useGroupPageStyles();

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="edit-post-title"
      aria-describedby="edit-post-description"
    >
      <Box
        sx={{
          ...modalCardSx,
          width: "min(560px, calc(100vw - 32px))",
          mt: { xs: "10vh", sm: "14vh" },
        }}
      >
        <Stack spacing={2}>
          <Typography
            id="edit-post-title"
            variant="h6"
            sx={{ fontWeight: 800, color: colors.textPrimary }}
          >
            Edit post
          </Typography>

          <Typography
            id="edit-post-description"
            variant="body2"
            sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
          >
            Update your post content and save your changes.
          </Typography>

          <TextField
            multiline
            minRows={5}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Update your post..."
            sx={{
              "& .MuiInputBase-root": {
                color: colors.textPrimary,
                bgcolor: colors.inputBg || colors.widgetBg,
                borderRadius: 2,
              },
            }}
          />

          {error && (
            <Typography variant="caption" sx={{ color: colors.status.error }}>
              {error}
            </Typography>
          )}

          <Stack
            direction={{ xs: "column-reverse", sm: "row" }}
            spacing={1.5}
            justifyContent="flex-end"
          >
            <Button variant="outlined" onClick={onClose} sx={secondaryButtonSx}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={onConfirm}
              disabled={loading}
              sx={primaryButtonSx}
            >
              {loading ? (
                <CircularProgress
                  size={18}
                  sx={{ color: colors.textInverse }}
                />
              ) : (
                "Save changes"
              )}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditPostModal;
