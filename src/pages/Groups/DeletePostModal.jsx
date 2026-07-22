import {
  Modal,
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import { useGroupPageStyles } from "../Groups/styles/groupPageStyles";

const DeletePostModal = ({ open, onClose, onConfirm, loading, error }) => {
  const { colors, modalCardSx, secondaryButtonSx, destructiveButtonSx } =
    useGroupPageStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-post-title"
      aria-describedby="delete-post-description"
    >
      <Box
        sx={{
          ...modalCardSx,
          width: "min(420px, calc(100vw - 32px))",
          mt: { xs: "12vh", sm: "18vh" },
        }}
      >
        <Stack spacing={2}>
          <Typography
            id="delete-post-title"
            variant="h6"
            sx={{ fontWeight: 800, color: colors.textPrimary }}
          >
            Delete this post?
          </Typography>

          <Typography
            id="delete-post-description"
            variant="body2"
            sx={{ color: colors.textSecondary, lineHeight: 1.6 }}
          >
            This action cannot be undone. The post and its conversation will be
            removed from the group.
          </Typography>

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
              sx={destructiveButtonSx}
            >
              {loading ? (
                <CircularProgress
                  size={18}
                  sx={{ color: colors.textInverse }}
                />
              ) : (
                "Delete Post"
              )}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeletePostModal;
