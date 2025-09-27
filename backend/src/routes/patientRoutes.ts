import { Router } from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
} from "../controllers/patientController";
import {
  validatePatientRegistration,
  handleValidationErrors,
} from "../middleware/validation";
import { upload, processImage } from "../middleware/upload";

const router = Router();

const uploadMiddleware = upload.single("documentPhoto");

router.post(
  "/",
  uploadMiddleware,
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Document photo is required",
        });
      }

      const processedImagePath = await processImage(req.file.path);

      req.body.documentPhoto = `/uploads/${req.file.filename}`;

      return next();
    } catch (error) {
      console.error("Error processing image:", error);
      return res.status(500).json({
        success: false,
        error: "Error processing image",
      });
    }
  },
  ...validatePatientRegistration,
  handleValidationErrors,
  createPatient
);

router.get("/", getAllPatients);

router.get("/:id", getPatientById);

export { router as patientRoutes };
