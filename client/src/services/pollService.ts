import axios from 'axios';
import { CreatePollData } from '../types/pollTypes';
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

export const getFrontPagePolls = async() : Promise<Poll[]> => {
  let data = [
  { id: 1, creator: 'Frank Ove', title: 'Pizza eller Taco', private: 'No' },
  { id: 2, creator: 'Odd Jostein', title: 'Ingen Lekse', private: 'Yes' },
  { id: 3, creator: 'Per Gunnar', title: 'PS5 eller XBox', private: 'Yes' },
  { id: 4, creator: 'Olav Hansen', title: 'LoL vs Dota', private: 'No' },
  { id: 5, creator: 'Karoline Kvam', title: 'Erna vs Støre', private: 'No' },
  { id: 6, creator: 'Henriette Lien', title: 'Windows eller Mac', private: 'Yes' },
  { id: 7, creator: 'Sander Breivik', title: 'Android vs IPhone', private: 'No' },
  { id: 8, creator: 'Jens Hjortdal', title: 'Billigere kantine?', private: 'Yes' },
  { id: 9, creator: 'Karl Søreide', title: 'Mindre lekse', private: 'Yes' },
  { id: 10, creator: 'Emilie Tanstad', title: 'Ny bybane?', private: 'No' }
];

  let polls : Poll[] = data.map(e => {
    let base = { code: ''+e.id, ownerId: 'not-implemented', title: e.title, description: 'Test-'+Math.random(),
             private: e.private == 'Yes', open: true, creationUnix: 0, cachedVotes: { green: 1, red: 0 },
             timed: false };
    let extra = base.private ? { whitelist: [] } : { allowedVoteTypes: [] };
    return Object.assign(base, extra) as Poll;
  });

  return Promise.resolve(polls);
}