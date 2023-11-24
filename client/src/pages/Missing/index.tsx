import React, { FC } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Missing: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h1" component="div" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Oops! Page not found.
      </Typography>
      <Typography variant="body1">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Typography variant='body2'>If you tried to access a poll, the code might be wrong or the poll is private</Typography>
      <Button variant="contained" color="primary" component={Link} to="/" sx={{ mt: 3 }}>
        Go to Home Page
      </Button>
    </Box>
  );
};

export default Missing;
