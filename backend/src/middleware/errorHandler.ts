import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  let statusCode = 500;
  let message = "Internal server error";

  if (error.code === "23505") {
    statusCode = 400;
    message = "Email already exists";
  } else if (error.code === "23503") {
    statusCode = 404;
    message = "Patient not found";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message;
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  const response: ApiResponse = {
    success: false,
    error: message,
  };

  res.status(statusCode).json(response);
};
