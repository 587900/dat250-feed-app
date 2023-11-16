import React, { FC, useState } from 'react';
import {
  Box, TextField, FormControlLabel, Switch, Button, Typography, useTheme, Grid
} from '@mui/material';
import Navbar from '../../components/Navbar';
import { createPoll } from '../../services/pollService';
import { CreatePollData } from '../../types/clientTypes';

// Function to generate random alphanumeric code
const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

interface FormState {
    title: string;
    description: string;
    private: boolean;
    timed: boolean;
    duration: number;
    whitelist: string[]; // For private polls
    allowedVoters: string[]; // For public polls
    code: string;
}

const CreatePollPage: FC = () => {
  const theme = useTheme();
  const [formState, setFormState] = useState<FormState>({
    title: '',
    description: '',
    private: false,
    timed: false, // Default is untimed
    duration: 60, // Default duration set to 60 minutes
    whitelist: [],
    allowedVoters: [],
    code: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    
    // If the input is 'duration' and the value is greater than 120, return early
    if (name === 'duration' && type === 'number' && +value > 120) {
      setFormState((prev) => ({
        ...prev,
        [name]: 120, // Set to maximum value
      }));
      return; // Prevents the state from being updated beyond the max value
    }
  
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  

  // Function to handle the random code generation
  const handleGenerateCode = () => {
    const newCode = generateRandomCode();
    setFormState((prev) => ({
      ...prev,
      code: newCode,
    }));
  };

  const handleSubmit = async () => {
    try {
      const createdPoll = await createPoll(formState as CreatePollData);
      console.log("Poll created:", createdPoll);
      // Handle successful creation
    } catch (error) {
      // Handle errors
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          mt: 4,
          px: 3,
          [theme.breakpoints.down('md')]: {
            width: '100%',
          },
          maxWidth: '600px',
          mx: 'auto',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create a New Poll
        </Typography>
        <TextField
          fullWidth
          label="Poll Title"
          name="title"
          value={formState.title}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Poll Description"
          name="description"
          value={formState.description}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={4}
        />
        <FormControlLabel
          control={
            <Switch
              checked={formState.private}
              onChange={handleInputChange}
              name="private"
            />
          }
          label="Private Poll"
          labelPlacement="start"
          sx={{ display: 'block', mt: 2 }}
        />
        <Grid container spacing={1} alignItems="center" justifyContent="center" sx={{mt:2}}>
          <Grid item xs={5}>
            <TextField
              fullWidth
              type="number"
              label="Duration (minutes)"
              name="duration"
              value={formState.duration}
              onChange={handleInputChange}
              inputProps={{ step: 1, min: 1, max: 120, }} // Only allow positive numbers
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="Access Code"
              name="code"
              value={formState.code}
              onChange={handleInputChange}
              inputProps={{ readOnly: true }} // Limit to 7 characters
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="outlined" onClick={handleGenerateCode}>
              Generate
            </Button>
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
          Create Poll
        </Button>
      </Box>
    </div>
  );
};

export default CreatePollPage;
