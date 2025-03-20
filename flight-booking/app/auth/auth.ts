import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(
      `${API_URL}/api/auth/public/login`,
      credentials
    );
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    await axios.post(`${API_URL}/api/auth/public/register`, userData);
  },
};
