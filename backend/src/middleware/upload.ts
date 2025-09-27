import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `document-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Only JPG images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const processImage = async (filePath: string): Promise<string> => {
  const processedPath = filePath.replace(".jpg", "-processed.jpg");

  await sharp(filePath)
    .resize(800, 600, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(processedPath);

  fs.unlinkSync(filePath);
  fs.renameSync(processedPath, filePath);

  return filePath;
};
