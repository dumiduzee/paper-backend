import multer from "multer";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import Upload from "../models/uploadModel.js";
import admin_model from "../models/adminUser.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Use memory storage to hold files temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage }).array("pdfs", 20);

export const handleFileUpload = (req, res) => {
  upload(req, res, async (err) => {
    const { key } = req.body;

    try {
      // Admin authorization is commented out as per your version
      const admin = await admin_model.findOne({ key_code: key });
      if (!admin) {
        return res.status(401).json({ message: "Unauthorized upload attempt." });
      }
      if (err) return res.status(500).json({ message: "File upload failed." });

      const { grade, subject, fileName } = req.body;
      console.log(fileName);

      const bucketName = "paperbuckert"; // your actual bucket name

      // Encode folder parts to make safe keys
      const encodedGrade = encodeURIComponent(`grade_${grade}`);
      const encodedSubject = encodeURIComponent(subject);

      const folderPath = `${encodedGrade}/${encodedSubject}`;

      const uploadedFilesUrls = [];

      for (const file of req.files) {
        // Encode fileName safely
        const safeFileName = encodeURIComponent(fileName.trim().replace(/ /g, "_"));
        const uniqueFileName = `${safeFileName}-${Date.now()}${path.extname(file.originalname)}`;
        console.log(uniqueFileName);
        

        const filePath = uniqueFileName

        // Upload file buffer to Supabase
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: "3600",
            upsert: false,
          });
          
          

        if (error) {
          console.error("Supabase upload error:", error);
          return res.status(500).json({ message: "Error uploading to storage." });
        }

        // Get public URL
        const { publicURL, error: urlError } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (urlError) {
          console.error("Supabase getPublicUrl error:", urlError);
          return res.status(500).json({ message: "Error getting public URL." });
        }

        uploadedFilesUrls.push(`${process.env.SUPABASE_URL}/storage/v1/object/public/${data.fullPath}`);
       ;
        
      }

      // Save URLs in MongoDB
      const newUpload = new Upload({
        grade,
        subject,
        fileName,
        filePaths: uploadedFilesUrls,
      });
      await newUpload.save();

      res.status(200).json({
        success: true,
        message: "Upload successful.",
        uploadedFiles: uploadedFilesUrls,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
};
