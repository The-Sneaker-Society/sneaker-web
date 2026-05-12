import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { FiSend, FiMessageCircle, FiDollarSign, FiTruck, FiTool, FiCheck, FiPackage, FiSmile } from "react-icons/fi";

const STEPS = [
  { icon: <FiSend size={24} />, label: "Submit request", desc: "Tell us about your sneakers and upload photos" },
  { icon: <FiMessageCircle size={24} />, label: "Member reviews", desc: "A member reviews your request and details" },
  { icon: <FiDollarSign size={24} />, label: "Agree on price", desc: "Discuss and agree on the service price" },
  { icon: <FiTruck size={24} />, label: "Ship them off", desc: "Send your sneakers to the member" },
  { icon: <FiTool size={24} />, label: "Work begins", desc: "The member works on your sneakers with progress updates" },
  { icon: <FiCheck size={24} />, label: "Work completed", desc: "Repairs are finished and quality checked" },
  { icon: <FiPackage size={24} />, label: "Shipped back", desc: "Your sneakers are on their way back to you" },
  { icon: <FiSmile size={24} />, label: "Enjoy", desc: "Rock your fresh sneakers" },
];

const TimelineCarousel = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % STEPS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, minHeight: 140, position: "relative", overflow: "hidden" }}>
      {STEPS.map((item, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            position: "absolute",
            width: "100%",
            transition: "transform 0.4s ease, opacity 0.4s ease",
            transform: `translateX(${(i - idx) * 120}%)`,
            opacity: i === idx ? 1 : 0,
          }}
        >
          <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "common.white" }}>
            {item.icon}
          </Box>
          <Typography variant="h6" fontWeight={700}>
            {item.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
            {item.desc}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TimelineCarousel;
