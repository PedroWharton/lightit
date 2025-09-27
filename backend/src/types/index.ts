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
  documentPhoto: string;
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
