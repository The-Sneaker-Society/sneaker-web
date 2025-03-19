import React, { useRef } from "react";
import { Box, Container } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export const ImageCarousel = ({ images }) => {
  const carouselRef = useRef(null);

  return (
    <Container>
      <Box my={8} position="relative">
        <Carousel showThumbs={false} ref={carouselRef}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </Carousel>
      </Box>
    </Container>
  );
};
