import React, { FC } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Make sure the import path is correct
import LoginPage from "./pages/LoginPage"; // Make sure the import path is correct
import CreatePollPage from "./pages/CreatePollPage";
import { theme } from "./theme";

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-poll" element={<CreatePollPage />}/>
          {/* Add more Routes here as needed */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
