import {
  Box,
  Typography,
  Button,
  Modal,
  CircularProgress,
} from "@mui/material";

const DeletePostModal = ({ open, onClose, onConfirm, loading, error }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#1a1a1a",
          borderRadius: 2,
          p: 4,
          width: 340,
        }}
      >
        <Typography sx={{ color: "#fff", mb: 2, fontWeight: 700 }}>
          Delete post?
        </Typography>

        <Typography sx={{ color: "#aaa", mb: 2, fontSize: 14 }}>
          This action cannot be undone.
        </Typography>

        {error && (
          <Typography
            variant="caption"
            sx={{ color: "#ff6b6b", display: "block", mb: 1.5 }}
          >
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: "#ff6b6b",
            color: "#fff",
            mb: 1,
            "&:hover": { bgcolor: "#e05555" },
            "&:disabled": { bgcolor: "#555", color: "#999" },
          }}
        >
          {loading ? (
            <CircularProgress size={16} sx={{ color: "#fff" }} />
          ) : (
            "Delete Post"
          )}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{ color: "#aaa", borderColor: "#444" }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default DeletePostModal;
