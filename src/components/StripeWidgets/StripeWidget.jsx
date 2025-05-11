import React from "react";
import { Box, Typography, Button, Stack, Skeleton } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import { GoAlertFill } from "react-icons/go";
import { format } from "date-fns";

const GET_STRIPE_WIDGET_DATA = gql`
  query GetStripeWidgetData {
    stripeWidgetData {
      nextPayoutDate
      stripeConnectAccountId
      payoutAmount
      percentChange
    }
  }
`;

export const StripeWidget = () => {
  const { data, loading, error } = useQuery(GET_STRIPE_WIDGET_DATA);

  if (loading) {
    return (
      <Box
        sx={{
          border: "3px solid #FFF",
          borderRadius: 2,
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0px 0px 10px #000",
          padding: "20px",
          bgcolor: "black",
          color: "white",
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Skeleton
            variant="rectangular"
            width={150}
            height={40}
            sx={{ mb: 2 }}
          />
          <Skeleton variant="text" width={200} height={30} />
          <Skeleton variant="text" width={100} height={30} />
        </Stack>
        <Stack spacing={2} direction="column">
          <Skeleton variant="rectangular" width={129} height={40} />
          <Skeleton variant="rectangular" width={129} height={40} />
        </Stack>
      </Box>
    );
  }

  if (error) return <p>Error: {error.message}</p>;

  const formattedDate = format(new Date(data.stripeWidgetData.nextPayoutDate), "MM-dd-yyyy");

  return (
    <Box
      sx={{
        border: "3px solid #FFF",
        borderRadius: 2,
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0px 0px 10px #000",
        padding: "20px",
        bgcolor: "black",
        color: "white",
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            bgcolor: "green",
            borderRadius: "50px",
            justifyContent: "center",
            width: "150px",
            margin: "10px",
          }}
        >
          <Typography
            gutterBottom
            sx={{ mt: 1, fontSize: { xs: "14px", sm: "18px", md: "24px" } }}
          >
            {data.stripeWidgetData.percentChange}%
          </Typography>
        </Box>

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            paddingTop: "15px",
            fontSize: { xs: "14px", sm: "18px", md: "24px" },
          }}
        >
          Next Payout: {formattedDate}
        </Typography>
        <Typography
          gutterBottom
          sx={{ fontSize: { xs: "14px", sm: "18px", md: "24px" } }}
        >
          {data.stripeWidgetData.payoutAmount}
        </Typography>
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        sx={{
          width: { xs: "100%", sm: "auto" },
          alignItems: { xs: "center", sm: "flex-start" },
          mt: { xs: 2, sm: 0 },
        }}
      >
        <Button
          variant="outlined"
          size="large"
          sx={{
            color: "white",
            textAlign: "center",
          }}
          onClick={() => console.log("Navigate to statements")}
        >
          Statements
        </Button>
        <Button
          variant="outlined"
          sx={{
            width: "129px",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => console.log("Navigate to Stripe Dashboard")}
        >
          <GoAlertFill style={{ color: "red", marginRight: "8px" }} />
          Stripe
        </Button>
      </Stack>
    </Box>
  );
};
