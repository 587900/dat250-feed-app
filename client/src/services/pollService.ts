import axios from 'axios';
import { CreatePollData } from '../types/clientTypes';
import Poll from '../../../common/model/poll';
import APIPoll from '../../../common/model/api-poll';

const API_BASE_URL = 'http://localhost:8080/api';

export const createPoll = async (pollData: CreatePollData) => {
    try {
      //const response = await axios.post(`${API_BASE_URL}/resource/poll/`, pollData);
      const response = await fetch(`${API_BASE_URL}/resource/poll/`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(pollData),
        headers: { "Content-Type": "application/json" }
      }).then(async res => {
        return {
          code: res.status,
          data: res.status == 200 ? await res.json() : await res.text(),
        };
      });
      console.log("Poll created:", response);
      // Handle successful creation
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error creating poll:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
};

export const getMyPolls = async () : Promise<APIPoll[]> => {
  return getPolls('?filter=mine');
  /*
  let p : Poll = { code: 'XYZ', title: 'Poll from PollService', description: 'My poll', private: true,
                   open: true, ownerId: 'test-user', creationUnix: 0, cachedVotes: { green: 1, red: 0 },
                   timed: false, whitelist: [] };
  return Promise.resolve([p]);
  */
}

export const getFrontPagePolls = async() : Promise<APIPoll[]> => {
  return getPolls();
}

export const getPollById = async (id: string): Promise<APIPoll | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/resource/poll/${id}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      const data = await response.json();
      return data as APIPoll;
    } else {
      console.error(`Failed to fetch poll with id ${id}, status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching poll with id ${id}:`, error);
    return null;
  }
};


export const getPolls = async (filter : string = '') : Promise<APIPoll[]> => {
  const response = await fetch(`${API_BASE_URL}/resource/poll/${filter}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }).then(async res => {
    return {
      code: res.status,
      data: res.status == 200 ? await res.json() : await res.text()
    }
  });

  if (response.code != 200) {
    console.error(`getPolls${filter} got status code: '${response.code}', returning empty list...`);
    return [];
  }
  console.log('Response from getPolls:', response.data);
  return response.data as APIPoll[];
}