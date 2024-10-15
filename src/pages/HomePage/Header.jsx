import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Hidden from "@mui/material/Hidden";
import Tabs from "@mui/material/Tabs";
import { Tab } from "@mui/material";
import Sneakers from "../../../assets/sneakers-header.png";
import StyledButton from "./StackedButton";

const Header = ({ pricingRef, contactRef, featureRef, onButtonClick }) => {
  return (
    <>
      <AppBar position="sticky" style={{ zIndex: 9999, background: "black" }}>
        <Toolbar
          style={{
            minHeight: "120px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Hidden smdown>
            <img
              src={Sneakers}
              alt="Logo"
              style={{ height: 50 }}
              sx={{ flexGrow: 1 }}
            />
          </Hidden>
          <Hidden mdDown>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Tabs textColor="inherit">
                <Tab label="Features" onClick={featureRef} />
                <Tab label="Pricing" onClick={pricingRef} />
                <Tab label="Contact" onClick={contactRef} />
              </Tabs>
              <StyledButton style={{}} onClick={onButtonClick}>
                Login
              </StyledButton>
              <StyledButton onClick={onButtonClick}>Sign Up</StyledButton>
            </div>
          </Hidden>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
