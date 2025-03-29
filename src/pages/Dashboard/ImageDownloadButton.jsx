import React, { useState } from "react";
import Button from "@mui/material/Button";
const ImageDownloadButton = ({ imageSrc }) => {
  const [error, setError] = useState(null);

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
    <div>
      {error && <div style={{ color: "red" }}>An error occurred: {error}</div>}
      <Button
        variant="outlined"
        onClick={downloadImage}
        style={{ marginTop: "10px" }}
        sx={{
          color: "white",
          borderColor: "white",
          borderRadius: "5px",
        }}
      >
        Download
      </Button>
    </div>
  );
};

export default ImageDownloadButton;
