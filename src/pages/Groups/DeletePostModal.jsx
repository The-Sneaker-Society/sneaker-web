import { Modal, Box, Typography, Stack, Button, CircularProgress } from "@mui/material";

const secondaryButtonSx = {
  color: "#c2c6cc",
  borderColor: "rgba(255,255,255,0.14)",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  px: 2,
  minHeight: 44,
  "&:hover": {
    borderColor: "rgba(255,209,0,0.35)",
    bgcolor: "rgba(255,255,255,0.02)",
  },
};

const destructiveButtonSx = {
  bgcolor: "#ff6b6b",
  color: "#fff",
  textTransform: "none",
  fontWeight: 700,
  borderRadius: "999px",
  boxShadow: "none",
  px: 2,
  minHeight: 44,
  "&:hover": {
    bgcolor: "#ff5252",
    boxShadow: "none",
  },
};

const DeletePostModal = ({ open, onClose, onConfirm, loading, error }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-post-title"
      aria-describedby="delete-post-description"
    >
      <Box
        sx={{
          bgcolor: "#151618",
          color: "#fff",
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.34)",
          width: "min(420px, calc(100vw - 32px))",
          mx: "auto",
          mt: { xs: "12vh", sm: "18vh" },
        }}
      >
        <Stack spacing={2}>
          <Typography
            id="delete-post-title"
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            Delete this post?
          </Typography>

          <Typography
            id="delete-post-description"
            variant="body2"
            sx={{ color: "#aaa", lineHeight: 1.6 }}
          >
            This action cannot be undone. The post and its conversation will be removed from the group.
          </Typography>

          {error && (
            <Typography variant="caption" color="error.main">
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
                <CircularProgress size={18} sx={{ color: "#fff" }} />
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