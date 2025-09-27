import { Pool } from "pg";
import { Patient } from "../types";

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
});

export const createPatient = async (patientData: {
  fullname: string;
  email: string;
  phone: string;
  countrycode: string;
  documentphoto: string;
}): Promise<Patient> => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO patients (id, fullname, email, phone, countrycode, documentphoto, createdat, updatedat)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;

    const id = `patient_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const values = [
      id,
      patientData.fullname,
      patientData.email,
      patientData.phone,
      patientData.countrycode,
      patientData.documentphoto,
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
};

export const getAllPatients = async (): Promise<Patient[]> => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM patients ORDER BY createdat DESC";
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.release();
  }
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  const client = await pool.connect();
  try {
    const query = "SELECT * FROM patients WHERE id = $1";
    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const query = "SELECT 1 FROM patients WHERE email = $1 LIMIT 1";
    const result = await client.query(query, [email]);
    return result.rows.length > 0;
  } finally {
    client.release();
  }
};
