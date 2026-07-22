import React from "react";
import { Dialog, DialogContent, IconButton, Box } from "@mui/material";
import { FiX } from "react-icons/fi";

const ImagePreviewDialog = ({ open, url, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="lg"
    sx={{ "& .MuiDialog-paper": { m: "auto", position: "absolute" } }}
  >
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, zIndex: 1, bgcolor: "rgba(0,0,0,0.5)", color: "white", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}
      >
        <FiX size={24} />
      </IconButton>
      <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 0 }}>
        <Box
          component="img"
          src={url}
          alt="Preview"
          sx={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain" }}
        />
      </DialogContent>
    </Box>
  </Dialog>
);

export default ImagePreviewDialog;
