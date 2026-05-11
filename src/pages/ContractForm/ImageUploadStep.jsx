import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Alert,
} from "@mui/material";
import { FiUpload, FiX, FiZoomIn } from "react-icons/fi";
import { useFormikContext } from "formik";
import ImagePreviewDialog from "../../components/ImagePreviewDialog";
import { useImageUploader } from "../../hooks/useImageUploader";

const ImageUploadStep = () => {
  const { setFieldValue, values } = useFormikContext();
  const { upload, loading: uploading } = useImageUploader();
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [localImages, setLocalImages] = useState({
    leftSide: [],
    rightSide: [],
    topView: [],
    bottomView: [],
    frontView: [],
    backView: [],
    other: [],
  });

  // Effect to initialize localImages from Formik values on mount and update
  useEffect(() => {
    if (values.shoeDetails && values.shoeDetails.photos) {
      setLocalImages(values.shoeDetails.photos);
    }
  }, [values.shoeDetails]);

  const handleSingleImageUpload = useCallback(
    async (section, files) => {
      setLoading(true);
      setUploadError(null);
      const imageFiles = Array.from(files);

      if (imageFiles.length > 0) {
        try {
          const file = imageFiles[0];
          const confirmed = await upload(file);

          const photoObj = { key: confirmed.key, url: confirmed.url, note: "" };
          setLocalImages((prevImages) => ({
            ...prevImages,
            [section]: [photoObj],
          }));
          setFieldValue(`shoeDetails.photos.${section}`, [photoObj]);
        } catch (error) {
          setUploadError(error.message || "Image upload failed");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    },
    [setFieldValue, upload]
  );

  const handleMultipleImageUpload = useCallback(
    async (section, files) => {
      setLoading(true);
      setUploadError(null);
      const imageFiles = Array.from(files);

      try {
        const confirmedImages = await Promise.all(
          imageFiles.map(async (file) => {
            return await upload(file);
          })
        );
        const newPhotos = confirmedImages.map((img) => ({ key: img.key, url: img.url, note: "" }));

        setLocalImages((prevImages) => ({
          ...prevImages,
          [section]: [...prevImages[section], ...newPhotos].slice(0, 5),
        }));
        setFieldValue(
          `shoeDetails.photos.${section}`,
          [...localImages[section], ...newPhotos].slice(0, 5)
        );
      } catch (error) {
        setUploadError(error.message || "Image uploads failed");
      } finally {
        setLoading(false);
      }
    },
    [setFieldValue, localImages, upload]
  );

  const handleRemoveImage = useCallback(
    (section, indexToRemove) => {
      setLocalImages((prevImages) => ({
        ...prevImages,
        [section]: prevImages[section].filter(
          (_, index) => index !== indexToRemove
        ),
      }));
      setFieldValue(
        `shoeDetails.photos.${section}`,
        localImages[section].filter((_, index) => index !== indexToRemove)
      );
    },
    [setFieldValue, localImages]
  );

  const handleNoteChange = useCallback(
    (section, index, note) => {
      setLocalImages((prevImages) => {
        const updated = [...prevImages[section]];
        updated[index] = { ...updated[index], note };
        return { ...prevImages, [section]: updated };
      });
      setFieldValue(`shoeDetails.photos.${section}.${index}.note`, note);
    },
    [setFieldValue]
  );

  const uploadBoxSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    width: "100%",
    minHeight: 120,
    py: 3,
    borderRadius: 3,
    cursor: "pointer",
    bgcolor: "transparent",
    border: "2px dashed",
    borderColor: "grey.300",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "transparent",
      borderColor: "primary.main",
      transform: "scale(1.02)",
    },
  };

  const uploadedImageSx = {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 2,
  };

  const sectionTitleSx = {
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "text.secondary",
    mb: 1,
  };

  const renderSingleImageSection = useCallback(
    (title, section) => {
      const photo = localImages[section]?.[0];
      return (
        <Grid item xs={12} sm={6} md={4} key={section}>
          <Typography sx={sectionTitleSx}>{title}</Typography>
          {!photo && (
            <Box
              component="label"
              htmlFor={`upload-${section}`}
              sx={uploadBoxSx}
            >
              <input
                type="file"
                id={`upload-${section}`}
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  e.preventDefault();
                  handleSingleImageUpload(section, e.target.files);
                }}
              />
              <Box sx={{ color: "grey.400", lineHeight: 0 }}>
                <FiUpload size={28} />
              </Box>
              <Typography fontSize="0.85rem" fontWeight={600} color="text.secondary">
                Upload Image
              </Typography>
            </Box>
          )}
          {photo && (
            <Box>
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={photo.url}
                  alt={title}
                  sx={uploadedImageSx}
                />
                <IconButton
                  onClick={() => setPreviewUrl(photo.url)}
                  sx={{ position: "absolute", top: 4, left: 4, bgcolor: "rgba(0,0,0,0.45)", color: "white", borderRadius: "50%", p: 0.5, "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                >
                  <FiZoomIn size={15} />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveImage(section, 0)}
                  sx={{ position: "absolute", top: 4, right: 4, bgcolor: "primary.main", color: "white", borderRadius: "50%", p: 0.5, "&:hover": { bgcolor: "primary.dark" } }}
                >
                  <FiX size={15} />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a note..."
                value={photo.note || ""}
                onChange={(e) => handleNoteChange(section, 0, e.target.value)}
                sx={{ mt: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.85rem" } }}
              />
            </Box>
          )}
        </Grid>
      );
    },
    [handleSingleImageUpload, localImages, handleRemoveImage, handleNoteChange]
  );

  const renderMultipleImageSection = useCallback(
    (title, section) => {
      const images = localImages[section] || [];
      return (
        <Grid item xs={12} sm={6} md={4} key={section}>
          <Typography sx={sectionTitleSx}>{title}</Typography>
          <Box
            component="label"
            htmlFor={`upload-${section}`}
            sx={uploadBoxSx}
          >
            <input
              type="file"
              id={`upload-${section}`}
              hidden
              multiple
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                e.preventDefault();
                handleMultipleImageUpload(section, e.target.files);
              }}
            />
            <Box sx={{ color: "grey.400", lineHeight: 0 }}>
              <FiUpload size={28} />
            </Box>
            <Typography fontSize="0.85rem" fontWeight={600} color="text.secondary">
              Upload Images (Max 5)
            </Typography>
          </Box>
          {images.map((photo, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={photo.url}
                  alt={`${title} ${index + 1}`}
                  sx={uploadedImageSx}
                />
                <IconButton
                  onClick={() => setPreviewUrl(photo.url)}
                  sx={{ position: "absolute", top: 4, left: 4, bgcolor: "rgba(0,0,0,0.45)", color: "white", borderRadius: "50%", p: 0.5, "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
                >
                  <FiZoomIn size={15} />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveImage(section, index)}
                  sx={{ position: "absolute", top: 4, right: 4, bgcolor: "primary.main", color: "white", borderRadius: "50%", p: 0.5, "&:hover": { bgcolor: "primary.dark" } }}
                >
                  <FiX size={15} />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a note..."
                value={photo.note || ""}
                onChange={(e) => handleNoteChange(section, index, e.target.value)}
                sx={{ mt: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.85rem" } }}
              />
            </Box>
          ))}
        </Grid>
      );
    },
    [handleMultipleImageUpload, localImages, handleRemoveImage, handleNoteChange]
  );

  return (
    <Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700} fontSize="1.75rem">
          Upload Photos
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={0.5} fontSize="0.95rem">
          Take clear photos of each angle
        </Typography>
      </Box>
      {(loading || uploading) && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}
      <Grid container spacing={2.5}>
        {renderSingleImageSection("Left Side", "leftSide")}
        {renderSingleImageSection("Right Side", "rightSide")}
        {renderSingleImageSection("Top View", "topView")}
        {renderSingleImageSection("Bottom View", "bottomView")}
        {renderSingleImageSection("Front View", "frontView")}
        {renderSingleImageSection("Back View", "backView")}
        {renderMultipleImageSection("Other Areas", "other")}
      </Grid>
      <ImagePreviewDialog
        open={!!previewUrl}
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </Box>
  );
};

export default ImageUploadStep;
