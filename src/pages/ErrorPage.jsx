import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StyledButton from "./HomePage/StyledButton";
import Logo from "../../assets/SNEAKER SOCIETY (Transparency).png";

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="Logo"
        sx={{
          width: "500px",
          height: "auto",
          display: "block",
          margin: 0,
          padding: "0",
          "@media (max-width:600px)": {
            width: "300px",
          },
        }}
      />

      <Typography
        sx={{
          fontSize: "24px",
          marginBottom: "24px",
          fontWeight: "500",
          "@media (max-width:600px)": {
            fontSize: "22px",
          },
        }}
      >
        Looks like this page does not exist!
      </Typography>

      <StyledButton onClick={handleGoHome}>Go Home</StyledButton>
    </Box>
  );
}
