import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import {
  useSignUp,
  useClerk,
  SignUp,
  SignedIn,
  UserButton,
  SignedOut,
} from "@clerk/clerk-react";
import { useQuery } from "@apollo/client";
import { TEST_QUERY } from "../../context/graphql/testQuery";

export const LoginV2 = () => {
  const { data, loading } = useQuery(TEST_QUERY);

  const { isLoaded, signUp } = useSignUp();
  const { openSignup } = useClerk();

  if (!isLoaded) {
    // Handle loading state
    return <>Loading...</>;
  }

  const handleGoogleSignUp = async () => {
    try {
      // Start Google OAuth signup
      const { createdSessionId } = await signUp.create({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/auth/callback", // Redirect after OAuth
        // publicMetadata: { role: "member" }, // Assign "member" role
      });

      // If session was created instantly (some users are auto-signed in)
      if (createdSessionId) {
        window.location.reload(); // Refresh authentication
      }
    } catch (err) {
      console.error("Signup Error:", err);
    }
  };

  return (
    <div>
      The current sign-up attempt status is {signUp?.status}.
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignUp fallbackRedirectUrl="/test" unsafeMetadata={{ role: "ello" }} />
      </SignedOut>
      {/* <Button onClick={handleGoogleSignUp} variant="contained">
        Signup Member
      </Button> */}
    </div>
  );
};
