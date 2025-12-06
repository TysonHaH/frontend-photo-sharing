import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useMatch } from "react-router-dom";

import "./styles.css";
import models from "../../modelData/models";

/**
 * TopBar: app header that shows app name on the left and context on the right
 * (e.g. user name or "Photos of {user}") depending on the route.
 */
function TopBar() {
  // Try to match the detail and photos routes
  const userMatch = useMatch("/users/:userId");
  const photosMatch = useMatch("/photos/:userId");

  let rightText = null;
  try {
    if (userMatch && userMatch.params && userMatch.params.userId) {
      const u = models.userModel(userMatch.params.userId);
      if (u) {
        rightText = `${u.first_name || ""} ${u.last_name || ""}`.trim();
      }
    } else if (photosMatch && photosMatch.params && photosMatch.params.userId) {
      const u = models.userModel(photosMatch.params.userId);
      if (u) {
        rightText = `Photos of ${u.first_name || ""} ${u.last_name || ""}`.trim();
      }
    }
  } catch (e) {
    // defensive: if models or matching fails, leave rightText null
    rightText = null;
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          Ha hoang Quan Photo Sharing Site
        </Typography>

        {rightText && (
          <Typography variant="subtitle1" color="inherit" sx={{ marginLeft: "auto" }}>
            {rightText}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
