import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Link,
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";   

function formatDate(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return String(dateLike);
  return d.toLocaleString();
}

function getImageSrc(fileName) {
  if (!fileName) return null;
  try {
    // Require the image from the bundled src/images directory
    // Webpack will handle bundling these assets.
    return require(`../../images/${fileName}`);
  } catch (e) {
    return null;
  }
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

  // Gọi backend: /user/:id và /photosOfUser/:id
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Promise.all để fetch song song user + photos
    Promise.all([
      fetchModel(`/user/${userId}`),
      fetchModel(`/photosOfUser/${userId}`),
    ])
      .then(([userData, photosData]) => {
        setUser(userData);
        setPhotos(photosData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user/photos:", err);
        setError(err.message || "Error fetching user/photos");
        setLoading(false);
      });
  }, [userId]);

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
        {user.first_name} {user.last_name}'s Photos
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
                    const author = c.user || null; // backend trả về user rút gọn
                    const authorId = author ? author._id : null;
                    const authorName = author
                      ? `${author.first_name || ""} ${
                          author.last_name || ""
                        }`.trim()
                      : "Unknown";
                    const commentDate = formatDate(c.date_time);
                    return (
                      <div key={c._id} style={{ marginTop: 8 }}>
                        <Typography variant="body2" color="textSecondary">
                          {commentDate}
                        </Typography>
                        <Typography variant="body2">
                          {authorId ? (
                            <Link component={RouterLink} to={`/users/${authorId}`}>
                              {authorName}
                            </Link>
                          ) : (
                            <>{authorName}</>
                          )}
                          {": "}
                          {c.comment}
                        </Typography>
                      </div>
                    );
                  })}
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
