import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import Logo from "../../assets/SNEAKER SOCIETY (Transparency).png";
import { useColors } from "../theme/colors";

export default function ErrorPage() {
  const navigate = useNavigate();
  const colors = useColors();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        bgcolor: colors.pageBg,
        color: colors.textPrimary,
        display: "flex",
        minHeight: "100vh",
        py: { xs: 3, sm: 5 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
            p: { xs: 3, sm: 5 },
            textAlign: "center",
          }}
        >
          <Stack alignItems="center" spacing={3}>
            <Box
              sx={{
                alignItems: "center",
                bgcolor: "primary.main",
                borderRadius: "50%",
                color: "primary.contrastText",
                display: "flex",
                height: { xs: 72, sm: 88 },
                justifyContent: "center",
                width: { xs: 72, sm: 88 },
              }}
            >
              <SearchOffIcon sx={{ fontSize: { xs: 36, sm: 44 } }} />
            </Box>

            <Box
              alt="The Sneaker Society"
              component="img"
              src={Logo}
              sx={{
                height: "auto",
                maxWidth: 260,
                width: { xs: "72%", sm: "60%" },
              }}
            />

            <Stack spacing={1.5}>
              <Typography
                color="primary.main"
                component="p"
                fontWeight={800}
                sx={{ letterSpacing: "0.08em" }}
                variant="overline"
              >
                Error 404
              </Typography>

              <Typography component="h1" variant="h3">
                This page is not in the collection.
              </Typography>

              <Typography color={colors.textSecondary} variant="body1">
                We could not find the page you were looking for. It may have
                moved, been removed, or the link may not be correct.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ pt: 1, width: "100%" }}
            >
              <Button
                fullWidth
                onClick={handleGoBack}
                startIcon={<ArrowBackIcon />}
                variant="outlined"
              >
                Go back
              </Button>

              <Button
                component={RouterLink}
                fullWidth
                startIcon={<HomeIcon />}
                to="/"
                variant="contained"
              >
                Return home
              </Button>
            </Stack>

            <Typography color={colors.textSecondary} variant="caption">
              Need help? Visit the home page to explore the platform or contact
              The Sneaker Society team.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
