import React, { useState, FC } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Container,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Grid,
} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";

import backgroundImage from "../../assets/background-images/schoolground-background-2.png";
import Logo from "../../assets/Logo/alternative-FeedApp-logo.png";

import { Stack } from "@mui/system";
import { login, register } from "../../services/authService";
import { useAuth } from "../AuthContext";


const Login: FC = () => {
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Register form state
  const [phone, setPhone] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [registerConfirmPassword, setRegisterConfirmPassword] =
    useState<string>("");

  const handleLogin = async () => {
    try {
      const { user, token } = await login(loginEmail, loginPassword);
      localStorage.setItem('token', token); // Handle token storage
      contextLogin(user); // Set user context
      navigate('/'); // Redirect to dashboard or another route
    } catch (error: any) {
      setError(error.response?.data || 'Login failed');
    }
  };

  const handleSignUp = async () => {
    if (!validateRegisterForm()) return;
  
    try {
      console.log('handleSignUp entered');
      
      const user = await register({ firstName, lastName, email, password });
      console.log('user after register',user); 
      setSuccessMessage("successfully registered"); //not showing up for some reason
    } catch (error: any) {
      setError(error.response?.data || 'Registration failed');
    }
  };
  
  

  const handleGoogleLogin = () => {
    const redirect = encodeURI("http://localhost:3000");
    window.location.href = `http://localhost:8080/auth/google?auth_redirect_success=${redirect}`;
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTabColor = (index: number): string => {
    return activeTab === index ? "primary.dark" : "primary.light";
  };

  const validateRegisterForm = () => {
    if (firstName.trim() === "") {
      setError("First name is required");
      return false;
    }

    if (lastName.trim() === "") {
        setError("Last Name is required");
        return false;
      }

    if (email.trim() === "") {
      setError("Email is required");
      return false;
    }

    if (password.trim() === "") {
      setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be 6 characters long");
      return false;
    }

    if (password !== registerConfirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        minHeight: "100vh",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed",
        p: 2,
      }}
    >
      <Grid container>
        <Grid item xs={1} sx={{ justifyContent: "center", mx: "auto" }}>
          <Link
            to="/"
            className="me-auto"
            style={{ color: "#fff", backgroundColor: "inherit" }}
          >
            <img
              src={Logo}
              className="d-sm-block me-1 logo"
              alt="Logo"
              style={{ height: "100px", width: "100px" }}
            />
          </Link>
        </Grid>
        <Grid item xs={12}>
          <Container
            maxWidth="xs"
            sx={{
              backgroundColor: "background.paper",
              p: 2,
              mt: 1,
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Stack direction="row" justifyContent={"space-between"}>
              <Typography variant="h4" component="div">
                Login/Register
              </Typography>
              <Link
                to="/"
                style={{ color: "#000", backgroundColor: "inherit", textDecoration: "none" }}
              >
                Go Back
              </Link>
            </Stack>

            <Divider sx={{ my: 1 }} color="primary" />
            <Tabs value={activeTab} onChange={handleChange} variant="fullWidth">
              <Tab label="Login" sx={{ color: getTabColor(0) }} />
              <Tab label="Register" sx={{ color: getTabColor(1) }} />
            </Tabs>
            {activeTab === 0 && (
              <Container maxWidth="xs">
                <Typography align="center" variant="body1" sx={{ mt: 2 }}>
                  Sign in with:
                </Typography>
                <Box display="flex" justifyContent="space-evenly" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    startIcon={
                      <GoogleIcon fontSize="large" color="secondary" />
                    }
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        letterSpacing: 1,
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                      color="secondary"
                    >
                      Google
                    </Typography>
                  </Button>
                </Box>
                <Typography align="center" variant="body1" sx={{ mt: 2 }}>
                  or:
                </Typography>
                {error && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 2, textAlign: "center" }}
                  >
                    {error}
                  </Typography>
                )}
                {successMessage && (
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ mt: 2, textAlign: "center" }}
                  >
                    {successMessage}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  type="email"
                  value={loginEmail}
                  onChange={(e:any) => setLoginEmail(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Password"
                  margin="normal"
                  type="password"
                  value={loginPassword}
                  onChange={(e:any) => setLoginPassword(e.target.value)}
                />
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remember me"
                  />
                  <Link to="#!" style={{ textDecoration: "none" }}>
                    <Typography variant="body2" color="primary.dark">
                      Forgot password?
                    </Typography>
                  </Link>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  Sign in
                </Button>
              </Container>
            )}

            {/*Register Section */}
            {activeTab === 1 && (
              <Container maxWidth="xs">
                <Typography align="center" variant="body1" sx={{ mt: 2 }}>
                  Sign up with:
                </Typography>
                <Box display="flex" justifyContent="space-evenly" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    startIcon={
                      <GoogleIcon fontSize="large" color="secondary" />
                    }
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        letterSpacing: 1,
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                      color="secondary"
                    >
                      Google
                    </Typography>
                  </Button>
                </Box>
                <Typography align="center" variant="body1" sx={{ mt: 2 }}>
                  or:
                </Typography>
                {error && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 2, textAlign: "center" }}
                  >
                    {error}
                  </Typography>
                )}
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
            

                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  type="email"
                  value={email}
                  onChange={(e:any) => setEmail(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Password"
                  margin="normal"
                  type="password"
                  value={password}
                  onChange={(e:any) => setPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  margin="normal"
                  type="password"
                  value={registerConfirmPassword}
                  onChange={(e:any) => setRegisterConfirmPassword(e.target.value)}
                />
                <Box display="flex" justifyContent="center" mt={1}>
                  <FormControlLabel
                    control={<Checkbox />}
                    label="I have read and agree to the terms"
                  />
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    handleSignUp()
                  }}
                >
                  Sign up
                </Button>
              </Container>
            )}
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
