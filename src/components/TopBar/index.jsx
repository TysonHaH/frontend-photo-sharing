import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Link } from "@mui/material";

import "./styles.css";
import { postModel } from "../../lib/fetchModelData";

/**
 * TopBar: app header that shows app name on the left and context on the right
 * (e.g. user name or "Photos of {user}") depending on the route.
 */
function TopBar({ loggedInUser, setLoggedInUser }) {
  const handleLogout = async () => {
    try {
      await postModel("/admin/logout");
      setLoggedInUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          <Link component={RouterLink} to="/" color="inherit" underline="none">
            Ha hoang Quan Photo Sharing Site
          </Link>
        </Typography>
        
        <Typography variant="subtitle1" color="inherit" sx={{ marginLeft: "auto", marginRight: 2 }}>
          {loggedInUser ? (
            <>
              Hi{", "}
              <Link component={RouterLink} to={`/users/${loggedInUser._id}`} color="inherit">
                {loggedInUser.last_name}
              </Link>
            </>
          ) : (
            "Please Login or Sign up"
          )}  
        </Typography>
        {loggedInUser && (
          <Button color="inherit" component={RouterLink} to={`/add-photo/${loggedInUser._id}`} sx={{ marginRight: 2 }}>
            Post A Photo
          </Button>
        )}
        {loggedInUser && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
