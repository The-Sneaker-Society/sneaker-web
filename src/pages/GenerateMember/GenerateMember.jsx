import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { gql, useMutation } from "@apollo/client"; // Make sure to import useMutation
import { CircularProgress, Box, Typography, Alert } from "@mui/material"; // For UI feedback

// This GraphQL mutation should be designed on your backend
// to accept at least clerkId and email for initial member creation.
// Other fields in CreateMemberInput should be optional for this initial step.
const CREATE_MEMBER_MUTATION = gql`
  mutation CreateMember($data: CreateMemberInput!) {
    createMember(data: $data) {
      id
    }
  }
`;

export const GenerateMember = () => {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const [createMember, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_MEMBER_MUTATION, {
      onCompleted: () => {
        navigate("/member/signup-info", { replace: true });
      },
      onError: (err) => {
        console.error("Error initializing member in DB:", err);
        // Check if it's a duplicate error (if your backend sends a specific code/message)
        if (
          err.message.includes("already exists") ||
          err.message.includes("duplicate key")
        ) {
          // Adjust based on your actual error message
          console.warn(
            "Member likely already exists. Navigating to signup-info."
          );
          navigate("/member/onboarding", { replace: true }); 
        } else {
          setErrorMessage(
            `Failed to initialize your account: ${err.message}. Please try again or contact support.`
          );
        }
      },
    });

  useEffect(() => {
    if (
      isClerkLoaded &&
      user &&
      user.id &&
      user.primaryEmailAddress?.emailAddress
    ) {
      // Prepare the minimal data for initial member creation
      const initialMemberData = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        // If you set publicMetadata during Clerk signup (e.g., for role), include it here:
        // role: user.publicMetadata?.role || 'member', // Default role if not set

        // DO NOT include firstName, lastName, address etc. here,
        // as those are typically collected in the *next* step (e.g., /member/signup-info).
        // This component's job is just to create the basic DB record.
      };

      createMember({
        variables: {
          data: initialMemberData,
        },
      }).catch((err) => {
        // This catch is for network errors or other issues not caught by useMutation's onError
        // though typically Apollo Client's onError handles most GraphQL errors.
        console.error(
          "Network or unexpected error during createMember call:",
          err
        );
        setErrorMessage(
          `An unexpected network error occurred: ${err.message}. Please try again.`
        );
      });
    } else if (isClerkLoaded && !user) {
      // This case should ideally not be hit if routes are protected,
      // but as a fallback, redirect to login.
      console.warn(
        "GenerateMember: Clerk user not found after Clerk has loaded. Redirecting to login."
      );
      navigate("/login", { replace: true });
    }
    // `createMember` is stable from useMutation and generally doesn't need to be in the dependency array
    // if its identity doesn't cause re-runs.
  }, [user, isClerkLoaded, navigate, createMember]);

  // UI Feedback
  if (!isClerkLoaded || mutationLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          Initializing your Sneaker Society account...
        </Typography>
      </Box>
    );
  }

  if (errorMessage) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        padding={3}
        textAlign="center"
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
        <button onClick={() => navigate("/login", { replace: true })}>
          Go to Login
        </button>
      </Box>
    );
  }

  // Fallback/waiting for useEffect to process user data
  if (isClerkLoaded && !user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography>Finalizing session...</Typography>
        <CircularProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  // If the component renders and useEffect hasn't redirected yet (e.g. user object is briefly null but isClerkLoaded is true),
  // you might show a generic loading or placeholder.
  // The primary loading state is handled by `!isClerkLoaded || mutationLoading`.
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography>Preparing your account...</Typography>
    </Box>
  );
};
