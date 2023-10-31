// Home.tsx
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
const Home: FC = () => {
  return (
    <div>
      <Navbar />
      
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
