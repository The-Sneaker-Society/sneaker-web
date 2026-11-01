import { useId, useRef, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Modal, Box, Typography } from "@mui/material";
import StyledButton from "../pages/HomePage/StyledButton";
import { useColors } from "../theme/colors";

const LogoutConfirmModal = ({ open, onClose }) => {
  const { signOut } = useClerk();
  const colors = useColors();

  const titleId = useId();
  const descriptionId = useId();

  const signingOutRef = useRef(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleClose = () => {
    if (signingOutRef.current) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (signingOutRef.current) return;

    signingOutRef.current = true;
    setIsSigningOut(true);

    try {
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Unable to complete sign-out:", error);
      window.location.replace("/");
    }
  };

  const buttonSx = {
    mr: 0,
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&:focus-visible": {
      outline: "3px solid #FFD100",
      outlineOffset: "4px",
    },
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={isSigningOut}
    >
      <Box
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={isSigningOut}
        tabIndex={-1}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 32px)",
          maxWidth: 480,
          maxHeight: "calc(100dvh - 32px)",
          overflowY: "auto",
          boxSizing: "border-box",
          bgcolor: "background.paper",
          color: colors.textPrimary,
          border: `1px solid ${colors.borderSecondary}`,
          borderRadius: "16px",
          boxShadow: 24,
          p: { xs: 3, sm: 4 },
        }}
      >
        <Typography
          id={titleId}
          variant="h6"
          component="h2"
          sx={{ fontWeight: "bold" }}
        >
          Log out?
        </Typography>

        <Typography id={descriptionId} sx={{ mt: 2 }}>
          Are you sure you want to log out of Sneaker Society?
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 3,
            mt: 4,
            pb: 1,
            pr: 1,
            isolation: "isolate",
          }}
        >
          <StyledButton
            type="button"
            onClick={handleClose}
            disabled={isSigningOut}
            autoFocus
            sx={buttonSx}
          >
            Cancel
          </StyledButton>

          <StyledButton
            type="button"
            onClick={handleConfirm}
            disabled={isSigningOut}
            sx={buttonSx}
          >
            {isSigningOut ? "Logging out…" : "Log out"}
          </StyledButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default LogoutConfirmModal;
