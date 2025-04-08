import React from "react";
import { Box, Icon, Typography, Link } from "@mui/material";
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

export const QrWidget = () => {
  const { loading, error, data } = useQuery(GET_MEMBER_QR_WIDGET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { image, url } = data.currentMember.qrWidgetData;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 2,
        border: "4px solid white",
        padding: "20px",
        gap: 4,
      }}
    >
      <Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "white",
            marginBottom: "8px",
          }}
        >
          Custom Intake Link
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: "#aaa",
          }}
        >
          Share you custom link to start getting intakes!
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        <Box>
          <img
            src={image}
            alt="QR Code"
            style={{
              width: "120px",
              height: "120px",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Link href="/contract/:memberId" target="_blank">
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
              <Icon sx={{ display: "flex", alignItems: "center" }}>
                <FaLink />
              </Icon>
              Link
            </Typography>
          </Link>
          <ImageDownloadButton imageSrc={image} />
        </Box>
      </Box>
    </Box>
  );
};
