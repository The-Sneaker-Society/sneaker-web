import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { useColors } from "../../theme/colors";
import VaultMediaUploader from "./VaultMediaUploader";
import {
  CREATE_VAULT_SUBMISSION,
  UPDATE_VAULT_SUBMISSION,
  GET_VAULT_SUBMISSIONS,
} from "../../context/graphql/getVault";

const CATEGORIES = ["Customization", "Merchandise", "Photo", "Video", "Other"];

const PLATFORMS = ["Instagram", "TikTok", "Twitter/X", "YouTube", "Facebook"];

const VaultSubmissionForm = ({ onSubmitted, onCancel, initialData }) => {
  const colors = useColors();
  const isEditMode = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    initialData?.platforms || []
  );
  const [mediaUrls, setMediaUrls] = useState(initialData?.mediaUrls || []);
  const [mediaType, setMediaType] = useState(
    initialData?.mediaUrls?.length
      ? initialData.category === "Video"
        ? "video"
        : "image"
      : "none"
  );
  const [consent, setConsent] = useState(initialData?.consentAccepted || false);
  const [formError, setFormError] = useState("");

  const [createSubmission, { loading: creating }] = useMutation(
    CREATE_VAULT_SUBMISSION,
    {
      refetchQueries: [{ query: GET_VAULT_SUBMISSIONS }],
    }
  );

  const [updateSubmission, { loading: updating }] = useMutation(
    UPDATE_VAULT_SUBMISSION
  );

  const isSubmitting = creating || updating;

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleMediaChange = (urls, type) => {
    setMediaUrls(urls);
    setMediaType(type);
  };

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (mediaUrls.length === 0) return "Please add at least one photo or video.";
    if (!consent) return "You must confirm content ownership before submitting.";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");

    try {
      if (isEditMode) {
        const { data } = await updateSubmission({
          variables: {
            id: initialData.id,
            data: {
              title: title.trim(),
              description: description.trim(),
              category,
              platforms: selectedPlatforms,
              mediaUrls,
            },
          },
        });
        onSubmitted(data.updateVaultSubmission);
      } else {
        const { data } = await createSubmission({
          variables: {
            data: {
              title: title.trim(),
              description: description.trim(),
              category,
              platforms: selectedPlatforms,
              mediaUrls,
              consentAccepted: consent,
            },
          },
        });
        onSubmitted(data.createVaultSubmission);
      }
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setFormError("Title is required to save a draft.");
      return;
    }
    setFormError("");
    try {
      const { data } = await createSubmission({
        variables: {
          data: {
            title: title.trim(),
            description: description.trim(),
            category,
            platforms: selectedPlatforms,
            mediaUrls,
            consentAccepted: false,
            status: "draft",
          },
        },
      });
      onSubmitted(data.createVaultSubmission);
    } catch (err) {
      setFormError(err.message || "Something went wrong. Please try again.");
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      fontFamily: "Montserrat, sans-serif",
      color: colors.textPrimary,
      "& fieldset": {
        borderColor: colors.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
      },
      "&:hover fieldset": {
        borderColor: colors.warning,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.warning,
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: "Montserrat, sans-serif",
      color: colors.textSecondary,
      "&.Mui-focused": { color: colors.warning },
    },
    "& .MuiSelect-icon": { color: colors.textSecondary },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 700,
          fontSize: "1.25rem",
          color: colors.textPrimary,
        }}
      >
        {isEditMode ? "Edit Submission" : "Submit Your Work"}
      </Typography>

      {/* Title */}
      <TextField
        label="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        disabled={isSubmitting}
        sx={inputSx}
        inputProps={{ style: { fontFamily: "Montserrat, sans-serif" } }}
      />

      {/* Description */}
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        disabled={isSubmitting}
        sx={inputSx}
        inputProps={{ style: { fontFamily: "Montserrat, sans-serif" } }}
      />

      {/* Category */}
      <FormControl fullWidth sx={inputSx}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
          disabled={isSubmitting}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            color: colors.textPrimary,
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: colors.isDark ? "#1a1a1a" : "#fff",
                color: colors.textPrimary,
              },
            },
          }}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem
              key={cat}
              value={cat}
              sx={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Platforms */}
      <Box>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            color: colors.textSecondary,
            mb: 1,
          }}
        >
          Platforms (select all that apply)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {PLATFORMS.map((platform) => {
            const selected = selectedPlatforms.includes(platform);
            return (
              <Chip
                key={platform}
                label={platform}
                onClick={() => !isSubmitting && togglePlatform(platform)}
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: selected ? 700 : 400,
                  fontSize: "12px",
                  backgroundColor: selected
                    ? colors.warning
                    : colors.isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
                  color: selected
                    ? "#000"
                    : colors.textPrimary,
                  border: selected
                    ? `2px solid ${colors.warning}`
                    : "2px solid transparent",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: selected
                      ? colors.warning
                      : colors.isDark
                      ? "rgba(255,255,255,0.14)"
                      : "rgba(0,0,0,0.1)",
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Media uploader */}
      <Box>
        <Typography
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            color: colors.textSecondary,
            mb: 1,
          }}
        >
          Media *
        </Typography>
        <VaultMediaUploader
          mediaUrls={mediaUrls}
          mediaType={mediaType}
          onMediaChange={handleMediaChange}
          disabled={isSubmitting}
        />
      </Box>

      {/* Consent */}
      <FormControlLabel
        control={
          <Checkbox
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={isSubmitting}
            sx={{
              color: colors.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
              "&.Mui-checked": { color: colors.warning },
            }}
          />
        }
        label={
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontSize: "13px",
              color: colors.textSecondary,
            }}
          >
            I confirm I own this content or have rights to share it for
            promotional use on The Sneaker Society platform. *
          </Typography>
        }
      />

      {/* Error */}
      {formError && (
        <Alert
          severity="error"
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
          }}
        >
          {formError}
        </Alert>
      )}

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            textTransform: "none",
            backgroundColor: colors.warning,
            color: "#000",
            borderRadius: "10px",
            px: 3,
            py: 1,
            "&:hover": { backgroundColor: "#e6b000" },
            "&.Mui-disabled": { opacity: 0.6 },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={18} sx={{ color: "#000" }} />
          ) : isEditMode ? (
            "Save Changes"
          ) : (
            "Submit for Review"
          )}
        </Button>

        {!isEditMode && (
          <Button
            variant="outlined"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              textTransform: "none",
              borderColor: colors.isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
              color: colors.textSecondary,
              borderRadius: "10px",
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: colors.textPrimary,
                color: colors.textPrimary,
              },
            }}
          >
            Save Draft
          </Button>
        )}

        <Button
          variant="text"
          onClick={onCancel}
          disabled={isSubmitting}
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "none",
            color: colors.textSecondary,
            "&:hover": { color: colors.textPrimary },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default VaultSubmissionForm;
