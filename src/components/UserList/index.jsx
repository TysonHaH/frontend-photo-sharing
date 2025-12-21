import React, { useEffect, useState } from "react";
import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";  

/**
 * UserList: renders the list of users in the sidebar with links to user details
 */
function UserList() {
  const [users, setUsers] = useState([]);        // state chứa danh sách user
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchModel("/user/list");
        setUsers(data || []);
      } catch (err) {
        console.error("Error fetching user list:", err);
        setError(err.message || "Error fetching user list");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list-root">
      <Typography variant="h6" sx={{ p: 1 }}>
        Users
      </Typography>
      <Divider />
      {error && (
        <Typography color="error" sx={{ p: 1 }}>
          {error}
        </Typography>
      )}
      <List component="nav">
        {users.map((item) => {
          const id = item._id;
          const name = item.last_name; 

          return (
            <React.Fragment key={id}>
              <ListItemButton component={RouterLink} to={`/users/${id}`}>
                <ListItemText primary={name} />
              </ListItemButton>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}

export default UserList;
