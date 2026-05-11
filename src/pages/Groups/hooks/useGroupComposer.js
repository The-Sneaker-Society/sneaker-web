import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POSTS_BY_GROUP } from "../graphql";

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

  useEffect(() => {
    return () => {
      imageSrcs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageSrcs]);

  const [createPost, { loading: posting }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_POSTS_BY_GROUP,
        variables: {
          groupId,
          limit: POSTS_PAGE_SIZE,
          offset: 0,
          commentLimit: INITIAL_COMMENT_PAGE_SIZE,
        },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      imageSrcs.forEach((url) => URL.revokeObjectURL(url));
      setPostContent("");
      setImageSrcs([]);
      setImageFiles([]);
      setPostError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
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

  const handlePostSubmit = () => {
    if (!postContent.trim()) {
      setPostError("Post content cannot be empty.");
      return;
    }

    if (!groupId) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    Promise.all(imageFiles.map(toBase64)).then((base64Images) => {
      createPost({
        variables: {
          groupId,
          content: postContent.trim(),
          images: base64Images,
        },
      });
    });
  };

  return {
    fileInputRef,
    postContent,
    setPostContent,
    imageSrcs,
    postError,
    posting,
    handleFileInputChange,
    handleRemoveImage,
    handlePostSubmit,
  };
};
