import axios from "axios";
import { LoginUserData } from "../types/clientTypes";


const API_BASE_URL = "http://localhost:8080/auth";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/local`, {
      method: "GET", // Changed from POST to GET as per your new route
      credentials: "include", // Include credentials for cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Include email and password in the body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Login failed', error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/local/register`, userData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS", 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Registration failed', error);
    throw error;
  }
};

export const checkAuthState = async (contextLogin) => {
  try {
    const response = await fetch(`${API_BASE_URL}/check`, {
      credentials: 'include', // Ensure to include credentials for cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.authenticated) {
      contextLogin(data.user);
    }
  } catch (error) {
    console.error('Authentication check failed', error);
  }
};
