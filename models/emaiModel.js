import express from "express";
import mongoose from "mongoose";

const Email_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    initial: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    last_email_time: {
      type: String,
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const email_model = mongoose.model("Email", Email_Schema);
export default email_model;
