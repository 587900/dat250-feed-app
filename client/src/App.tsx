import React, { FC } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Make sure the import path is correct
import LoginPage from "./pages/LoginPage"; // Make sure the import path is correct
import CreatePollPage from "./pages/CreatePollPage";
import { theme } from "./theme";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-poll" element={
              <ProtectedRoute>
                <CreatePollPage />
              </ProtectedRoute>
            } />
        </Routes>
      </Router>
      </AuthProvider>
      
    </ThemeProvider>
  );
};

export default App;
