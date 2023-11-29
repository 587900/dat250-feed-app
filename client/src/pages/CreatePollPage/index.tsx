import React, { FC, useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  useTheme,
  Grid,
  Autocomplete,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import Navbar from "../../components/Navbar";
import { createPoll } from "../../services/pollService";
import { CreatePollData } from "../../types/clientTypes";

// Function to generate random alphanumeric code
const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
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
  timeoutUnix: number;
  duration: number;
  whitelist: string[]; // For private polls
  allowedVoters: string[]; // For public polls
  code: string;
  open: boolean;
}

const voterOptions = [
  { label: "IoT Device", value: "iot-device" },
  { label: "Web User", value: "web-user" },
  { label: "Guest", value: "web-user-guest" },
];

const CreatePollPage: FC = () => {
  const theme = useTheme();
  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    private: false,
    timed: false, // Default is untimed
    timeoutUnix: 0,
    duration: 60, // Default duration set to 60 minutes
    whitelist: [""],
    allowedVoters: [],
    code: "",
    open: true,
  });
  const [emailInput, setEmailInput] = useState<string>("");
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [timeoutUnix, setTimeoutUnix] = useState<number>(0);

  const handleDateTimeChange = (newValue: Date | null) => {
    setSelectedDateTime(newValue);
    if (newValue) {
      const newTimeoutUnix = newValue.getTime();
      console.log("new value:", newTimeoutUnix);
      setTimeoutUnix(newTimeoutUnix); // Directly setting the Unix timestamp
    }
  };

  const handleVoterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormState((prev) => {
      const newAllowedVoters = prev.allowedVoters.includes(value)
        ? prev.allowedVoters.filter((v) => v !== value)
        : [...prev.allowedVoters, value];
      return {
        ...prev,
        allowedVoters: newAllowedVoters,
      };
    });
  };

  const handleEmailAdd = (
    event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    // Assuming the value is a string of email
    if (
      value &&
      typeof value === "string" &&
      !formState.whitelist.includes(value)
    ) {
      setFormState((prev) => ({
        ...prev,
        whitelist: [...prev.whitelist, value],
      }));
      setEmailInput(""); // Clear the input field after adding
    }
  };

  const handleEmailRemove = (email: string) => {
    setFormState((prev) => ({
      ...prev,
      whitelist: prev.whitelist.filter((e) => e !== email),
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;

    // If the input is 'duration' and the value is greater than 120, return early
    if (name === "duration" && type === "number" && +value > 120) {
      setFormState((prev) => ({
        ...prev,
        [name]: 120, // Set to maximum value
      }));
      return; // Prevents the state from being updated beyond the max value
    }

    setFormState((prev) => {
      // Update the form state based on the input type
      const updatedState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
  
      // If the 'private' switch is being turned on, clear the allowedVoters
      if (name === 'private' && checked) {
        updatedState.allowedVoters = [];
      }
  
      return updatedState;
    });
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
      let pollData: CreatePollData = {
        code: formState.code,
        title: formState.title,
        description: formState.description,
        private: formState.private,
        open: formState.open,
        timed: formState.timed,
        ...(formState.timed && { timeoutUnix }), // Use the separate timeoutUnix state
        ...(!formState.private && { allowedVoters: formState.allowedVoters }),
      };
  
      // Conditionally add whitelist if private is true
      if (formState.private) {
        pollData.whitelist = formState.whitelist;
      }
  
      const createdPoll = await createPoll(pollData);
      console.log("Poll created:", createdPoll);
    } catch (error) {
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
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
          maxWidth: "600px",
          mx: "auto",
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
          sx={{ display: "block", my: 2, ml: 0 }}
        />

        {formState.private && (
          <>
            <Autocomplete
              freeSolo
              options={[]} // In this case, we don't have predefined options
              inputValue={emailInput}
              onInputChange={(event, newInputValue) =>
                setEmailInput(newInputValue)
              }
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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      title={email}
                      noWrap
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {email}
                    </Typography>
                    <Button onClick={() => handleEmailRemove(email)}>
                      Remove
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        <Grid
          container
          spacing={1}
          alignItems="start"
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Grid item xs={12}>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">Allowed Voters</FormLabel>
              <FormGroup row>
                {voterOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={formState.allowedVoters.includes(option.value)}
                        onChange={handleVoterChange}
                        value={option.value}
                        disabled={formState.private}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formState.timed}
                  onChange={handleInputChange}
                  name="timed"
                  sx={{ ml: 0 }}
                />
              }
              label="Timed Poll"
              labelPlacement="start"
              sx={{ display: "block", my: 2, ml: 0 }}
            />

            {formState.timed && (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <DateTimePicker
                    label="Poll Closing Time"
                    value={selectedDateTime}
                    onChange={handleDateTimeChange}
                  />
                </Stack>
              </LocalizationProvider>
            )}
          </Grid>
        </Grid>
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="start"
          sx={{ mt: 2 }}
        >
          <Grid item xs={5}>
            <TextField
              fullWidth
              label="Access Code"
              name="code"
              value={formState.code}
              onChange={handleInputChange}
              inputProps={{ readOnly: true }} // Limit to 7 characters by forcing an unchangeable generated code
            />
          </Grid>
          <Grid item xs={2}>
            <Button variant="outlined" onClick={handleGenerateCode}>
              Generate
            </Button>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Create Poll
        </Button>
      </Box>
    </div>
  );
};

export default CreatePollPage;
