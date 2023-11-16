import axios from 'axios';
import { CreatePollData } from '../types/clientTypes';

const API_BASE_URL = 'http://localhost:8080/api';

export const createPoll = async (pollData: CreatePollData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/resource/poll`, pollData);
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
