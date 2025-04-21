import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { FiUpload, FiX } from "react-icons/fi";
import { useFormikContext } from "formik";

// Placeholder function for image upload (replace with your actual upload logic)
const uploadImage = async (file) => {
  // Simulate an upload delay (replace with actual API call)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real application, you would:
  // 1. Send the file to your server (e.g., using fetch or axios)
  // 2. Your server would store the image and return a URL
  // For this example, we'll generate a placeholder URL
  const placeholderUrl = `https://picsum.photos/200/300`;
  return placeholderUrl;
};

const ImageUploadStep = () => {
  const { setFieldValue, values } = useFormikContext();
  const [loading, setLoading] = useState(false);
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
      const imageFiles = Array.from(files);

      if (imageFiles.length > 0) {
        try {
          const file = imageFiles[0];
          const imageUrl = await uploadImage(file); // Await the upload

          setLocalImages((prevImages) => ({
            ...prevImages,
            [section]: [imageUrl],
          }));
          setFieldValue(`shoeDetails.photos.${section}`, [imageUrl]);
          console.log(`Image uploaded to ${section}:`, imageUrl);
        } catch (error) {
          console.error("Image upload failed:", error);
          // Handle upload error (e.g., show an error message)
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    },
    [setFieldValue]
  );

  const handleMultipleImageUpload = useCallback(
    async (section, files) => {
      setLoading(true);
      const imageFiles = Array.from(files);

      try {
        const imageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            return await uploadImage(file); // Await each upload
          })
        );

        setLocalImages((prevImages) => ({
          ...prevImages,
          [section]: [...prevImages[section], ...imageUrls].slice(0, 5),
        }));
        setFieldValue(
          `shoeDetails.photos.${section}`,
          [...localImages[section], ...imageUrls].slice(0, 5)
        );
        console.log(`Images uploaded to ${section}:`, imageUrls);
      } catch (error) {
        console.error("Image uploads failed:", error);
        // Handle upload error (e.g., show an error message)
      } finally {
        setLoading(false);
      }
    },
    [setFieldValue, localImages]
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

  const renderSingleImageSection = useCallback(
    (title, section) => {
      return (
        <Grid item xs={12} sm={6} md={4} key={section}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {localImages[section].length === 0 && (
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
                onChange={(e) => handleSingleImageUpload(section, e.target.files)}
              />
              <FiUpload size={24} />
              <Typography>Upload Image</Typography>
            </Box>
          )}
          {localImages[section].length > 0 && (
            <Box sx={{ position: "relative", mt: 1 }}>
              <img
                src={localImages[section][0]}
                alt={title}
                style={imagePreviewStyle}
              />
              <IconButton
                onClick={() => handleRemoveImage(section, 0)}
                sx={removeButtonStyle}
              >
                <FiX size={16} />
              </IconButton>
            </Box>
          )}
        </Grid>
      );
    },
    [handleSingleImageUpload, localImages, handleRemoveImage]
  );

  const renderMultipleImageSection = useCallback(
    (title, section) => {
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
              onChange={(e) => handleMultipleImageUpload(section, e.target.files)}
            />
            <FiUpload size={24} />
            <Typography>Upload Images (Max 5)</Typography>
          </Box>
          <ImageList
            sx={{ width: "100%", height: "auto", mt: 1 }}
            cols={3}
            rowHeight={100}
          >
            {localImages[section].map((image, index) => (
              <ImageListItem key={index}>
                <Box sx={{ position: "relative" }}>
                  <img
                    src={image}
                    alt={`${title} ${index + 1}`}
                    loading="lazy"
                    style={thumbnailStyle}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(section, index)}
                    sx={removeButtonStyle}
                  >
                    <FiX size={16} />
                  </IconButton>
                </Box>
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
      );
    },
    [handleMultipleImageUpload, localImages, handleRemoveImage]
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

  const removeButtonStyle = {
    position: "absolute",
    top: 2,
    right: 2,
    bgcolor: "red",
    color: "white",
    borderRadius: "50%",
    p: 0.5,
    "&:hover": {
      bgcolor: "darkred",
    },
  };

  return (
    <Box>
      {loading && (
        <Box display="flex" justifyContent="center" mb={2}>
          <CircularProgress />
        </Box>
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
    </Box>
  );
};

export default ImageUploadStep;