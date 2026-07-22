import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Avatar,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  Collapse,
} from "@mui/material";
import { FiSend, FiArrowLeft, FiDollarSign, FiX } from "react-icons/fi";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import PriceProposalBubble from "./PriceProposalBubble";

const Chat = ({
  messages,
  sendMessage,
  proposePrice,
  isSending,
  setIsSending,
  isProposing,
  currentUser,
  otherUserName,
}) => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [priceAmount, setPriceAmount] = useState("");
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const priceInputRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSending]);

  useEffect(() => {
    if (showPriceInput && priceInputRef.current) {
      priceInputRef.current.focus();
    }
  }, [showPriceInput]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      setIsSending(true);
      try {
        await sendMessage(newMessage.trim());
        setNewMessage("");
        inputRef.current?.focus();
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleProposePrice = async () => {
    const amount = parseFloat(priceAmount);
    if (!amount || amount <= 0) return;
    try {
      await proposePrice(amount);
      setShowPriceInput(false);
      setPriceAmount("");
    } catch (err) {
      console.error("Failed to propose price:", err);
    }
  };

  const initials = otherUserName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2.5,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <IconButton size="small" onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
        </IconButton>
        <Avatar sx={{ width: 36, height: 36, bgcolor: "#D4AC0D", fontSize: "0.8rem", fontWeight: 700 }}>
          {initials || "?"}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
            {otherUserName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Chat
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {messages.map((message) => {
          const isMine = message.senderId === currentUser;
          const isPriceProposal = message.type === "PRICE_PROPOSAL";

          if (isPriceProposal) {
            return (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 1,
                  flexDirection: isMine ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: isMine ? "#D4AC0D" : "grey.500",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {isMine ? "M" : initials || "?"}
                </Avatar>
                <PriceProposalBubble metadata={message.metadata} isMine={isMine} />
              </Box>
            );
          }

          return (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 1,
                flexDirection: isMine ? "row-reverse" : "row",
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: isMine ? "#D4AC0D" : "grey.500",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {isMine ? "M" : initials || "?"}
              </Avatar>
              <Box sx={{ maxWidth: "70%", minWidth: 80 }}>
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: isMine ? "#D4AC0D" : "background.paper",
                    color: isMine ? "#000" : "text.primary",
                    borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                </Paper>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ display: "block", mt: 0.25, textAlign: isMine ? "right" : "left", px: 0.5 }}
                >
                  {message.createdAt ? format(new Date(Number(message.createdAt)), "h:mm a") : ""}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messageEndRef} />
      </Box>

      <Box sx={{ px: 2.5, py: 2, borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
        <Collapse in={showPriceInput}>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "center" }}>
            <TextField
              inputRef={priceInputRef}
              size="small"
              type="number"
              value={priceAmount}
              onChange={(e) => setPriceAmount(e.target.value)}
              placeholder="Enter amount..."
              InputProps={{
                startAdornment: (
                  <Typography sx={{ mr: 0.5, fontWeight: 600, color: "text.secondary" }}>$</Typography>
                ),
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": { borderRadius: 3 },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleProposePrice();
              }}
            />
            <Button
              onClick={handleProposePrice}
              disabled={!priceAmount || parseFloat(priceAmount) <= 0 || isProposing}
              sx={{
                bgcolor: "#FFD100",
                color: "#000",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                minWidth: 80,
                "&:hover": { bgcolor: "#E6BC00" },
                "&:disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
              }}
            >
              {isProposing ? <CircularProgress size={18} sx={{ color: "#000" }} /> : "Send"}
            </Button>
            <IconButton size="small" onClick={() => { setShowPriceInput(false); setPriceAmount(""); }}>
              <FiX size={18} />
            </IconButton>
          </Box>
        </Collapse>

        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            disabled={isSending}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
          <Button
            onClick={() => setShowPriceInput((v) => !v)}
            sx={{
              minWidth: 44,
              height: 44,
              bgcolor: showPriceInput ? "#FFD100" : "transparent",
              color: showPriceInput ? "#000" : "text.secondary",
              borderRadius: 2,
              border: "1px solid",
              borderColor: showPriceInput ? "#FFD100" : "divider",
              "&:hover": { bgcolor: showPriceInput ? "#E6BC00" : "action.hover" },
            }}
          >
            <FiDollarSign size={18} />
          </Button>
          <IconButton
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending}
            sx={{
              bgcolor: "#FFD100",
              color: "#000",
              borderRadius: 2,
              width: 44,
              height: 44,
              "&:hover": { bgcolor: "#E6BC00" },
              "&:disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
            }}
          >
            {isSending ? <CircularProgress size={20} sx={{ color: "#000" }} /> : <FiSend size={18} />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
