import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Searchbar from "../Searchbar";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  CircularProgress,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AccountCircle, Login } from "@mui/icons-material";
import { useAuth } from "../../components/AuthContext";
import MoreIcon from "@mui/icons-material/MoreVert";
import Logo from "../../assets/Logo/alternative-FeedApp-logo.png";

const Navbar: React.FC = () => {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<HTMLElement | null>(null);

  const theme = useTheme();
  const { user, logout } = useAuth();
  
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isPhone = useMediaQuery(theme.breakpoints.down("md"));

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMobileMenuClose}>
        <Typography color="primary">My polls</Typography>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Link
          to="/create-poll"
          className="me-auto"
          style={{ backgroundColor: "inherit", textDecoration: "none" }}
        >
          <Typography color="primary">Create Poll</Typography>
        </Link>
      </MenuItem>

      <MenuItem onClick={handleMobileMenuClose}>
        {user ? (
          <Typography color="primary" onClick={logout}>
            Logout
          </Typography>
        ) : (
          <Link
            to="/login"
            rel="noopener follow"
            color="inherit"
            style={{ textDecoration: "none" }}
          >
            <Typography color="primary">Login</Typography>
          </Link>
        )}
      </MenuItem>
    </Menu>
  );

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
              px: 0,
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
                style={{ height: "70px", width: "70px", marginRight: "4px" }}
              />
            </Link>

            {/* Searchbar */}
            <Box
              sx={{
                [theme.breakpoints.down("md")]: {
                  width: "60%",
                },
                width: "50%",
              }}
              marginLeft={1}
              marginRight={1}
            >
              <Searchbar />
            </Box>

            {isPhone ? null : (
              <>
                <Link
                  to="/my-polls"
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
                  to="/create-poll"
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
                {user ? (
                  <Button
                    onClick={logout}
                    style={{
                      backgroundColor: "inherit",
                      textDecoration: "none",
                    }}
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
                      Logout
                    </Typography>
                  </Button>
                ) : (
                  <Link
                    to="/login"
                    style={{
                      backgroundColor: "inherit",
                      textDecoration: "none",
                    }}
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
                )}
              </>
            )}
            {!isPhone ? null : (
              <Box>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={handleMobileMenuOpen}
                  sx={{ p: 0, color: "primary", ml: 2 }}
                >
                  <MoreIcon sx={{ mx: 0.5, p: 0 }} />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </Box>
    </Box>
  );
};

export default Navbar;
