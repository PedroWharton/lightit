export interface Patient {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  countrycode: string;
  documentphoto: string;
  createdat: string;
  updatedat: string;
}

export interface CreatePatientRequest {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  documentPhoto: File;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export interface ModalState {
  isOpen: boolean;
  type: "success" | "error" | null;
  message: string;
}

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  documentPhoto: File | null;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  documentPhoto?: string;
}
