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

  const renderSingleImageSection = useCallback(
    (title, section) => {
      const photo = localImages[section]?.[0];
      return (
        <Grid item xs={12} sm={6} md={4} key={section}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {!photo && (
            <Box
              component="label"
              htmlFor={`upload-${section}`}
              sx={{ ...uploadBoxStyle }}
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
              <FiUpload size={24} />
              <Typography>Upload Image</Typography>
            </Box>
          )}
          {photo && (
            <Box sx={{ mt: 1 }}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={photo.url}
                  alt={title}
                  style={imagePreviewStyle}
                />
                <IconButton
                  onClick={() => setPreviewUrl(photo.url)}
                  sx={viewButtonStyle}
                >
                  <FiZoomIn size={16} />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveImage(section, 0)}
                  sx={removeButtonStyle}
                >
                  <FiX size={16} />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Add a note about this area"
                value={photo.note || ""}
                onChange={(e) => handleNoteChange(section, 0, e.target.value)}
                sx={{ mt: 1 }}
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
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box
            component="label"
            htmlFor={`upload-${section}`}
            sx={{ ...uploadBoxStyle }}
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
            <FiUpload size={24} />
            <Typography>Upload Images (Max 5)</Typography>
          </Box>
          {images.map((photo, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={photo.url}
                  alt={`${title} ${index + 1}`}
                  style={thumbnailStyle}
                />
                <IconButton
                  onClick={() => setPreviewUrl(photo.url)}
                  sx={viewButtonStyle}
                >
                  <FiZoomIn size={16} />
                </IconButton>
                <IconButton
                  onClick={() => handleRemoveImage(section, index)}
                  sx={removeButtonStyle}
                >
                  <FiX size={16} />
                </IconButton>
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Add a note about this area"
                value={photo.note || ""}
                onChange={(e) => handleNoteChange(section, index, e.target.value)}
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
        </Grid>
      );
    },
    [handleMultipleImageUpload, localImages, handleRemoveImage, handleNoteChange]
  );

  const uploadBoxStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: (theme) => theme.spacing(3),
    textAlign: "center",
    cursor: "pointer",
    border: (theme) => `2px dashed ${theme.palette.grey[400]}`,
    borderRadius: (theme) => theme.shape.borderRadius,
    "&:hover": {
      borderColor: (theme) => theme.palette.primary.main,
    },
  };

  const imagePreviewStyle = {
    width: "100%",
    height: 128,
    objectFit: "cover",
    borderRadius: (theme) => theme.shape.borderRadius,
  };

  const thumbnailStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: (theme) => theme.shape.borderRadius,
  };

  const viewButtonStyle = {
    position: "absolute",
    top: 2,
    left: 2,
    bgcolor: "rgba(0,0,0,0.5)",
    color: "white",
    borderRadius: "50%",
    p: 0.5,
    "&:hover": {
      bgcolor: "rgba(0,0,0,0.7)",
    },
  };

  const removeButtonStyle = {
    position: "absolute",
    top: 2,
    right: 2,
    bgcolor: "primary.main",
    color: "white",
    borderRadius: "50%",
    p: 0.5,
    "&:hover": {
      bgcolor: "primary.dark",
    },
  };

  return (
    <Box>
      {(loading || uploading) && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
      )}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}
      <Grid container spacing={3}>
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
