import React, { useState } from "react";
import { Card, CardContent, Typography, Button, TextField, Box, Alert } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { postModel } from "../../lib/fetchModelData";

function PassChange({ loggedInUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (passData.newPassword !== passData.confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      // Gửi yêu cầu đổi mật khẩu. Lưu ý: Backend cần hỗ trợ route này.
      const res = await postModel(`/user/pass/${userId}`, {
        current_password: passData.currentPassword,
        new_password: passData.newPassword,
      });
      if (res.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message || "Update failed.");
    }
  };

  if (loggedInUser && loggedInUser._id !== userId) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="error">
            You are not permitted to change this profile.
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Password updated successfully!</Alert>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Current Password" name="currentPassword" type="password"
            fullWidth variant="outlined" required
            value={passData.currentPassword} onChange={handleChange}
          />
          <TextField
            label="New Password" name="newPassword" type="password"
            fullWidth variant="outlined" required
            value={passData.newPassword} onChange={handleChange}
          />
          <TextField
            label="Confirm New Password" name="confirmNewPassword" type="password"
            fullWidth variant="outlined" required
            value={passData.confirmNewPassword} onChange={handleChange}
            error={passData.newPassword !== passData.confirmNewPassword && passData.confirmNewPassword !== ""}
            helperText={passData.newPassword !== passData.confirmNewPassword && passData.confirmNewPassword !== "" ? "Passwords do not match" : ""}
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>Change Password</Button>
            <Button variant="outlined" onClick={() => navigate(`/users/${userId}`)}>Cancel</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
export default PassChange;