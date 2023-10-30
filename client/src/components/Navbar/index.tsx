// Importing necessary Material-UI components and icons
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Searchbar from '../Searchbar';
import { Box } from '@mui/material';
// Define the Navbar component
const Navbar: React.FC = () => {
    // Handler function for search input changes
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);  // Log the search input for now
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Logo
                </Typography>

                {/* Searchbar */}
                <Box width={"50%"} marginLeft={1} marginRight={1}>
                    <Searchbar />
                </Box>

                {/* My Polls */}
                <Button color="inherit">My Polls</Button>

                {/* Create Poll */}
                <Button color="inherit">Create Poll</Button>

                {/* Login */}
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
