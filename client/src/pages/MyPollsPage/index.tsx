import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ThumbUpIcon from "@mui/icons-material/ThumbUp"; // For green votes
import ThumbDownIcon from "@mui/icons-material/ThumbDown"; // For red votes
import Navbar from "../../components/Navbar";
import { getMyPolls, closePoll, openPoll } from "./../../services/pollService";
import Poll from "../../../../common/model/poll";

const MyPollsPage: FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    getMyPolls().then((data) => {
      console.log("Fetched polls:", data);
      setPolls(data);
    });
  }, []);

  const handleTogglePoll = async (poll: Poll, checked: boolean) => {
    const success = checked
      ? await openPoll(poll.code)
      : await closePoll(poll.code);
    if (success) {
      setPolls(
        polls.map((p) => (p.code === poll.code ? { ...p, open: checked } : p))
      );
    } else {
      console.error(
        `Failed to ${checked ? "open" : "close"} poll with code ${poll.code}`
      );
    }
  };

  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <Typography sx={{ textAlign: "center", mt: 3 }}>My Polls</Typography>
      <Box sx={{ width: "80%", mx: "auto", my: 4 }}>
        {polls.length !== 0 ? (
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {polls.map((poll, index) => (
              <Card key={index} sx={{ maxWidth: 345, mx: "auto" }}>
                <CardContent
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    {poll.title}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body2"
                    component="div"
                    color="text.primary"
                    sx={{ my: 1 }}
                  >
                    {poll.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                      my: 1,
                    }}
                  >
                    <ThumbUpIcon color="primary" />
                    {poll.cachedVotes.green}
                    <ThumbDownIcon color="secondary" />
                    {poll.cachedVotes.red}
                  </Box>
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
                  <FormControlLabel
                    control={
                      <Switch
                        checked={poll.open}
                        onChange={(e) =>
                          handleTogglePoll(poll, e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label={poll.open ? "Poll is Open" : "Poll is Closed"}
                    labelPlacement="top"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            ))}
          </Masonry>
        ) : (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="h2">You have no polls created</Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              component={Link}
              to="/create-poll"
            >
              <Typography variant="button">Click here to create</Typography>
            </Button>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default MyPollsPage;
