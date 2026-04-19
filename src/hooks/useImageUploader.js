import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { REQUEST_UPLOAD, CONFIRM_UPLOAD, UPDATE_IMAGE, DELETE_IMAGE } from './imageQueries';

async function uploadToSignedUrl(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream'
    },
    body: file
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text || ''}`);
  }

  return res;
}

export function useImageUploader({ onCompleted } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [requestUpload] = useMutation(REQUEST_UPLOAD);
  const [confirmUpload] = useMutation(CONFIRM_UPLOAD);
  const [updateImageMut] = useMutation(UPDATE_IMAGE);
  const [deleteImageMut] = useMutation(DELETE_IMAGE);

  const upload = useCallback(
    async (file) => {
      setLoading(true);
      setError(null);
      try {
        const filename = file.name;
        const fileType = file.type || null;

        const { data } = await requestUpload({ variables: { filename, fileType } });
        const payload = data?.requestImageUpload;
        if (!payload) throw new Error('requestImageUpload returned no data');

        const { uploadUrl, key } = payload;
        await uploadToSignedUrl(uploadUrl, file);

        const { data: confData } = await confirmUpload({ variables: { key, filename, fileType } });
        const confirmed = confData?.confirmImageUpload;

        setLoading(false);
        onCompleted?.(confirmed);
        return confirmed;
      } catch (err) {
        setError(err);
        setLoading(false);
        throw err;
      }
    },
    [requestUpload, confirmUpload, onCompleted]
  );

  const updateImage = useCallback(
    async ({ id, filename, fileType }) => {
      try {
        const { data } = await updateImageMut({ variables: { id, filename, fileType } });
        return data?.updateImage;
      } catch (err) {
        throw err;
      }
    },
    [updateImageMut]
  );

  const deleteImage = useCallback(
    async (id) => {
      try {
        const { data } = await deleteImageMut({ variables: { id } });
        return data?.deleteImage;
      } catch (err) {
        throw err;
      }
    },
    [deleteImageMut]
  );

  return { upload, updateImage, deleteImage, loading, error };
}

export default useImageUploader;
