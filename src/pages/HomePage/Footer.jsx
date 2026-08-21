import React from "react";
import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";
import { useColors } from "../../theme/colors";

function Footer() {
  const colors = useColors();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: colors.surfaceBg,
        borderTop: 1,
        borderColor: "divider",
        color: colors.textPrimary,
        mt: "auto",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          alignItems={{ xs: "flex-start", md: "center" }}
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography fontWeight={700} variant="body1">
              The Sneaker Society
            </Typography>

            <Typography color={colors.textSecondary} variant="body2">
              © {currentYear} The Sneaker Society, LLC. All rights reserved.
            </Typography>
          </Box>

          <Stack
            alignItems="center"
            direction="row"
            spacing={0.5}
            sx={{ color: colors.textSecondary }}
          >
            <Link
              color="inherit"
              href="/contact"
              underline="hover"
              variant="body2"
            >
              Contact
            </Link>

            <IconButton
              aria-label="The Sneaker Society on Facebook"
              component="a"
              href="#"
              rel="noreferrer"
              size="small"
              target="_blank"
              sx={{
                color: colors.textSecondary,
                "&:hover": {
                  bgcolor: "action.hover",
                  color: colors.textPrimary,
                },
              }}
            >
              <Facebook fontSize="small" />
            </IconButton>

            <IconButton
              aria-label="The Sneaker Society on Instagram"
              component="a"
              href="#"
              rel="noreferrer"
              size="small"
              target="_blank"
              sx={{
                color: colors.textSecondary,
                "&:hover": {
                  bgcolor: "action.hover",
                  color: colors.textPrimary,
                },
              }}
            >
              <Instagram fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
