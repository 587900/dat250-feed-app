// Home.tsx
import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconButton, Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from "../../components/Navbar";
import { getMyPolls } from "./../../services/pollService";

const columns = [
  { field: 'title', headerName: 'Title', width: 150 },
  { field: 'description', headerName: 'description', width: 150 },
  { field: 'private', headerName: 'Private', width: 150 },
  {
    field: 'go to poll',
    headerName: 'Go to Poll',
    width: 150,
    renderCell: (params: GridCellParams) => (
      <IconButton
        color="primary"
        component={Link}
        to={`/poll/${params.id}`}
      >
        <ArrowForwardIcon color="primary"/>
      </IconButton>
    ),
  },
];

const rowsDefault = [
  { id: 1, title: 'Pizza eller Taco', description: 'Test1', private: 'No' },
  { id: 2, title: 'Ingen Lekse', description: 'Test2', private: 'Yes' },
  { id: 3, title: 'PS5 eller XBox', description: 'Test3', private: 'Yes' },
  { id: 4, title: 'LoL vs Dota', description: 'Test4', private: 'No' },
  { id: 5, title: 'Erna vs Støre', description: 'Test5', private: 'No' },
  { id: 6, title: 'Windows eller Mac', description: 'Test6', private: 'Yes' },
  { id: 7, title: 'Android vs IPhone', description: 'Test7', private: 'No' },
  { id: 8, title: 'Billigere kantine?', description: 'Test8', private: 'Yes' },
  { id: 9, title: 'Mindre lekse', description: 'Test9', private: 'Yes' },
  { id: 10, title: 'Ny bybane?', description: 'Test10', private: 'No' },
  // ... other rows
];

const MyPollsPage: FC = () => {
  const theme = useTheme();

  let [rows, setRows] = useState(rowsDefault);

  useEffect(() => {
    getMyPolls().then(data => {
      let modified = data.map(e => { return { id: Math.floor(Math.random() * 1000), title: e.title, description: e.description, private: e.private ? 'Yes' : 'No' } });
      setRows(modified);
    });
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <h2 style={{ textAlign: "center" }}>My Polls</h2>
      <Box
        sx={{
          height: 400,
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
          width: "50%",
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

export default MyPollsPage;
