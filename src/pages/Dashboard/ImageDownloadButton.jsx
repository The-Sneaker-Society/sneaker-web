import React, { useState } from "react";
import Button from "@mui/material/Button";
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
    <div>
      {error && <div style={{ color: colors.status.error }}>An error occurred: {error}</div>}
      <Button
        variant="outlined"
        onClick={downloadImage}
        style={{ marginTop: "10px" }}
        sx={{
          color: colors.textPrimary,
          borderColor: colors.border,
          borderRadius: "5px",
        }}
      >
        Download
      </Button>
    </div>
  );
};

export default ImageDownloadButton;
