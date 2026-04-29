import { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POSTS_BY_GROUP } from "../graphql";

const POSTS_PAGE_SIZE = 10;
const INITIAL_COMMENT_PAGE_SIZE = 3;

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
    },
    onError: (err) => setPostError(err.message),
  });

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    imageSrcs.forEach((url) => URL.revokeObjectURL(url));

    const urls = files.map((file) => URL.createObjectURL(file));
    setImageSrcs(urls);
    setImageFiles(files);
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
    handlePostSubmit,
  };
};