import React from "react";
import { styled } from "@mui/system";

const CustomButton = styled("button")({
  alignItems: "center",
  backgroundColor: "black",
  border: "2px solid #111",
  borderRadius: "8px",
  borderColor: "white",
  boxSizing: "border-box",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  height: "48px",
  justifyContent: "center",
  lineHeight: "24px",
  maxWidth: "100%",
  padding: "0 25px",
  position: "relative",
  textAlign: "center",
  textDecoration: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  touchAction: "manipulation",
  marginRight: "15px",
  "&:after": {
    backgroundColor: "#FFD100",
    borderRadius: "8px",
    content: '""',
    display: "block",
    height: "48px",
    left: 0,
    width: "100%",
    position: "absolute",
    top: "-2px",
    transform: "translate(8px, 8px)",
    transition: "transform .2s ease-out",
    zIndex: "-1",
  },
  "&:hover:after": {
    transform: "translate(0, 0)",
  },
  "&:active": {
    backgroundColor: "#ffdeda",
    outline: 0,
  },
  "&:hover": {
    outline: 0,
  },
  "@media (min-width: 768px)": {
    padding: "0 40px",
  },
});

function StyledButton({ children, onClick, ...props }) {
  // Destructure onClick from props
  return (
    <CustomButton onClick={onClick} {...props}>
      {children}
    </CustomButton>
  ); // Pass onClick to CustomButton
}

export default StyledButton;
