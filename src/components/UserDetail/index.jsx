import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function UserDetail({ loggedInUser }) {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  // Gọi backend: GET /user/:id
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [user, count] = await Promise.all([ 
          fetchModel(`/user/${userId}`),
          fetchModel(`/photosOfUser/count/${userId}`),
        ]);

        setUser(user.data);
        setCount(count.data.count);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message || "Error fetching user");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
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

  const name = user.last_name.trim();
  
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
          <Typography sx={{ mt: 2 }}>Description: {user.description}</Typography>
        )}
        {(count !== null && count !== undefined) && (
          <Typography sx={{ mt: 2 }}>The number of photos: {count}</Typography>
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
