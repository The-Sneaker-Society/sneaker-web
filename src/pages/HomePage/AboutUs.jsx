import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const CustomPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  minHeight: 300,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: theme.shadows[3],
}));

const TestimonialPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: theme.shadows[2],
}));

const AboutUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        sx={{
          minHeight: "100vh",
          pt: 8,
          pb: 8,
          backgroundColor: "black",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            About Us
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Discover the story behind our brand
          </Typography>
          <Divider sx={{ mb: 6, borderColor: "white" }} />
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}
          >
            <Grid item xs={12} md={6}>
              <CustomPaper>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Our Mission
                </Typography>
                <Typography variant="body1">
                  Our mission is to create the best shoes with innovative
                  designs, outstanding comfort, and top-notch quality. We strive
                  to empower our customers by providing footwear that boosts
                  their confidence and supports their active lifestyles.
                </Typography>
              </CustomPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomPaper>
                <Typography
                  variant="h4"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Our Vision
                </Typography>
                <Typography variant="body1">
                  We envision a world where everyone can have access to
                  high-quality, stylish, and comfortable footwear. We believe in
                  sustainable practices and are committed to making a positive
                  impact on our planet and our communities.
                </Typography>
              </CustomPaper>
            </Grid>
          </Grid>
          {/* <Typography
  variant="h4"
  component="h2"
  align="center"
  gutterBottom
  sx={{ mt: 8, mb: 4, fontWeight: 'bold' }}
>
  Our Stories
</Typography> */}
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{ mt: 2, mb: 2, display: { xs: "none", md: "block" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 400,
                  backgroundImage: 'url("/images/our-story.jpg")',
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  borderRadius: 1,
                  border: "0.2px solid white",
                  boxShadow:
                    "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                  mb: { xs: 2, md: 4 },
                }}
              ></Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 2, mb: 2 }}>
              <TestimonialPaper
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  p: { xs: 2, md: 0 }, // Adds padding on smaller devices for a more comfortable reading
                }}
              >
                <Typography
                  variant="h4"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Our Story
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: { xs: "justify", md: "left" },
                    hyphens: "auto", // Automatically add hyphens when necessary
                    wordWrap: "break-word", // Allow words to break and wrap onto the next line
                  }}
                >
                  Our brand was founded by two passionate individuals with a
                  dream of creating the best possible footwear. Through hard
                  work and innovation, we have become a leader in the industry,
                  known for our stylish designs, unparalleled comfort, and
                  commitment to sustainability. Our story is one of dedication,
                  persistence, and constantly pushing the boundaries to bring
                  our customers the best products possible.
                </Typography>
              </TestimonialPaper>
            </Grid>
          </Grid>
          <Typography
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mt: 8, mb: 4, fontWeight: "bold" }}
          >
            Testimonials
          </Typography>
          <Box sx={{ mt: 6, mb: 8 }}>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 } }}
            >
              <Grid item xs={12} md={4} sx={{ mt: 2, mb: 2 }}>
                {" "}
                {/* Added top and bottom margin */}
                <TestimonialPaper sx={{ height: "100%" }}>
                  <Avatar
                    src="/images/avatar1.jpg"
                    alt="Testimonial"
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    John Doe
                  </Typography>
                  <Typography variant="body2" align="center">
                    "The shoes from this brand have completely transformed my
                    walking experience. They are incredibly comfortable and
                    stylish. Highly recommended!"
                  </Typography>
                </TestimonialPaper>
              </Grid>
              <Grid item xs={12} md={4} sx={{ mt: 2, mb: 2 }}>
                {" "}
                {/* Added top and bottom margin */}
                <TestimonialPaper sx={{ height: "100%" }}>
                  <Avatar
                    src="/images/avatar2.jpg"
                    alt="Testimonial"
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    Jane Smith
                  </Typography>
                  <Typography variant="body2" align="center">
                    "I've never been happier with a pair of shoes. The quality
                    and craftsmanship are outstanding. I will definitely be a
                    repeat customer!"
                  </Typography>
                </TestimonialPaper>
              </Grid>
              <Grid item xs={12} md={4} sx={{ mt: 2, mb: 2 }}>
                {" "}
                {/* Added top and bottom margin */}
                <TestimonialPaper sx={{ height: "100%" }}>
                  <Avatar
                    src="/images/avatar3.jpg"
                    alt="Testimonial"
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    align="center"
                    sx={{ fontWeight: "bold", mb: 2 }}
                  >
                    Lisa Johnson
                  </Typography>
                  <Typography variant="body2" align="center">
                    "These shoes not only look great but also provide excellent
                    support. I've received so many compliments whenever I wear
                    them. Love them!"
                  </Typography>
                </TestimonialPaper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AboutUs;
