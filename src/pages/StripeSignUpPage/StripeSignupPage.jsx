import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { FaStripe } from "react-icons/fa";

export default function StripeSignupPage() {
  // TODO get the stripe link query
  const loading = false;

  const redirectToSripe = () => {
    window.location.href = "https://www.stripe.com";
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth="md" sx={{ height: "100vh" }}>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography pb={4} variant="h1">
          Sign up with Stripe
        </Typography>
        <Typography variant="h6">
          Here at the Sneaker Society we use stripe for all transactions and
          payouts.
        </Typography>

        <Box sx={{ paddingTop: 3 }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<FaStripe />}
            style={{ textTransform: "none" }}
            onClick={redirectToSripe}
          >
            Go to
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
