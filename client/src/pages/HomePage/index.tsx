// Home.tsx
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import Navbar from '../../components/Navbar';
const Home: FC = () => {
  return (
    <div>
      <Navbar />
      <Link to="/login" rel="noopener follow" color="inherit">
        <Button variant='outlined'>
            <Typography variant='button'>LOGIN</Typography>
        </Button>
      </Link>
      <h1>Home Page</h1>
    </div>
  );
};

export default Home;
