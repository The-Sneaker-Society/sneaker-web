import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POSTS_BY_GROUP } from "../graphql";
import { useImageUploader } from "../../../hooks/useImageUploader";

const POSTS_PAGE_SIZE = 10;
const INITIAL_COMMENT_PAGE_SIZE = 3;

const MAX_IMAGES_PER_POST = 4;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const useGroupComposer = ({ groupId }) => {
  const fileInputRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const [imageSrcs, setImageSrcs] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [postError, setPostError] = useState("");

  const { upload, loading: imageUploading } = useImageUploader();

  useEffect(() => {
    return () => {
      imageSrcs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageSrcs]);

  const resetComposer = () => {
    imageSrcs.forEach((url) => URL.revokeObjectURL(url));
    setPostContent("");
    setImageSrcs([]);
    setImageFiles([]);
    setPostError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [createPost, { loading: creatingPost }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_POSTS_BY_GROUP,
        variables: {
          groupId,
          limit: POSTS_PAGE_SIZE,
          offset: 0,
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: resetComposer,
    onError: (err) => setPostError(err.message),
  });

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const invalidTypeFiles = files.filter(
      (file) => !file.type.startsWith("image/"),
    );
    const imageOnlyFiles = files.filter((file) =>
      file.type.startsWith("image/"),
    );
    const oversizedFiles = imageOnlyFiles.filter(
      (file) => file.size > MAX_IMAGE_SIZE_BYTES,
    );
    const validFiles = imageOnlyFiles.filter(
      (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
    );

    const nextFiles = validFiles.slice(0, MAX_IMAGES_PER_POST);
    const errors = [];

    if (invalidTypeFiles.length > 0) {
      errors.push("Only image files can be uploaded.");
    }

    if (files.length > MAX_IMAGES_PER_POST) {
      errors.push(
        `You can upload up to ${MAX_IMAGES_PER_POST} images per post.`,
      );
    }

    if (oversizedFiles.length > 0) {
      const oversizedNames = oversizedFiles.map((file) => file.name).join(", ");
      errors.push(
        `Each image must be ${MAX_IMAGE_SIZE_MB}MB or smaller. Too large: ${oversizedNames}.`,
      );
    }

    imageSrcs.forEach((url) => URL.revokeObjectURL(url));

    const urls = nextFiles.map((file) => URL.createObjectURL(file));
    setImageSrcs(urls);
    setImageFiles(nextFiles);
    setPostError(errors.join(" "));

    if (fileInputRef.current && nextFiles.length === 0) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImageSrcs((prev) => {
      const next = [...prev];
      const [removedUrl] = next.splice(indexToRemove, 1);

      if (removedUrl) {
        URL.revokeObjectURL(removedUrl);
      }

      return next;
    });

    setImageFiles((prev) => {
      const next = prev.filter((_, index) => index !== indexToRemove);

      if (fileInputRef.current && next.length === 0) {
        fileInputRef.current.value = "";
      }

      return next;
    });
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim()) {
      setPostError("Post content cannot be empty.");
      return;
    }

    if (!groupId) return;

    try {
      setPostError("");

      const uploadedImages = await Promise.all(
        imageFiles.map((file) => upload(file)),
      );

      const imageUrls = uploadedImages.map((img) => img?.url).filter(Boolean);

      await createPost({
        variables: {
          groupId,
          content: postContent.trim(),
          images: imageUrls,
        },
      });
    } catch (err) {
      setPostError(err?.message || "Failed to upload images.");
    }
  };

  return {
    fileInputRef,
    postContent,
    setPostContent,
    imageSrcs,
    postError,
    posting: creatingPost || imageUploading,
    handleFileInputChange,
    handleRemoveImage,
    handlePostSubmit,
  };
};
