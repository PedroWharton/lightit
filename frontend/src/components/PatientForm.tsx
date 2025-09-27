import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { FormData, FormErrors } from "../types";
import { Upload, X, User, Mail, Phone, Globe } from "lucide-react";

interface PatientFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  loading: boolean;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, loading }) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type === "image/jpeg") {
        setSelectedFile(file);
        setValue("documentPhoto", file);
        setErrors((prev) => ({ ...prev, documentPhoto: undefined }));
      } else {
        setErrors((prev) => ({
          ...prev,
          documentPhoto: "Only JPG images are allowed",
        }));
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const removeFile = () => {
    setSelectedFile(null);
    setValue("documentPhoto", null);
  };

  const validateForm = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    // Full name validation
    if (!data.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(data.fullName)) {
      newErrors.fullName = "Full name can only contain letters and spaces";
    }

    // Email validation
    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!data.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must be a Gmail address";
    }

    // Phone validation
    if (!data.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(data.phone)) {
      newErrors.phone = "Phone number can only contain digits";
    }

    // Country code validation
    if (!data.countryCode.trim()) {
      newErrors.countryCode = "Country code is required";
    } else if (!/^\+\d{1,4}$/.test(data.countryCode)) {
      newErrors.countryCode =
        "Country code must start with + and contain 1-4 digits";
    }

    // Document photo validation
    if (!data.documentPhoto) {
      newErrors.documentPhoto = "Document photo is required";
    }

    return newErrors;
  };

  const handleFormSubmit = async (data: FormData) => {
    const validationErrors = validateForm(data);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await onSubmit(data);
  };

  const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-error-500 text-sm mt-1"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Full Name
        </label>
        <input
          {...register("fullName")}
          type="text"
          className={`input ${
            errors.fullName || formErrors.fullName ? "input-error" : ""
          }`}
          placeholder="Enter full name"
        />
        <ErrorMessage
          message={errors.fullName || formErrors.fullName?.message}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email Address
        </label>
        <input
          {...register("email")}
          type="email"
          className={`input ${
            errors.email || formErrors.email ? "input-error" : ""
          }`}
          placeholder="example@gmail.com"
        />
        <ErrorMessage message={errors.email || formErrors.email?.message} />
      </div>

      {/* Phone Number */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Country Code
          </label>
          <input
            {...register("countryCode")}
            type="text"
            className={`input ${
              errors.countryCode || formErrors.countryCode ? "input-error" : ""
            }`}
            placeholder="+598"
          />
          <ErrorMessage
            message={errors.countryCode || formErrors.countryCode?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number
          </label>
          <input
            {...register("phone")}
            type="text"
            className={`input ${
              errors.phone || formErrors.phone ? "input-error" : ""
            }`}
            placeholder="12345678"
          />
          <ErrorMessage message={errors.phone || formErrors.phone?.message} />
        </div>
      </div>

      {/* Document Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Document Photo
        </label>

        {selectedFile ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Document preview"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive || dragActive
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 hover:border-primary-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop the file here"
                : "Drag & drop a JPG file here, or click to select"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Only JPG images are allowed
            </p>
          </div>
        )}
        <ErrorMessage
          message={errors.documentPhoto || formErrors.documentPhoto?.message}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`w-full btn btn-primary py-3 px-6 rounded-lg font-medium ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Registering Patient..." : "Register Patient"}
      </motion.button>
    </form>
  );
};

export default PatientForm;
