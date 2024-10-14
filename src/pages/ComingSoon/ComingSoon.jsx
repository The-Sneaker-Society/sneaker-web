import {
  Box,
  Stack,
  Typography,
  InputBase,
  Button,
  Alert,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import Logo from "../../assets/ss-logo.svg";
import { useState } from "react";
import { CREATE_EMAIL } from "../ComingSoon/graphql/addEmail";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

export default function ComingSoon() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [createEmail, { data, loading }] = useMutation(CREATE_EMAIL);

  const fadeInFirst = keyframes`
0% {
//   transform: rotate(-22deg);
opacity: 0;
}
100% {
    // transform: rotate(40deg);
opacity: 1;
}
`;

  const fadeInSecond = keyframes`

0%,50% {
//   transform: rotate(-22deg);
opacity: 0;
}
100% {
    // transform: rotate(40deg);
opacity: 1;
} 
`;
  const LogoAnimationDiv = styled("div")({
    animation: `${fadeInFirst} 1.5s ease-in`,
  });

  const InputAnimationDiv = styled("div")({
    animation: `${fadeInSecond} 2s ease-in-out`,
  });

  return (
    <Box sx={{ bgcolor: "background.default", height: "100vh" }}>
      <Stack alignItems="center" spacing={3} pb={7} width="auto">
        <a href="/">
          <img src={Logo} style={{ height: "30vh", width: "auto" }} />
        </a>
        <Typography
          variant="h4"
          fontStyle="italic"
          color="white"
          textAlign="center"
          width="38vh"
          fontSize="2.6vh"
        >
          Our mission is to create a platform that will cultivate a community of
          sneakerheads by giving them the power to market their brand and manage
          their business.
        </Typography>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="white"
          textAlign="center"
          fontSize="1.7rem"
        >
          Join the waitlist below
        </Typography>

        <Stack
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <InputBase
            style={{
              border: "solid white",
              borderRadius: "0.2rem",
              minWidth: "25vh",
              background: "white",
            }}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputBase
            style={{
              border: "solid white",
              borderRadius: "0.2rem",
              minWidth: "25vh",
              background: "white",
            }}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await createEmail({
                  variables: {
                    data: {
                      name: name,
                      email: email,
                    },
                  },
                });
                navigate("/confirmationPage");
              } catch (e) {
                console.log(e);
                setErrorMessage(e.message);
              }
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Stack>
      {errorMessage ? (
        <Alert severity="error" color="error">
          {errorMessage}
        </Alert>
      ) : null}
    </Box>
  );
}
