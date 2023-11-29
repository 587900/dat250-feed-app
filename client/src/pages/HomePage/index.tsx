// Home.tsx
import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconButton, Box, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Navbar from "../../components/Navbar";
import { getFrontPagePolls } from "../../services/pollService";
import { useAuth } from "../../components/AuthContext";
import { checkAuthState } from "../../services/authService";
import "./index.css";

const columns = [
  { field: "creator", headerName: "Creator", width: 150 },
  { field: "title", headerName: "Title", width: 150 },
  { field: "private", headerName: "Private", width: 150 },
  {
    field: "go to poll",
    headerName: "Go to Poll",
    width: 150,
    renderCell: (params: GridCellParams) => (
      <IconButton color="primary" component={Link} to={`/poll/vote/${params.row.code}`}>
        <ArrowForwardIcon color="primary" />
      </IconButton>
    ),
  },
];

/*
const rows = [
  { id: 1, creator: 'Frank Ove', title: 'Pizza eller Taco', private: 'No' },
  { id: 2, creator: 'Odd Jostein', title: 'Ingen Lekse', private: 'Yes' },
  { id: 3, creator: 'Per Gunnar', title: 'PS5 eller XBox', private: 'Yes' },
  { id: 4, creator: 'Olav Hansen', title: 'LoL vs Dota', private: 'No' },
  { id: 5, creator: 'Karoline Kvam', title: 'Erna vs Støre', private: 'No' },
  { id: 6, creator: 'Henriette Lien', title: 'Windows eller Mac', private: 'Yes' },
  { id: 7, creator: 'Sander Breivik', title: 'Android vs IPhone', private: 'No' },
  { id: 8, creator: 'Jens Hjortdal', title: 'Billigere kantine?', private: 'Yes' },
  { id: 9, creator: 'Karl Søreide', title: 'Mindre lekse', private: 'Yes' },
  { id: 10, creator: 'Emilie Tanstad', title: 'Ny bybane?', private: 'No' },
  // ... other rows
];
*/

type LocalPoll = {
  id: string;
  creator: string;
  title: string;
  private: string;
  code: string;
};

const Home: FC = () => {
  const theme = useTheme();
  const { logout, login } = useAuth();

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/check', { credentials: 'include' });
        const data = await response.json();
        if (data.authenticated) {
          login(data.user); // Update context
        } else {
          logout(); // Clear context and localStorage
        }
      } catch (error) {
        console.error('Error checking auth status', error);
      }
    };
  
    checkAuthState();
  }, []);

  let [rows, setRows] = useState<LocalPoll[]>([]);
  useEffect(() => {
    getFrontPagePolls().then((data) => {
      let modified = data.map((e) => {
        return {
          id: e.code,
          creator:  e.username,
          title: e.title,
          code: e.code,
          private: e.private ? "Yes" : "No",
        };
      });
      setRows(modified);
    });
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <Box
        sx={{
          height: 400,
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
          width: "60%",
          px: 1,
          mx: "auto",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{ border: "1px solid #CE8F6E", justifyContent: "center" }}
          className="customDataGrid"
          density="compact"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 8,
              },
            },
          }}
          pageSizeOptions={[8]}
        />
      </Box>
    </div>
  );
};

export default Home;
