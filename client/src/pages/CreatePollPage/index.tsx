import React, { FC, useState } from 'react';
import {
  Box, TextField, FormControlLabel, Switch, Button, Typography, useTheme, Grid, Autocomplete
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
    code: string,
    open: boolean,
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
    open: true,
  });
  const [emailInput, setEmailInput] = useState<string>("");

  const handleEmailAdd = (event: React.SyntheticEvent<Element, Event>, value: any) => {
    // Assuming the value is a string of email
    if (value && typeof value === 'string' && !formState.whitelist.includes(value)) {
      setFormState((prev) => ({
        ...prev,
        whitelist: [...prev.whitelist, value]
      }));
      setEmailInput(""); // Clear the input field after adding
    }
  };

  const handleEmailRemove = (email: string) => {
    setFormState((prev) => ({
      ...prev,
      whitelist: prev.whitelist.filter((e) => e !== email)
    }));
  };

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
        const createdPoll = await createPoll((formState as unknown) as CreatePollData);
        console.log('Poll created:', createdPoll);
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
        control={<Switch checked={formState.private} onChange={handleInputChange} name="private" />}
        label="Private Poll"
        labelPlacement="start"
        sx={{ display: 'block', my: 2, ml: 0 }}
      />

      {formState.private && (
        <>
          <Autocomplete
            freeSolo
            options={[]} // In this case, we don't have predefined options
            inputValue={emailInput}
            onInputChange={(event, newInputValue) => setEmailInput(newInputValue)}
            onChange={handleEmailAdd}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add Voter Email"
                variant="outlined"
                placeholder="Enter email..."
              />
            )}
          />
          <Grid container spacing={2} sx={{ mt: 2 }}>
              {formState.whitelist.map((email, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography title={email} noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {email}
                    </Typography>
                    <Button onClick={() => handleEmailRemove(email)}>Remove</Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </>
      )}
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
