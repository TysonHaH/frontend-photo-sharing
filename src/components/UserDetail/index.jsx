import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi backend: GET /user/:id
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError(err.message || "Error fetching user");
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">Loading user...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">User not found</Typography>
          <Typography color="textSecondary">
            {error ? error : `No user with id ${String(userId)} exists.`}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        {user.location && (
          <Typography color="textSecondary">Location: {user.location}</Typography>
        )}
        {user.occupation && (
          <Typography>Occupation: {user.occupation}</Typography>
        )}
        {user.description && (
          <Typography sx={{ mt: 2 }}>{user.description}</Typography>
        )}

        <Button
          component={RouterLink}
          to={`/photos/${user._id}`}
          variant="contained"
          sx={{ mt: 2 }}
        >
          View Photos
        </Button>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
