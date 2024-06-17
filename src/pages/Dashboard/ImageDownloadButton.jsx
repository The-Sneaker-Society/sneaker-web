import React from 'react';
import Button from '@mui/material/Button'; // Import Button from Material-UI

const ImageDownloadButton = ({ imageSrc }) => {
    const downloadImage = () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = 'downloaded_qr.png'; // Set the name for the downloaded file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Replace the standard HTML button with a Material-UI Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={downloadImage}
                style={{ marginTop: '10px' }}
            >
                Download
            </Button>
        </div>
    );
};

export default ImageDownloadButton;
