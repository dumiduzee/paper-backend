import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
  grade: { type: Number, required: true },
  subject: { type: String, required: true },
  fileName: { type: String, required: true },
  filePaths: { type: [String], required: true },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model("Upload", uploadSchema);
