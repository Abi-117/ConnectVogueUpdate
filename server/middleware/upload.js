import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

// ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (_, file, cb) => {
  const allowedExt = /jpeg|jpg|png|webp/;
  const extValid = allowedExt.test(
    path.extname(file.originalname).toLowerCase()
  );

  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  const mimeValid = allowedMimes.includes(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only jpeg, jpg, png, webp images are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export default upload;
