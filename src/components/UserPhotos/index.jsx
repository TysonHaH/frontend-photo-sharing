import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Link,
  TextField,
  Box,
  Button,
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";

import "./styles.css";
import fetchModel, { postModel } from "../../lib/fetchModelData";

function formatDate(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return String(dateLike);
  return d.toLocaleString();
}

function getImageSrc(fileName) {
  if (!fileName) return null;
  return `http://localhost:8081/images/${fileName}`;
}

/**
 * UserPhotos: display all photos for a user, including comments and author links
 */
function UserPhotos() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userData, photosData] = await Promise.all([
          fetchModel(`/user/${userId}`),
          fetchModel(`/photosOfUser/${userId}`),
        ]);
        setUser(userData.data);
        setPhotos(photosData.data || []);
      } catch (err) {
        console.error("Error fetching user/photos:", err);
        setError(err.message || "Error fetching user/photos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, refresh]);

  const handleCommentChange = (photoId, event) => {
    const { value } = event.target;
    setNewComments((prev) => ({ ...prev, [photoId]: value }));
  };

  const handleCommentSubmit = async (e,photoId) => {
    e.preventDefault();
    const commentText = newComments[photoId];
    if (!commentText || !commentText.trim()) return;

    try {
      await postModel(`/commentsOfPhoto/${photoId}`, { comment: commentText });
      setNewComments((prev) => ({ ...prev, [photoId]: "" }));
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to add comment: " + (err.message || "Unknown error"));
    }
  };

  if (loading) {
    return <Typography variant="h6">Loading photos...</Typography>;
  }

  if (error || !user) {
    return (
      <Typography variant="h6" color="error">
        {error ? error : `User with id ${String(userId)} not found.`}
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {user.last_name}'s Photos
      </Typography>

      {photos.length === 0 && (
        <Typography color="textSecondary">No photos for this user.</Typography>
      )}

      <Grid container spacing={2}>
        {photos.map((p) => {
          const photoId = p._id;
          const imgSrc = getImageSrc(p.file_name);
          const photoDate = formatDate(p.date_time);
          const comments = p.comments || [];

          return (
            <Grid item xs={12} md={6} key={photoId}>
              <Card>
                {imgSrc && (
                  <CardMedia
                    component="img"
                    image={imgSrc}
                    alt={p.file_name}
                    height="350"
                  />
                )}
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created: {photoDate}
                  </Typography>
                  <Divider sx={{ my: 1 }} />

                  <Typography variant="subtitle1">Comments</Typography>
                  {comments.length === 0 && (
                    <Typography color="textSecondary">No comments</Typography>
                  )}
                  {comments.map((c) => {
                    const author = c.user || null;
                    const authorId = author ? author._id : null;
                    const authorName = author.last_name
                    const commentDate = formatDate(c.date_time);
                    return (
                      <div key={c._id} style={{ marginTop: 8 }}>
                        <Typography variant="body2" color="textSecondary">
                          {commentDate}
                        </Typography>
                        <Typography variant="body2">
                          <Link component={RouterLink} to={`/users/${authorId}`}>
                            {authorName}
                          </Link>
                          {": "}
                          {c.comment}
                        </Typography>
                      </div>
                    );
                  })}

                  <Box 
                    component="form" 
                    onSubmit={(e) => handleCommentSubmit(e, photoId)} 
                    sx={{ 
                      display: "flex",       
                      alignItems: "center",  
                      gap: 1,                
                      marginTop: 2           
                    }}
                  >
                    <TextField
                      label="Add a comment"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={newComments[photoId] || ""}
                      onChange={(e) => handleCommentChange(photoId, e)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!newComments[photoId] || !newComments[photoId].trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default UserPhotos;
