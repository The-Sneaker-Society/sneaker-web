import React from "react";
import { ListItem, ListItemIcon, ListItemText, Badge } from "@mui/material";

const SidebarItem = ({ text, icon, notification }) => (
  <ListItem
    button
    sx={{
      borderRadius: 2, 
      "&:hover": {
        boxShadow: 3, 
      },
      cursor: 'pointer'
    }}
  >
    <ListItemIcon s sx={{ color: "black" }}>
      <Badge badgeContent={notification || 0} color="error">
        {icon}
      </Badge>
    </ListItemIcon>
    <ListItemText sx={{ color: "black" }} primary={text} />
  </ListItem>
);

export default SidebarItem;
