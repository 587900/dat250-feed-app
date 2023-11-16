// MyPollsPage.tsx
import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, IconButton } from "@mui/material";
import Masonry from '@mui/lab/Masonry';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from "../../components/Navbar";
import { getMyPolls } from "./../../services/pollService";
import Poll from "../../../../common/model/poll";

const MyPollsPage: FC = () => {
  let [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    getMyPolls().then(data => {
      let modified = data.map(e => { return { id: Math.floor(Math.random() * 1000), title: e.title, description: e.description, private: e.private ? 'Yes' : 'No' } });
      setRows(modified);
    });
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <Typography sx={{ textAlign: "center" }}>My Polls</Typography>
      <Box sx={{ width: '80%', mx: 'auto', my: 4 }}>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {polls.map((poll, index) => (
            <Card key={index} sx={{ maxWidth: 345, mx: 'auto' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color='text.secondary'>Title</Typography>
                <Typography gutterBottom variant="body1" component="div" color='text.primary'>
                  {poll.title}
                </Typography>
                <Typography variant="body2" color="text.primary">
                  {poll.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {poll.private ? 'Private' : 'Public'}
                </Typography>
                <IconButton
                  color="primary"
                  component={Link}
                  to={`/poll/${poll.code}`}
                >
                  Visit Poll
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Masonry>
      </Box>
    </div>
  );
};

export default MyPollsPage;
