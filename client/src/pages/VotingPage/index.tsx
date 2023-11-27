import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, Stack, CircularProgress } from "@mui/material";
import Navbar from "../../components/Navbar";
import { getPollById, voteOnPoll } from "../../services/pollService";
import APIPoll from "../../../../common/model/api-poll";

const VotingPage: FC = () => {
  const [poll, setPoll] = useState<APIPoll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ code?: string }>();
  const code = params.code;

  useEffect(() => {
    if (code) {
      getPollById(code).then((data) => {
        if (data) {
          setPoll(data);
        } else {
          setPoll(null);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [code]);

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
  };

  const handleVote = async (selection: string) => {
    if (code) {
      const success = await voteOnPoll(code, selection);
      if (success) {
        // Handle successful voting
        // Optionally, update UI or redirect user
        console.log(`Voted '${selection}' on poll ${code}`);
      } else {
        // Handle voting error
        console.error(`Failed to vote on poll ${code}`);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <Card raised sx={{ width: "100%", maxWidth: 600 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom textAlign="center">
              {poll.title}
            </Typography>
            <Typography variant="body1" mb={4} textAlign="center">
              {poll.description}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => handleVote("green")}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => handleVote("red")}
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
