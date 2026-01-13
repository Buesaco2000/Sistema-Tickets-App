import { Tickets } from "../../types/common";
import { NotasCreditoPayload } from "../../types/notasCredito";
import { SoporteOPayload } from "../../types/soporteOtros";
import { SoportePayload } from "../../types/soportePlataforma";
import { ApiResponse } from "../auth/authServices";
import {
  createSoporteTicket,
  createSoporteNCTicket,
  createSoporteOTicket,
} from "./tickectsApi";

export const crearSoporteRequest = async (
  payload: SoportePayload
): Promise<ApiResponse<Tickets>> => {
  try {
    const data = await createSoporteTicket(payload);
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error en registro",
    };
  }
};

export const crearSoporteNCRequest = async (
  payload: NotasCreditoPayload
): Promise<ApiResponse<Tickets>> => {
  try {
    const data = await createSoporteNCTicket(payload);
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error en registro",
    };
  }
};

export const crearSoporteORequest = async (
  payload: SoporteOPayload
): Promise<ApiResponse<Tickets>> => {
  try {
    const data = await createSoporteOTicket(payload);
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: err.response?.data?.message || "Error en registro",
    };
  }
};
