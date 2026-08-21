import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import { useColors } from "../../theme/colors";

function ConnectSection() {
  const navigate = useNavigate();
  const colors = useColors();

  return (
    <Box
      component="section"
      id="connectSection"
      sx={{
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        py: { xs: 7, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            alignItems: "center",
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            display: "grid",
            gap: { xs: 4, md: 6 },
            gridTemplateColumns: {
              xs: "1fr",
              md: "auto minmax(0, 1fr) auto",
            },
            p: { xs: 3, sm: 5, md: 6 },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "primary.main",
              borderRadius: "50%",
              color: "primary.contrastText",
              display: "flex",
              height: 72,
              justifyContent: "center",
              width: 72,
            }}
          >
            <GroupsIcon fontSize="large" />
          </Box>

          <Stack spacing={1.5}>
            <Typography
              color="primary.main"
              fontWeight={800}
              variant="overline"
            >
              Grow with the community
            </Typography>

            <Typography component="h2" variant="h3">
              Connect with the people moving sneaker culture forward.
            </Typography>

            <Typography color={colors.textSecondary} variant="body1">
              Discover the community side of The Sneaker Society, build
              professional relationships, and find people who understand the
              services, craftsmanship, and care behind every pair.
            </Typography>
          </Stack>

          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/mysociety")}
            sx={{ minWidth: { xs: "100%", md: 190 } }}
            variant="contained"
          >
            Explore My Society
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ConnectSection;
