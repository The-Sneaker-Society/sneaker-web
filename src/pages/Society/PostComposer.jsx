import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ImageOutlined,
  VideocamOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { useColors } from "../../theme/colors";
import { CREATE_POST } from "../../context/graphql/getPosts";

const MAX_IMAGES = 4;

const PostComposer = ({ currentMember, onPostCreated }) => {
  const colors = useColors();
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [content, setContent] = useState("");
  const [mediaPreviews, setMediaPreviews] = useState([]); // { url, file, type }
  const [mediaType, setMediaType] = useState("none"); // none | image | video
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const [createPost, { loading }] = useMutation(CREATE_POST);

  const displayName =
    currentMember?.businessName ||
    `${currentMember?.firstName ?? ""} ${currentMember?.lastName ?? ""}`.trim();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (mediaType === "video") {
      setMediaPreviews([]);
      setMediaType("none");
    }

    const remaining = MAX_IMAGES - mediaPreviews.length;
    const toAdd = files.slice(0, remaining).map((f) => ({
      url: URL.createObjectURL(f),
      file: f,
      type: "image",
    }));

    setMediaPreviews((prev) => [...prev, ...toAdd]);
    setMediaType("image");
    e.target.value = "";
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear existing media
    mediaPreviews.forEach((m) => URL.revokeObjectURL(m.url));
    setMediaPreviews([{ url: URL.createObjectURL(file), file, type: "video" }]);
    setMediaType("video");
    e.target.value = "";
  };

  const handleRemoveMedia = (index) => {
    setMediaPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setMediaType("none");
      return next;
    });
  };

  const handleSubmit = async () => {
    setError("");
    if (!content.trim() && mediaPreviews.length === 0) {
      setError("Add some text or media to post.");
      return;
    }

    try {
      // In production, upload files to S3/CDN and get back URLs.
      // For now we pass the object URLs directly (works in dev, stubbed for prod).
      const mediaUrls = mediaPreviews.map((m) => m.url);

      const { data } = await createPost({
        variables: {
          data: {
            content: content.trim(),
            mediaUrls,
            mediaType,
          },
        },
      });

      if (data?.createPost) {
        onPostCreated(data.createPost);
        setContent("");
        mediaPreviews.forEach((m) => URL.revokeObjectURL(m.url));
        setMediaPreviews([]);
        setMediaType("none");
        setFocused(false);
      }
    } catch (e) {
      setError("Failed to publish post. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.isDark ? "#1a1a1a" : "#f5f5f5",
        borderRadius: "20px",
        border: `1px solid ${colors.isDark ? "#2a2a2a" : "#e0e0e0"}`,
        p: 2,
        mb: 3,
      }}
    >
      {/* Top row: avatar + text field */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
        {/* Avatar placeholder */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#FFD100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#000",
            }}
          >
            {displayName?.charAt(0)?.toUpperCase() ?? "?"}
          </Typography>
        </Box>

        <TextField
          fullWidth
          multiline
          minRows={focused ? 3 : 1}
          maxRows={8}
          placeholder={`What's on your mind, ${currentMember?.firstName ?? "member"}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setFocused(true)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "0.9rem",
              backgroundColor: colors.isDark ? "#111" : "#fff",
            },
          }}
        />
      </Box>

      {/* Media previews */}
      {mediaPreviews.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              mediaPreviews.length === 1
                ? "1fr"
                : mediaPreviews.length === 2
                ? "1fr 1fr"
                : "1fr 1fr",
            gap: 0.5,
            mt: 1.5,
          }}
        >
          {mediaPreviews.map((m, i) => (
            <Box key={i} sx={{ position: "relative" }}>
              {m.type === "video" ? (
                <Box
                  component="video"
                  src={m.url}
                  controls
                  sx={{ width: "100%", borderRadius: "10px", maxHeight: 240 }}
                />
              ) : (
                <Box
                  component="img"
                  src={m.url}
                  alt=""
                  sx={{
                    width: "100%",
                    height: { xs: 120, sm: 160 },
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              )}
              <IconButton
                size="small"
                onClick={() => handleRemoveMedia(i)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
                  width: 24,
                  height: 24,
                }}
              >
                <CloseOutlined sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 1.5, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      {/* Bottom toolbar */}
      {focused && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelect}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoSelect}
            />
            <IconButton
              size="small"
              onClick={() => imageInputRef.current?.click()}
              disabled={mediaType === "video" || mediaPreviews.length >= MAX_IMAGES}
              sx={{ color: colors.textSecondary }}
              title="Add photos"
            >
              <ImageOutlined />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => videoInputRef.current?.click()}
              disabled={mediaType === "image"}
              sx={{ color: colors.textSecondary }}
              title="Add video"
            >
              <VideocamOutlined />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setContent("");
                mediaPreviews.forEach((m) => URL.revokeObjectURL(m.url));
                setMediaPreviews([]);
                setMediaType("none");
                setFocused(false);
                setError("");
              }}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.8rem",
                textTransform: "none",
                color: colors.textSecondary,
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && mediaPreviews.length === 0)}
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                textTransform: "none",
                backgroundColor: "#FFD100",
                color: "#000",
                borderRadius: "20px",
                px: 2.5,
                "&:hover": { backgroundColor: "#E6BC00" },
                "&.Mui-disabled": { backgroundColor: "#FFD100", opacity: 0.5 },
              }}
            >
              {loading ? <CircularProgress size={16} sx={{ color: "#000" }} /> : "Post"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PostComposer;
