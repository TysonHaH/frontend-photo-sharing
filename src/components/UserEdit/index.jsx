import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, TextField, Box, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import fetchModel, { patchModel } from "../../lib/fetchModelData";

function UserEdit({ loggedInUser }) {
  const {userId} = useParams();
  const navigate = useNavigate();
  const [userData,setUserData] = useState({
    last_name: "",
    location: "",
    description: "",
    occupation: "",
  });
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(() =>{
    const getUser = async () =>{
        try{
            const response = await fetchModel(`/user/${userId}`);
            const user = response.data;
            setUserData({
                last_name: user.last_name,
                location: user.location,
                description: user.description,
                occupation: user.occupation,
            });
        } catch (err){
            console.error("Error fetching user:", err);
            setError("Could not load user data.");
        } finally{
            setLoading(false);
        }
    };
    getUser();
  }, [userId]);
  
  const handleChange = (e) =>{
    const {name,value} =e.target;
    setUserData((prev)=>({...prev,[name]: value}));
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setError(null);
    try{
        const res = await patchModel(`/user/${userId}`, userData);
        if(res.status === 200){
            alert('Update success')
            navigate(`/users/${userId}`);
        }
    } catch(err){
        console.error("Update failed:", err);
        setError(err.message || "Update failed.");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  if(loggedInUser && loggedInUser._id !== userId){
    return (<Card>
        <CardContent>
            <Typography variant="h6" color="error">You are not permitted to change this profile.</Typography>
        </CardContent>
    </Card>
    );
  }
  return(
    <Card>
        <CardContent>
            {error &&<Alert severity="error" sx={{mb:2}}>{error}</Alert>}
            
            <Typography variant="h5" gutterBottom>Edit Profile</Typography>
            <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2 // Tạo khoảng cách 16px giữa các phần tử con
            }}
            >
                <TextField 
                label="Name"
                name="last_name" 
                fullWidth
                variant="outlined"
                value={userData.last_name} 
                onChange={handleChange}
                require
                />
                <TextField 
                label="Location"
                name="location" 
                fullWidth
                variant="outlined"
                value={userData.location} 
                onChange={handleChange}
                />
                <TextField 
                label="Occupation"
                name="occupation" 
                fullWidth
                variant="outlined"
                value={userData.occupation} 
                onChange={handleChange}
                />
                <TextField 
                label="Description"
                name="description" 
                fullWidth
                variant="outlined"
                value={userData.description} 
                onChange={handleChange}
                />
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>Save</Button>
                    <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => navigate(`/edit/pass/${userId}`)}>Change Password</Button>
                    <Button variant="outlined" onClick={() => navigate(`/users/${userId}`)}>Cancel</Button>
                </Box>
            </Box>
        </CardContent>
    </Card>
  );
}
export default UserEdit;