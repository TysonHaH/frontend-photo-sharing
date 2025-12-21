import './App.css';

import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import ProtectedRoute from "./components/ProtectedRoute";
import fetchModel from './lib/fetchModelData';

const App = (props) => {
  // Giả lập trạng thái chưa đăng nhập.
  // Trong ứng dụng thực tế, bạn sẽ lấy thông tin này từ context hoặc local storage.
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await fetchModel("/admin/loggedin-user");
        setLoggedInUser(user);
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
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            </Grid>
            <div className="main-topbar-buffer" />
            <Routes>
              <Route path="/login" element={
                loggedInUser ? <Navigate to={`/users/${loggedInUser._id}`} /> : (
                  <Grid item xs={12}>
                    <LoginRegister setLoggedInUser={setLoggedInUser} />
                  </Grid>
                )
              } />
              
              {/* Các route cần bảo vệ */}
              <Route path="*" element={
                <ProtectedRoute user={loggedInUser}>
                  <>
                    <Grid item sm={3}>
                      <Paper className="main-grid-item">
                        <UserList />
                      </Paper>
                    </Grid>
                    <Grid item sm={9}>
                      <Paper className="main-grid-item">
                        <Routes>
                          <Route path="/users/:userId" element={<UserDetail />} />
                          <Route path="/photos/:userId" element={<UserPhotos />} />
                          <Route path="/users" element={<UserList />} />
                        </Routes>
                      </Paper>
                    </Grid>
                  </>
                </ProtectedRoute>
              } />
            </Routes>
          </Grid>
        </div>
      </Router>
  );
};

export default App;
