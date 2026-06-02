import React, { useState } from "react";
import QrActionButton from "../../components/QrActionButton";
import { useColors } from "../../theme/colors";

const ImageDownloadButton = ({ imageSrc }) => {
  const [error, setError] = useState(null);
  const colors = useColors();

  const downloadImage = () => {
    try {
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = "sneaker_society_custom_qr_link.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {error && <div style={{ color: colors.status.error, marginTop: "8px", fontSize: "0.75rem" }}>An error occurred: {error}</div>}
      <QrActionButton onClick={downloadImage}>Download</QrActionButton>
    </>
  );
};

export default ImageDownloadButton;
