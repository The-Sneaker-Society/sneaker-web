# Image upload helpers

This directory contains the GraphQL documents and a reusable uploader hook used across the app.

Files
- `imageQueries.js` — exports GraphQL queries/mutations: `GET_USER_IMAGES`, `REQUEST_UPLOAD`, `CONFIRM_UPLOAD`, `UPDATE_IMAGE`, `DELETE_IMAGE`.
- `useImageUploader.js` — a hook that runs the three-step flow: request signed upload URL, upload the file, then confirm the upload.

Overview

- Call `requestImageUpload(filename, fileType)` to get an `uploadUrl` and `key`.
- PUT the file bytes to `uploadUrl` (the hook does this for you).
- Call `confirmImageUpload(key, filename, fileType)` to persist the record and get the final image object.

Example (component)

```jsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_IMAGES } from './imageQueries';
import useImageUploader from './useImageUploader';

export default function MyImageSection() {
  const { data, refetch } = useQuery(GET_USER_IMAGES);
  const { upload, loading } = useImageUploader({ onCompleted: () => refetch() });

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { await upload(file); } catch (err) { console.error(err); }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onFile} />
      {loading && <div>Uploading…</div>}
      <div>
        {data?.getUserImages?.map(img => (
          <img key={img.id} src={img.url} alt={img.filename} style={{width:100}} />
        ))}
      </div>
    </div>
  );
}
```

Notes
- If you need upload progress, replace the `fetch` PUT in `useImageUploader` with `XMLHttpRequest` or `axios` and use progress callbacks.
- Keep all components importing the hook and queries from this directory to ensure a single source of truth.

Helpers

- `useImageUploader()` now also returns `updateImage` and `deleteImage` helpers.

Examples

Update filename/fileType:

```js
const { updateImage } = useImageUploader();
const updated = await updateImage({ id: 'abc123', filename: 'new.jpg', fileType: 'image/jpeg' });
```

Delete image by id:

```js
const { deleteImage } = useImageUploader();
const result = await deleteImage('abc123'); // returns whatever the server deleteImage mutation returns
```
