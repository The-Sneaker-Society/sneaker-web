import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_IMAGES } from '../hooks/imageQueries';
import useImageUploader from '../hooks/useImageUploader';

export default function ImageUploaderExample() {
  const { data, loading: qLoading, error: qError, refetch } = useQuery(GET_USER_IMAGES);
  const { upload, loading: uLoading } = useImageUploader({ onCompleted: () => refetch() });

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await upload(file);
    } catch (err) {
      console.error('Upload error', err);
    }
  }

  if (qLoading) return <div>Loading images…</div>;
  if (qError) return <div>Error loading images</div>;

  return (
    <div>
      <label>
        Upload image
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>
      {uLoading && <div>Uploading…</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 150px)', gap: 12, marginTop: 12 }}>
        {data?.getUserImages?.map((img) => (
          <div key={img.id} style={{ width: 150 }}>
            {img.url ? (
              <img src={img.url} alt={img.filename} style={{ width: '100%', height: 'auto' }} />
            ) : (
              <div style={{ width: '100%', height: 100, background: '#eee' }} />
            )}
            <div style={{ fontSize: 12 }}>{img.filename}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
