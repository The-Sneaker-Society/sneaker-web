import React, { useState, useEffect } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CarouselContainer = styled(Paper)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "500px",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const ImageContainer = styled(Box)({
  position: "absolute",
  width: "100%",
  height: "100%",
  display: "flex",
  transition: "transform 0.5s ease-in-out",
});

const CarouselImage = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
}));

const DotContainer = styled(Box)({
  position: "absolute",
  bottom: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "8px",
});

const Dot = styled(Box)(({ active }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: active ? "#fff" : "rgba(255, 255, 255, 0.5)",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
}));

const ImageCarousel = ({
  images = [],
  autoPlayInterval = 5000,
  pauseOnHover = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const dummyImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
  ];

  const displayImages = images.length > 0 ? images : dummyImages;

  useEffect(() => {
    let interval;
    if (autoPlayInterval && !isPaused) {
      interval = setInterval(() => {
        handleNext();
      }, autoPlayInterval);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, autoPlayInterval]);

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };

  return (
    <CarouselContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Image carousel"
    >
      <ImageContainer
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayImages.map((image, index) => (
          <CarouselImage
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1594322436404-5a0526db4d13";
              console.warn(`Failed to load image: ${image}`);
            }}
          />
        ))}
      </ImageContainer>

      <NavigationButton
        onClick={handlePrev}
        style={{ left: "10px" }}
        aria-label="Previous slide"
      >
        <FaChevronLeft color="white" />
      </NavigationButton>

      <NavigationButton
        onClick={handleNext}
        style={{ right: "10px" }}
        aria-label="Next slide"
      >
        <FaChevronRight color="white" />
      </NavigationButton>

      <DotContainer>
        {displayImages.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => handleDotClick(index)}
            role="button"
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </DotContainer>
    </CarouselContainer>
  );
};

export default ImageCarousel;
