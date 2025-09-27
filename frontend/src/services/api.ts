import axios from "axios";
import { Patient, ApiResponse, CreatePatientRequest } from "../types";

const API_BASE_URL = "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const patientApi = {
  getAllPatients: async (): Promise<ApiResponse<Patient[]>> => {
    const response = await api.get("/api/patients");
    return response.data;
  },

  getPatientById: async (id: string): Promise<ApiResponse<Patient>> => {
    const response = await api.get(`/api/patients/${id}`);
    return response.data;
  },

  createPatient: async (
    patientData: CreatePatientRequest
  ): Promise<ApiResponse<Patient>> => {
    try {
      const formData = new FormData();
      formData.append("fullName", patientData.fullName);
      formData.append("email", patientData.email);
      formData.append("phone", patientData.phone);
      formData.append("countryCode", patientData.countryCode);

      if (patientData.documentPhoto) {
        formData.append("documentPhoto", patientData.documentPhoto);
      }

      const response = await api.post("/api/patients", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return {
        success: false,
        error: "Network error occurred",
      };
    }
  },
};

export default api;
