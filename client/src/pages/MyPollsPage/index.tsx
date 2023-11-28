import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, IconButton, Button } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from "../../components/Navbar";
import { getMyPolls } from "./../../services/pollService";
import Poll from "../../../../common/model/poll";

const MyPollsPage: FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    getMyPolls().then(data => {
      setPolls(data);
    });
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <Typography sx={{ textAlign: "center", mt: 3 }}>My Polls</Typography>
      <Box sx={{ width: "80%", mx: "auto", my: 4 }}>
        {polls.length !== 0 ? (
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {polls.map((poll, index) => (
              <Card key={index} sx={{ maxWidth: 345, mx: "auto" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary">
                    {poll.title} {poll.cachedVotes.green} {poll.cachedVotes.red}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body1"
                    component="div"
                    color="text.primary"
                  >
                    {poll.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {poll.private ? "Private" : "Public"}
                  </Typography>
                  <IconButton
                    color="primary"
                    component={Link}
                    to={`/poll/vote/${poll.code}`}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Masonry>
        ) : (
          <Box sx={{ textAlign: 'center', my: 4 }}> {/* Centered Box */}
            <Typography variant="h2">You have no polls created</Typography>
            <Button variant="outlined" sx={{mt: 1}} component={Link} to="/create-poll">
              <Typography variant="button">Click here to create</Typography>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MyPollsPage;
