import { useState, useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import GifBoxIcon from "@mui/icons-material/GifBox";
import VideocamIcon from "@mui/icons-material/Videocam";
import CancelIcon from "@mui/icons-material/Cancel";
import { gql, useMutation } from "@apollo/client";
import StyledButton from "../pages/HomePage/StyledButton";

const CREATE_POST = gql`
  mutation CreatePost($groupId: ID!, $content: String!, $media: [MediaInput]) {
    createPost(groupId: $groupId, content: $content, media: $media) {
      id
      content
      media {
        url
        type
      }
      createdAt
    }
  }
`;

const ACCEPTED_TYPES = {
  photo: "image/jpeg,image/png,image/webp",
  video: "video/mp4,video/mov,video/quicktime",
  gif: "image/gif",
};

const CreatePostModal = ({ open, onClose, groupId }) => {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [error, setError] = useState(null);

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const gifInputRef = useRef(null);

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      handleClose();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleClose = () => {
    setContent("");
    setMediaFiles([]);
    setError(null);
    onClose();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
    }));
    setMediaFiles((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const handleRemoveMedia = (index) => {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = () => {
    if (!content.trim() && mediaFiles.length === 0) {
      setError("Please add some content or media before posting.");
      return;
    }
    setError(null);
    createPost({
      variables: {
        groupId,
        content: content.trim(),
        media: mediaFiles.map((m) => ({ url: m.url, type: m.type })),
      },
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "#3b3b3b",
          borderRadius: "16px",
          p: 3,
          boxShadow: 24,
          outline: "none",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#FFD100" }}
          >
            Create Post
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 0,
              bgcolor: "#666",
              color: "#fff",
              width: 32,
              height: 32,
              "&:hover": { bgcolor: "#888" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Text area */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "8px",
            p: 1.5,
            mb: 2,
          }}
        >
          <TextField
            fullWidth
            multiline
            minRows={5}
            placeholder="What's going on today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{
              "& .MuiInputBase-input": {
                color: "#000",
                fontSize: "1rem",
              },
            }}
          />

          {/* Media preview strip */}
          {mediaFiles.length > 0 && (
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1.5, flexWrap: "wrap", gap: 1 }}
            >
              {mediaFiles.map((media, index) => (
                <Box
                  key={index}
                  sx={{ position: "relative", display: "inline-block" }}
                >
                  {media.type === "video" ? (
                    <video
                      src={media.url}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={media.url}
                      alt={media.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveMedia(index)}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      p: 0,
                      color: "#555",
                      bgcolor: "transparent",
                      "&:hover": { color: "#000" },
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* Media upload buttons */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <input
            ref={photoInputRef}
            type="file"
            accept={ACCEPTED_TYPES.photo}
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept={ACCEPTED_TYPES.video}
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          <input
            ref={gifInputRef}
            type="file"
            accept={ACCEPTED_TYPES.gif}
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          <IconButton
            onClick={() => photoInputRef.current?.click()}
            sx={{
              bgcolor: "#555",
              color: "#fff",
              borderRadius: "8px",
              px: 1.5,
              gap: 0.5,
              "&:hover": { bgcolor: "#666" },
            }}
          >
            <PhotoLibraryIcon fontSize="small" />
            <Typography variant="caption" sx={{ color: "#fff" }}>
              Photo
            </Typography>
          </IconButton>

          <IconButton
            onClick={() => videoInputRef.current?.click()}
            sx={{
              bgcolor: "#555",
              color: "#fff",
              borderRadius: "8px",
              px: 1.5,
              gap: 0.5,
              "&:hover": { bgcolor: "#666" },
            }}
          >
            <VideocamIcon fontSize="small" />
            <Typography variant="caption" sx={{ color: "#fff" }}>
              Video
            </Typography>
          </IconButton>

          <IconButton
            onClick={() => gifInputRef.current?.click()}
            sx={{
              bgcolor: "#555",
              color: "#fff",
              borderRadius: "8px",
              px: 1.5,
              gap: 0.5,
              "&:hover": { bgcolor: "#666" },
            }}
          >
            <GifBoxIcon fontSize="small" />
            <Typography variant="caption" sx={{ color: "#fff" }}>
              GIF
            </Typography>
          </IconButton>
        </Stack>

        {/* Error */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        {/* Post button */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <StyledButton
            onClick={handleSubmit}
            disabled={loading}
            sx={{ width: "100%" }}
          >
            {loading ? <CircularProgress size={22} /> : "Post"}
          </StyledButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreatePostModal;
