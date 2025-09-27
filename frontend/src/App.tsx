import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePatients } from "./hooks/usePatients";
import { patientApi } from "./services/api";
import { FormData, ModalState } from "./types";
import PatientCard from "./components/PatientCard";
import PatientForm from "./components/PatientForm";
import Modal from "./components/Modal";
import LoadingSpinner from "./components/LoadingSpinner";
import EmptyState from "./components/EmptyState";
import { Plus, Users } from "lucide-react";

function App() {
  const { patients, loading, error, fetchPatients, addPatient } = usePatients();
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    message: "",
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setFormLoading(true);

      if (!data.documentPhoto) {
        setModalState({
          isOpen: true,
          type: "error",
          message: "Please select a document photo",
        });
        return;
      }

      const createPatientRequest = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        countryCode: data.countryCode,
        documentPhoto: data.documentPhoto,
      };

      const response = await patientApi.createPatient(createPatientRequest);

      if (response.success && response.data) {
        addPatient(response.data);
        setShowForm(false);
        setModalState({
          isOpen: true,
          type: "success",
          message:
            "Patient registered successfully! A confirmation email has been sent.",
        });
      } else {
        if (response.errors && response.errors.length > 0) {
          const errorMessages = response.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join("\n");
          setModalState({
            isOpen: true,
            type: "error",
            message: `Validation errors:\n${errorMessages}`,
          });
        } else {
          setModalState({
            isOpen: true,
            type: "error",
            message: response.error || "Failed to register patient",
          });
        }
      }
    } catch (error) {
      console.error("Error creating patient:", error);
      setModalState({
        isOpen: true,
        type: "error",
        message: "Failed to register patient. Please try again.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      message: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Patients
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={fetchPatients} className="btn btn-primary px-4 py-2">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Patient Registration System
              </h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="btn btn-primary px-4 py-2 rounded-lg font-medium inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {patients.length === 0 ? (
          <EmptyState onAddPatient={() => setShowForm(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </main>

      {/* Patient Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="modal-content max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Register New Patient
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5 text-gray-500 rotate-45" />
                  </button>
                </div>

                <PatientForm
                  onSubmit={handleFormSubmit}
                  loading={formLoading}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Modal */}
      <Modal modalState={modalState} onClose={closeModal} />
    </div>
  );
}

export default App;
