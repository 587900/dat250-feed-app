import axios from 'axios';
import { CreatePollData } from '../types/clientTypes';
import Poll from '../../../common/model/poll';

const API_BASE_URL = 'http://localhost:8080/api';

export const createPoll = async (pollData: CreatePollData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/resource/poll/`, pollData);
        console.log('Poll created:', response.data);
        // Handle successful creation
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating poll:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};

export const getMyPolls = async () : Promise<Poll[]> => {
  let p : Poll = { code: 'XYZ', title: 'Poll from PollService', description: 'My poll', private: true,
                   open: true, ownerId: 'test-user', creationUnix: 0, cachedVotes: { green: 1, red: 0 },
                   timed: false, whitelist: [] };
  return Promise.resolve([p]);
}