// Loading.tsx
import { FC } from "react";
import {Box, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar";

const Loading: FC = () => {
  
  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
     {/*  <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={80} />
      </Box> */}
    </div>
  );
};

export default Loading;
