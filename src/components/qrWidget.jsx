import React from "react";
import { Box, Icon, Typography, Stack } from "@mui/material";
import ImageDownloadButton from "../pages/Dashboard/ImageDownloadButton";
import { useQuery, gql } from "@apollo/client";
import { FaLink } from "react-icons/fa6";

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

// export const QrWidget = () => {
//   // const { loading, error, data } = useQuery(GET_MEMBER_QR_WIDGET_DATA);

// Fallback UI while data is loading
// if (loading) {

export const QrWidget = () => {
  // Mock data to bypass the query
  const mockData = {
    currentMember: {
      qrWidgetData: {
        image: "https://via.placeholder.com/150", // Replace with a placeholder image URL
        url: "https://example.com", // Replace with a placeholder link
      },
    },
  };

  // Extract QR data from the mock response
  const { image, url } = mockData.currentMember.qrWidgetData;

  return (
    <Box
      sx={{
        display: "flex",

        justifyContent: "space-between",
        width: "100%",
        borderRadius: 2,
        border: "4px solid white",
        padding: "20px",
        textAlign: "left",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "25px",
            color: "white",
          }}
        >
          Custom Intake Link
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "#aaa",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Share you custom link to start getting intakes!
        </Typography>
      </Box>

      <Stack direction="row">
        <img
          src={image}
          alt="QR Code"
          style={{ width: "120px", height: "120px", marginBottom: "10px" }}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              color: "white",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              />
              <Icon sx={{ paddingRight: "25px" }}>
                <FaLink />
              </Icon>
              Link
            </Box>
          </Typography>
          <ImageDownloadButton imageSrc={image} />
        </Box>
      </Stack>
    </Box>
  );
};
