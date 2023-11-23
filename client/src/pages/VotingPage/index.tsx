import React, { FC, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import Navbar from "../../components/Navbar";
//import { getPollByCode } from "../../services/pollService"; // Assume this service function exists
import Poll from "../../../../common/model/poll";

const VotingPage: FC = () => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  /* useEffect(() => {
    getPollByCode(code).then(data => {
      if (data) {
        setPoll(data);
      } else {
        navigate("/"); // Redirect to a 'Not Found' page or home
      }
    });
  }, [code, history]); */

  if (!poll) {
    return <Typography>Loading...</Typography>; // Or a loading spinner
  }

  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5">{poll.title}</Typography>
            <Typography>{poll.description}</Typography>
            {/* Display timer if applicable */}
            <Button variant="contained" color="primary">
              Yes
            </Button>
            <Button variant="contained" color="secondary">
              No
            </Button>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default VotingPage;
