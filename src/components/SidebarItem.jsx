import React from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@mui/material";
import { useColors } from "../theme/colors";

const SidebarItem = ({ text, icon, notification, onClick }) => {
  const colors = useColors();

  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        borderRadius: 2,
        "&:hover": {
          boxShadow: 3,
        },
        cursor: "pointer",
      }}
    >
      <ListItemIcon sx={{ color: colors.sidebarText }}>
        <Badge badgeContent={notification || 0} color="error">
          {icon}
        </Badge>
      </ListItemIcon>
      <ListItemText sx={{ color: colors.sidebarText }} primary={text} />
    </ListItem>
  );
};

export default SidebarItem;
