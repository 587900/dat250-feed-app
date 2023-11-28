import React, { FC, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Make sure the import path is correct
import LoginPage from "./pages/LoginPage"; // Make sure the import path is correct
import CreatePollPage from "./pages/CreatePollPage";
import MyPollsPage from "./pages/MyPollsPage";
import { theme } from "./theme";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import VotingPage from "./pages/VotingPage";
import Missing from "./pages/Missing";
import { useAuth } from "./components/AuthContext";

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/create-poll"
              element={
                <ProtectedRoute>
                  <CreatePollPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-polls"
              element={
                <ProtectedRoute>
                  <MyPollsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/poll/vote/:code" element={<VotingPage />} />

            {/* catch all */}
            <Route path="*" element={<Missing />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
