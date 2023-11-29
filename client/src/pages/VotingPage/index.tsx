import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, Stack, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar";
import { getPollById, voteOnPoll, getUserVoteForPoll } from "../../services/pollService";
import APIPoll from "../../../../common/model/api-poll";

const VotingPage: FC = () => {
  const [poll, setPoll] = useState<APIPoll | null>(null);
  const [isPollOpen, setIsPollOpen] = useState<boolean>(false);
  const [userVote, setUserVote] = useState(null); 
  const [countdown, setCountdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [manuallyToggled, setManuallyToggled] = useState(false);
  const params = useParams<{ code?: string }>();
  const code = params.code;

  useEffect(() => {
    if (code) {
      getPollById(code).then((data) => {
        if (data) {
          setPoll(data);
          setIsPollOpen(data.open); 
          startCountdown(data);
        } else {
          setPoll(null);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
    if (code) {
        getUserVoteForPoll(code).then(vote => {
          if (vote) {
            setUserVote(vote.selection); // Assuming 'selection' is the property containing the vote
          }
        });
      }
    }, [code]);

  const startCountdown = (pollData) => {
    if (pollData.timed && pollData.timeoutUnix) {
      const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = pollData.timeoutUnix - now;

        if (distance < 0) {
          clearInterval(countdownTimer);
          setCountdown("Poll closed");
          setIsPollOpen(false); // Update poll status to closed
          return;
        }

        // Format and set the countdown string
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  };

  const handleVote = async (selection: string) => {
    if (code && isPollOpen) {
      const success = await voteOnPoll(code, selection);
      if (success) {
        console.log(`Voted '${selection}' on poll ${code}`);
      } else {
        console.error(`Failed to vote on poll ${code}`);
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!poll) {
    return (
      <Box textAlign='center' mt={4}>
        <Navbar />
        <Typography variant="h4">Poll not found</Typography>
        <Typography variant="body1">The poll you are trying to access does not exist, may have been removed, or it may be private.</Typography>
      </Box>
    );
  }

  return (
    <div>
      <Navbar />
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Card raised sx={{ width: "100%", maxWidth: 600 }}>
          <CardContent>
            {poll.timed && (
              <Typography variant="h6" gutterBottom textAlign="center">
                Time Remaining: {countdown}
              </Typography>
            )}
            <Typography variant="h4" gutterBottom textAlign="center">
              {poll.title}
            </Typography>
            <Typography variant="body1" mb={4} textAlign="center">
              {poll.description}
            </Typography>
            {userVote && (
            <Typography variant="body2" textAlign="center" color="textSecondary">
              You voted: {userVote === "green" ? "Yes" : "No"}
            </Typography>
          )}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => handleVote("green")}
                disabled={!isPollOpen}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => handleVote("red")}
                disabled={!isPollOpen}
              >
                No
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default VotingPage;
