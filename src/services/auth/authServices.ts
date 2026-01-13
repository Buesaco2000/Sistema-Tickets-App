import axios from "axios";
import { RegisterPayload, User } from "../../types/User";
import * as authApi from "./authApi";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  token?: string;
  error?: string;
}

export const registerRequest = async (
  payload: RegisterPayload
): Promise<ApiResponse<User>> => {
  try {
    const data = await authApi.registerApi(payload);
    return { success: true, data: data.user, token: data.token };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error en registro",
    };
  }
};

export const loginRequest = async (
  email: string,
  password: string
): Promise<ApiResponse<any>> => {
  try {
    const data = await authApi.loginApi(email, password);
    return { success: true, data: data.data, token: data.token };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || err.message;
      return { success: false, error: message };
    }
    return { success: false, error: "Error inesperado" };
  }
};
