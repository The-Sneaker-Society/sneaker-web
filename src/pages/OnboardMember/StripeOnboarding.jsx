import { Container } from "@mui/material";
import { StripeSetUpWidget } from "../../components/StripeWidgets/StripeSetUpWidget";

export const StripeOnobarding = () => {
  return (
    <Container
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", alignItems: "start" }}
    >
      <StripeSetUpWidget />
    </Container>
  );
};
