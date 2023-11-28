import axios from "axios";
import { LoginUserData } from "../types/clientTypes";



const api = axios.create({
  baseURL: "http://localhost:8080/auth",
});

export const login = async (
  email: string,
  password: string
): Promise<{ user: LoginUserData; token: string }> => {
  const response = await api.post<{ user: LoginUserData; token: string }>(
    "/local",
    { email, password }
  );
  return response.data;
};

export const register = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ user: LoginUserData; token: string }> => {
  const response = await api.post<{ user: LoginUserData; token: string }>(
    "/local/register",
    userData
  );
  return response.data;
};

export const checkAuthState = async (contextLogin: any) => {
  try {
      //const response = await axios.get('http://localhost:8080/auth/check'); // API endpoint to validate token
      const response = await fetch('http://localhost:8080/auth/check', { credentials: 'include' }).then(r => r.json());
      console.log("auth response", response);
      if (response?.authenticated) {
          contextLogin(response.user);
      }
      
  } catch (error) {
      console.error('Authentication failed', error);
  }
};

