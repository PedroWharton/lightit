import { Request, Response } from "express";
import { ApiResponse, Patient } from "../types";
import { sendConfirmationEmail } from "../services/emailService";
import {
  createPatient as dbCreatePatient,
  getAllPatients as dbGetAllPatients,
  getPatientById as dbGetPatientById,
  checkEmailExists,
} from "../services/database";

export const createPatient = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, countryCode, documentPhoto } = req.body;

    const emailExists = await checkEmailExists(email);

    if (emailExists) {
      const response: ApiResponse = {
        success: false,
        error: "Email already exists",
      };
      return res.status(400).json(response);
    }

    const patient = await dbCreatePatient({
      fullname: fullName,
      email,
      phone,
      countrycode: countryCode,
      documentphoto: documentPhoto,
    });

    try {
      await sendConfirmationEmail(patient);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    const response: ApiResponse<Patient> = {
      success: true,
      data: patient,
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error("Error creating patient:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to create patient",
    };
    return res.status(500).json(response);
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await dbGetAllPatients();

    const response: ApiResponse<Patient[]> = {
      success: true,
      data: patients,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error fetching patients:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch patients",
    };
    return res.status(500).json(response);
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const patient = await dbGetPatientById(id);

    if (!patient) {
      const response: ApiResponse = {
        success: false,
        error: "Patient not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<Patient> = {
      success: true,
      data: patient,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error fetching patient:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to fetch patient",
    };
    return res.status(500).json(response);
  }
};
