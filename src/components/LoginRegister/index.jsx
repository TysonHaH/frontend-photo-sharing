import React, { useState } from "react";
import {
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { postModel } from "../../lib/fetchModelData";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="tab-panel-box">{children}</Box>}
    </div>
  );
}

function LoginRegister({ setLoggedInUser }) {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userData = await postModel("/admin/login", {
        login_name: loginName,
        password: password,
      });
      setLoggedInUser(userData);
      // Chuyển hướng về trang chi tiết của người dùng vừa đăng nhập
      navigate(`/users/${userData._id}`);
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <Paper elevation={3} className="login-register-paper">
      <Tabs value={tabValue} onChange={handleChange} variant="fullWidth">
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <Box
          component="form"
          onSubmit={handleLogin}
          className="login-form"
          noValidate
          autoComplete="off"
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Login
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" className="form-button">
            Login
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Box
          component="form"
          className="register-form"
          noValidate
          autoComplete="off"
        >
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Register
          </Typography>
          <TextField label="Username" variant="outlined" fullWidth required />
          <TextField label="Password" type="password" variant="outlined" fullWidth required/>
          <TextField label="Confirm Password" type="password" variant="outlined" fullWidth required/>
          <TextField label="First Name" variant="outlined" fullWidth required/>
          <TextField label="Last Name" variant="outlined" fullWidth required/>
          <Button variant="contained" color="primary" className="form-button">
            Register
          </Button>
        </Box>
      </TabPanel>
    </Paper>
  );
}

export default LoginRegister;