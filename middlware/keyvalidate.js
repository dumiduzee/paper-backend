import mongoose from "mongoose";
import express from "express";
import admin_model from "../models/adminUser.js";

// Key validation middleware
export const validateKey = async (req, res, next) => {
  const { key_validator } = req.body;
  console.log(key_validator);

  if (!key_validator) {
    return res.status(400).json({ message: "Key validator is required." });
  }

  try {
    const admin = await admin_model.findOne({ key_code: key_validator });
    console.log(admin);

    if (!admin) {
      return res.status(500).json({ message: "Invalid key" });
    }

    // If key is valid, move to the next middleware (file upload)
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error during key validation." });
  }
};
