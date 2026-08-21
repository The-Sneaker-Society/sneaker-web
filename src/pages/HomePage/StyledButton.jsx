import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme }) => ({
  minHeight: 48,
  padding: theme.spacing(0, 3),
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: `8px 8px 0 ${theme.palette.primary.main}`,

  transition: theme.transitions.create(
    ["background-color", "box-shadow", "transform"],
    {
      duration: theme.transitions.duration.short,
    },
  ),

  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    boxShadow: `4px 4px 0 ${theme.palette.primary.main}`,
    transform: "translate(4px, 4px)",
  },

  "&:active": {
    backgroundColor: theme.palette.action.selected,
    boxShadow: "none",
    transform: "translate(8px, 8px)",
  },

  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
    outlineOffset: 3,
  },

  "&.Mui-disabled": {
    boxShadow: "none",
  },

  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(0, 5),
  },
}));

export default StyledButton;
