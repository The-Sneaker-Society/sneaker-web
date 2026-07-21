import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  ImageOutlined,
  VideocamOutlined,
  CloseOutlined,
} from "@mui/icons-material";
import { useColors } from "../../theme/colors";

const MAX_IMAGES = 5;

const VaultMediaUploader = ({
  mediaUrls = [],
  mediaType = "none",
  onMediaChange,
  disabled = false,
  uploading = false,
}) => {
  const colors = useColors();
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleImageSelect = (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentCount = mediaType === "image" ? mediaUrls.length : 0;
    if (currentCount + files.length > MAX_IMAGES) {
      setError(`You can upload a maximum of ${MAX_IMAGES} photos.`);
      e.target.value = "";
      return;
    }

    const previews = files.map((f) => URL.createObjectURL(f));
    const combined = mediaType === "image" ? [...mediaUrls, ...previews] : previews;
    onMediaChange(combined, "image");
    e.target.value = "";
  };

  const handleVideoSelect = (e) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file.");
      e.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);
    onMediaChange([preview], "video");
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    const updated = mediaUrls.filter((_, i) => i !== index);
    if (updated.length === 0) {
      onMediaChange([], "none");
    } else {
      onMediaChange(updated, "image");
    }
  };

  const handleRemoveVideo = () => {
    onMediaChange([], "none");
  };

  const borderColor = colors.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
  const bg = colors.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";

  return (
    <Box>
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleImageSelect}
        disabled={disabled}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleVideoSelect}
        disabled={disabled}
      />

      {/* Upload buttons */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ImageOutlined />}
          onClick={() => imageInputRef.current?.click()}
          disabled={disabled || mediaType === "video"}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "none",
            borderColor: colors.isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            color: colors.textPrimary,
            borderRadius: "10px",
            "&:hover": {
              borderColor: colors.warning,
              color: colors.warning,
            },
            "&.Mui-disabled": {
              opacity: 0.4,
            },
          }}
        >
          Add Photos
        </Button>
        <Button
          variant="outlined"
          startIcon={<VideocamOutlined />}
          onClick={() => videoInputRef.current?.click()}
          disabled={disabled || mediaType === "image"}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            textTransform: "none",
            borderColor: colors.isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            color: colors.textPrimary,
            borderRadius: "10px",
            "&:hover": {
              borderColor: colors.warning,
              color: colors.warning,
            },
            "&.Mui-disabled": {
              opacity: 0.4,
            },
          }}
        >
          Add Video
        </Button>
      </Box>

      {/* Progress bar */}
      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            sx={{
              borderRadius: 2,
              backgroundColor: colors.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
              "& .MuiLinearProgress-bar": { backgroundColor: colors.warning },
            }}
          />
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "12px",
              color: colors.textSecondary,
              mt: 0.5,
            }}
          >
            Uploading...
          </Typography>
        </Box>
      )}

      {/* Error */}
      {error && (
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            color: "#e74c3c",
            mb: 1.5,
          }}
        >
          {error}
        </Typography>
      )}

      {/* Image preview grid */}
      {mediaType === "image" && mediaUrls.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1.5,
            p: 1.5,
            border: `1px solid ${borderColor}`,
            borderRadius: "12px",
            backgroundColor: bg,
          }}
        >
          {mediaUrls.map((url, i) => (
            <Box
              key={i}
              sx={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}
            >
              <Box
                component="img"
                src={url}
                alt={`Preview ${i + 1}`}
                sx={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveImage(i)}
                disabled={disabled}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.65)",
                  color: "#fff",
                  padding: "2px",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.85)" },
                }}
              >
                <CloseOutlined sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Video preview */}
      {mediaType === "video" && mediaUrls.length > 0 && (
        <Box
          sx={{
            position: "relative",
            border: `1px solid ${borderColor}`,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: bg,
          }}
        >
          <Box
            component="video"
            src={mediaUrls[0]}
            controls
            sx={{ width: "100%", maxHeight: "280px", display: "block" }}
          />
          <IconButton
            size="small"
            onClick={handleRemoveVideo}
            disabled={disabled}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.65)",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.85)" },
            }}
          >
            <CloseOutlined sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      )}

      {/* Empty state hint */}
      {mediaType === "none" && (
        <Box
          sx={{
            border: `1px dashed ${borderColor}`,
            borderRadius: "12px",
            p: 3,
            textAlign: "center",
            backgroundColor: bg,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "13px",
              color: colors.textSecondary,
            }}
          >
            Add up to 5 photos or 1 video
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VaultMediaUploader;
