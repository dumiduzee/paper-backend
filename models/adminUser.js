import mongoose, { mongo } from "mongoose";

const admin_user = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  key_code: {
    type: String,
    required: true,
  },
});

const admin_model = mongoose.model("Admin_Key", admin_user);

export default admin_model;
