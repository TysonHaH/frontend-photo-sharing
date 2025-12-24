import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  CardMedia,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { useNavigate, useParams  } from "react-router-dom";
function PostPhoto({loggedInUser}){
    const {userId} = useParams();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        setSelectedFile(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!selectedFile) {
            setError("Choose an image.");
            return;
        }
        const formData = new FormData();
        formData.append("photo", selectedFile);
        
        try {
            await fetch("http://localhost:8081/photosOfUser/new", {
            method: "POST",
            body: formData, 
            credentials: "include",
            });
          console.log("Success uploading");
          navigate(`/photos/${userId}`)
        } catch (err) {
          console.error("Error:", err);
          setError(err.message || "Upload failed");
        }
    };
    if(userId !== loggedInUser._id){
        
        return(
        <Card>
            <CardContent>
                <Alert severity="error" sx={{mb:2}}>You are not permitted to do this</Alert>
            </CardContent>
        </Card>
        );
    }
    return(
        <Card>
        <CardContent>
            {error &&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}
            {selectedFile && (
            <>
            <CardMedia
                component="img"
                height="300"
                image={URL.createObjectURL(selectedFile)}
                alt="Selected file preview"
                sx={{ objectFit: 'contain', objectPosition: 'left', }} 
            />
            <Typography 
                variant="body1" 
                color="text.secondary" 
            >
                Selected: <strong>{selectedFile.name}</strong>
            </Typography>
            </>
            )}
            <Typography variant="h5" gutterBottom>Post a Photo</Typography>
                <Box component="form" sx={{ mt: 2 }} onSubmit={handleSubmit}>
                    <Button variant="outlined" component="label" sx={{ mb: 2, mr: 2 }}>
                        Choose a photo
                        <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        />
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!selectedFile}
                        sx={{ mb: 2 }}
                    >Post</Button>
                </Box>
        </CardContent>
    </Card>
    );
}
export default PostPhoto;