import axios from "axios";
import { LoginUserData } from "../types/clientTypes";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const login = async (
  email: string,
  password: string
): Promise<{ user: LoginUserData; token: string }> => {
  const response = await api.post<{ user: LoginUserData; token: string }>(
    "/user/login",
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
    "/user/register",
    userData
  );
  return response.data;
};

