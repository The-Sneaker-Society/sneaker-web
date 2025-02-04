import React, { useEffect } from "react";
import { Box } from "@mui/material";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useQuery } from "@apollo/client";
import { TEST_QUERY } from "../../context/graphql/testQuery";

export const LoginV2 = () => {
  const { data, loading } = useQuery(TEST_QUERY);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <Box>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </Box>
  );
};
