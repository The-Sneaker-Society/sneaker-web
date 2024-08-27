import React from "react";
import { Box, Icon, Typography } from "@mui/material";
import ImageDownloadButton from "../pages/Dashboard/ImageDownloadButton";
import { useQuery, gql } from "@apollo/client";
import { FaLink } from "react-icons/fa6";

// Define the query to get the current member's QR widget data
const GET_MEMBER_QR_WIDGET_DATA = gql`
  query GetMemberQrWidgetData {
    currentMember {
      qrWidgetData {
        image
        url
      }
    }
  }
`;

export const QrWidget = () => {
  const { loading, error, data } = useQuery(GET_MEMBER_QR_WIDGET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract QR data from the response
  const { image, url } = data.currentMember.qrWidgetData;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: "100%",
        borderRadius: "16px",
        border: "4px solid white",
        width: "100%",
        padding: "20px",
      }}
    >
      <img src={image} alt="QR Code" style={{ maxWidth: "50%" }} />
      <Box
        sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              color: 'white',
              fontWeight: "bold",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon sx={{ paddingRight: "25px" }}>
                <FaLink />
              </Icon>
              Link
            </Box>
          </Typography>
        </Box>
        <ImageDownloadButton imageSrc={image} />
      </Box>
    </Box>
  );
};