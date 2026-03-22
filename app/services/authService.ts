import { AuthResponse } from "../types";
import api from "./api";
import { AxiosResponse } from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const authService = {
  login: (data: LoginRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", data),

  register: (data: RegisterRequest): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),
};
