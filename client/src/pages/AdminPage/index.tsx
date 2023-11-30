import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import ClearIcon from '@mui/icons-material/Clear';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Navbar from "../../components/Navbar";
import { getFrontPagePolls, deletePoll } from "../../services/pollService";
import Poll from "../../../../common/model/poll";
import AdminSearchbar from "../../components/Searchbars/AdminSearchbar";

// TODO: as the app grows bigger, we will add pagination.
const AdminPage: FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getFrontPagePolls().then((data) => {
      console.log("Fetched polls:", data);
      setPolls(data);
    });
  }, []);

  const handleDelete = async (code: string) => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      const success = await deletePoll(code);
      if (success) {
        // Refresh the polls list after successful deletion
        setPolls(polls.filter(poll => poll.code !== code));
      }
    }
  };

  const filteredPolls = polls.filter(poll => 
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ margin: 0, padding: 0, overflowX: "hidden" }}>
      <Navbar />
      <Typography sx={{ textAlign: "center", mt: 3 }}>Administration</Typography>
      <Box sx={{width: "60%", mx: 'auto', my: 2}}><AdminSearchbar onSearch={setSearchTerm} /></Box>
      <Box sx={{ width: "80%", mx: "auto", my: 4 }}>
      {filteredPolls.length !== 0 ? (
          <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {filteredPolls.map((poll, index) => (
              <Card key={index} sx={{ maxWidth: 345, mx: "auto" }}>
                <CardContent
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(poll.code)}
                    sx={{alignSelf: 'flex-end'}}
                  >
                    <ClearIcon />
                  </IconButton>
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
                </CardContent>
              </Card>
            ))}
          </Masonry>
        ) : (
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="h2">No polls available or invalid search terms</Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default AdminPage;
