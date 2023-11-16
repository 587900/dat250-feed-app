// pollService.ts
import axios from 'axios';
import { CreatePollData } from '../types/pollTypes';
import Poll from '../../../common/model/poll';

const API_BASE_URL = 'http://localhost:3000/api';

export const createPoll = async (pollData: CreatePollData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resource/poll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pollData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Poll created:', data);
      // Handle successful creation
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

export const getMyPolls = async () : Promise<Poll[]> => {
  let p : Poll = { code: 'XYZ', title: 'Poll from PollService', description: 'My poll', private: true,
                   open: true, ownerId: 'test-user', creationUnix: 0, cachedVotes: { green: 1, red: 0 },
                   timed: false, whitelist: [] };
  return Promise.resolve([p]);
}