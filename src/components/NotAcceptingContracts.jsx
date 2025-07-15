import { Box, Typography, Button } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useNavigate } from "react-router-dom";

export default function NotAcceptingContracts() {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "black",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    border: "10px solid #FFD700",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 180,
                    height: 180,
                    mb: 4,
                }}
            >
                <WarningAmberIcon sx={{ fontSize: 120, color: "#FFD700" }} />
            </Box>
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mb: 4, textAlign: "center", fontSize: "1.5rem" }}>
                This member is not currently accepting new contracts
            </Typography>
            <Button
                onClick={() => navigate("/")}
                sx={{
                    bgcolor: "#222",
                    color: "white",
                    fontWeight: "bold",
                    border: "2px solid #FFD700",
                    borderRadius: 2,
                    px: 5,
                    py: 1.5,
                    fontSize: "1.2rem",
                    boxShadow: "0 4px #FFD700",
                    '&:hover': { bgcolor: "#333" },
                }}
            >
                Go Home
            </Button>
        </Box>
    );
} 