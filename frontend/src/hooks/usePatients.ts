import { useState, useEffect } from "react";
import { Patient, ApiResponse } from "../types";
import { patientApi } from "../services/api";

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Patient[]> =
        await patientApi.getAllPatients();

      if (response.success && response.data) {
        setPatients(response.data);
      } else {
        setError(response.error || "Failed to fetch patients");
      }
    } catch (err) {
      setError("Failed to fetch patients");
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [patient, ...prev]);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    addPatient,
  };
};
