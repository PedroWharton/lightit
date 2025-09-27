import { body, ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ApiResponse, ValidationError } from "../types";

export const validatePatientRegistration: ValidationChain[] = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Full name can only contain letters and spaces"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .custom((value: string) => {
      if (!value.endsWith("@gmail.com")) {
        throw new Error("Email must be a Gmail address");
      }
      return true;
    }),

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 7, max: 15 })
    .withMessage("Phone number must be between 7 and 15 digits")
    .matches(/^\d+$/)
    .withMessage("Phone number can only contain digits"),

  body("countryCode")
    .notEmpty()
    .withMessage("Country code is required")
    .matches(/^\+\d{1,4}$/)
    .withMessage("Country code must start with + and contain 1-4 digits"),

  body("documentPhoto")
    .notEmpty()
    .withMessage("Document photo is required")
    .isString()
    .withMessage("Document photo must be a valid file path"),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors: ValidationError[] = errors.array().map((error) => ({
      field: error.type === "field" ? (error as any).path : "unknown",
      message: error.msg,
    }));

    const response: ApiResponse = {
      success: false,
      errors: validationErrors,
    };

    return res.status(400).json(response);
  }

  return next();
};
