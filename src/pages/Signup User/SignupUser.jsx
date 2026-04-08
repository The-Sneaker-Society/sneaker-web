import { Box, Link } from "@mui/material";
import React from "react";
import Logo from "../../assets/ss-logo.svg";
import { SignUp } from "@clerk/clerk-react";

export default function SignupUser() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "black",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Link href="/" underline="none" sx={{ textAlign: "center", width: "100%" }}>
          <Box
            component="img"
            src={Logo}
            alt="Logo"
            sx={{
              width: "80%",
              maxWidth: "300px",
              height: "auto",
              my: 4,
              cursor: "pointer",
            }}
          />
        </Link>
        <SignUp
          routing="path"
          path="/user/signup"
          signInUrl="/login"
          afterSignInUrl="/user/dashboard"
          afterSignUpUrl="/user/signup/callback"
          unsafeMetadata={{ role: "client" }}
          appearance={{
            layout: {
              logoPlacement: "none",
              showOptionalFields: false,
            },
            variables: {
              colorBackground: "#1a1a1a",
              colorInputBackground: "#2a2a2a",
              colorInputText: "#ffffff",
              colorText: "#ffffff",
              colorTextSecondary: "#888888",
              colorPrimary: "#d4af37",
              borderRadius: "8px",
              fontFamily: "inherit",
            },
            elements: {
              card: {
                backgroundColor: "#1a1a1a",
                boxShadow: "none",
                border: "1px solid #333",
              },
              headerTitle: {
                color: "#ffffff",
                fontWeight: "600",
              },
              headerSubtitle: {
                color: "#888888",
              },
              formButtonPrimary: {
                backgroundColor: "#d4af37",
                color: "#000000",
                width: "100%",
                "&:hover": {
                  backgroundColor: "#c5a032",
                },
              },
              socialButtonsBlockButton: {
                width: "100%",
                backgroundColor: "#2a2a2a",
                color: "#ffffff",
                border: "1px solid #444",
                "&:hover": {
                  backgroundColor: "#333",
                },
              },
              dividerLine: {
                backgroundColor: "#444",
              },
              dividerText: {
                color: "#888888",
              },
              formFieldInput: {
                backgroundColor: "#2a2a2a",
                color: "#ffffff",
                border: "1px solid #444",
              },
              formFieldLabel: {
                color: "#888888",
              },
              footerActionText: {
                color: "#888888",
              },
              footerActionLink: {
                color: "#d4af37",
                "&:hover": {
                  color: "#c5a032",
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
