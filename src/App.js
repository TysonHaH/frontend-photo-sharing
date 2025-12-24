import './App.css';
import React, { useState, useEffect } from "react";
import { Grid, Paper, Box } from "@mui/material"; // Thêm Box
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import PostPhoto from "./components/PostPhoto";
import fetchModel from './lib/fetchModelData';

const App = (props) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await fetchModel("/admin/loggedin-user");
        setLoggedInUser(user.data);
      } catch (err) {
        setLoggedInUser(null);
      } finally {
        setCheckingSession(false);
      }
    };
    checkLoginStatus();
  }, []);

  if (checkingSession) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        
        <Box sx={{ flexShrink: 0 }}> 
           <Grid container spacing={2}>
              <Grid item xs={12}>
                <TopBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
              </Grid>
           </Grid>
        </Box>

        <Box sx={{ flexGrow: 1, overflow: 'hidden', marginTop: '64px' }}> 
          <Grid container spacing={2} sx={{ height: '100%' }}>
            
            <Routes>
              <Route path="/login" element={
                 loggedInUser ? <Navigate to={`/users/${loggedInUser._id}`} /> : (
                  <Grid item xs={12} sx={{ p: 2 }}>
                    <LoginRegister setLoggedInUser={setLoggedInUser} />
                  </Grid>
                )
              } />

              <Route path="*" element={
                <ProtectedRoute user={loggedInUser}>
                  <>
                    <Grid item sm={3} sx={{ height: '100%' }}>
                      <Paper className="main-grid-item" sx={{ 
                          height: '100%',       // Cao full cột
                          overflowY: 'auto',    // Chỉ cuộn trong khung này
                      }}>
                        <UserList />
                      </Paper>
                    </Grid>

                    <Grid item sm={9} sx={{ height: '100%' }}>
                      <Paper className="main-grid-item" sx={{ 
                          height: '100%',      
                          overflowY: 'auto', 
                      }}>
                        <Routes>
                          <Route path="/users/:userId" element={<UserDetail loggedInUser={loggedInUser}/>}  />
                          <Route path="/photos/:userId" element={<UserPhotos />} />
                          <Route path="/users" element={<UserList />} />
                          <Route path="/add-photo/:userId" element={<PostPhoto loggedInUser={loggedInUser}/>} />
                        </Routes>
                      </Paper>
                    </Grid>
                  </>
                </ProtectedRoute>
              } />
            </Routes>

          </Grid>
        </Box>
      </Box>
    </Router>
  );
};

export default App;