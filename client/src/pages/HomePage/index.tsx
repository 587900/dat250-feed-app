// Home.tsx
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { IconButton, Box, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from "../../components/Navbar";
import './index.css'

const columns = [
  { field: 'creator', headerName: 'Creator', width: 150 },
  { field: 'title', headerName: 'Title', width: 150 },
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

const Home: FC = () => {
  const theme = useTheme();
  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <Box
        sx={{
          height: 400,
          [theme.breakpoints.down("md")]: {
            width: "100%",
          },
          width: "50%",
          pl: 1,
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
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]} 
        />
      </Box>
    </div>
  );
};

export default Home;
