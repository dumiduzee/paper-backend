import multer from "multer";
import path from "path";
import fs from "fs";
import Upload from "../models/uploadModel.js";
import admin_model from "../models/adminUser.js";

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { grade, subject } = req.body;

    const uploadDir = path.join("public/uploads", `grade_${grade}`, subject);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${req.body.fileName
      .trim()
      .replace(/ /g, "_")}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage }).array("pdfs", 10);

export const handleFileUpload = (req, res) => {
  upload(req, res, async (err) => {
    const { key } = req.body;
    console.log(key);

    const admin = await admin_model.findOne({ key_code: key });
    console.log(admin);

    if (!admin) {
      return res.status(500).json({ message: "File upload failed." });
    }
    if (err) return res.status(500).json({ message: "File upload failed." });

    try {
      const { grade, subject, fileName } = req.body;

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const fileUrls = req.files.map(
        (file) =>
          `${baseUrl}/uploads/grade_${grade}/${subject}/${file.filename
            .trim()
            .replace(/ /g, "_")}`
      );

      const newUpload = new Upload({
        grade,
        subject,
        fileName,
        filePaths: fileUrls,
      });
      await newUpload.save();

      res.status(200).json({
        success: true,
        message: "Upload successful.",
        uploadedFiles: fileUrls,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Error saving file data." });
    }
  });
};
