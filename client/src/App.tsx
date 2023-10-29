import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';  // Make sure the import path is correct
import LoginPage from './pages/LoginPage';  // Make sure the import path is correct

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add more Routes here as needed */}
      </Routes>
    </Router>
  );
}

export default App;
