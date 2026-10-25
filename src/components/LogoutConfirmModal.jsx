import { useId, useRef, useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
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
    } finally {
      // Also handles a rejected signOut or a missing Clerk redirect.
      window.location.replace("/");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={isSigningOut}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          color: colors.textPrimary,
          border: `1px solid ${colors.borderSecondary}`,
        },
      }}
    >
      <DialogTitle id={titleId}>Log out?</DialogTitle>

      <DialogContent>
        <DialogContentText id={descriptionId} sx={{ color: "inherit" }}>
          Are you sure you want to log out of Sneaker Society?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={isSigningOut}
          autoFocus
          sx={{
            color: colors.textPrimary,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={isSigningOut}
          sx={{ textTransform: "none" }}
        >
          {isSigningOut ? "Logging out…" : "Log out"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutConfirmModal;
