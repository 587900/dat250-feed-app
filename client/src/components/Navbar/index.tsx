// Importing necessary Material-UI components and icons
import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Searchbar from "../Searchbar";
import { Box, Typography } from "@mui/material";
import Logo from "../../assets/Logo/alternative-FeedApp-logo.png";
// Define the Navbar component
const Navbar: React.FC = () => {
  // Handler function for search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value); // Log the search input for now
  };

  return (
    <Box sx={{ backgroundColor: "background.default", width: "100vw" }}>
      <Box
        sx={{
          flexGrow: 1,
          maxWidth: "1200px",
          mx: "auto",
          backgroundColor: "background.default",
        }}
      >
        <AppBar
          position="static"
          sx={{ boxShadow: "none", backgroundColor: "background.default" }}
        >
          <Toolbar
            sx={{
              backgroundColor: "background.default",
              justifyContent: "center",
              px: 'auto'
            }}
          >
            {/* Logo */}
            <Link
              to="/"
              className="me-auto"
              style={{ color: "#fff", backgroundColor: "inherit" }}
            >
              <img
                src={Logo}
                className="d-sm-block me-1 logo"
                alt="Logo"
                style={{ height: "70px", width: "70px" }}
              />
            </Link>

            {/* Searchbar */}
            <Box width={"50%"} marginLeft={1} marginRight={1}>
              <Searchbar />
            </Box>

            <Link
              to="/"
              className="me-auto"
              style={{ backgroundColor: "inherit", textDecoration: "none" }}
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{
                  p: 1,
                  mx: 1,
                  border: "solid 2px",
                  borderColor: "primary.light",
                  borderRadius: "10px",
                }}
              >
                My Polls
              </Typography>
            </Link>
            <Link
              to="/"
              className="me-auto"
              style={{ backgroundColor: "inherit", textDecoration: "none" }}
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{
                  p: 1,
                  mx: 1,
                  border: "solid 2px",
                  borderColor: "primary.light",
                  borderRadius: "10px",
                }}
              >
                Create Poll
              </Typography>
            </Link>
            <Link
              to="/login"
              className="me-auto"
              style={{ backgroundColor: "inherit", textDecoration: "none" }}
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{
                  p: 1,
                  mx: 1,
                  border: "solid 2px",
                  borderColor: "primary.light",
                  borderRadius: "10px",
                }}
              >
                Login
              </Typography>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );
};

export default Navbar;
