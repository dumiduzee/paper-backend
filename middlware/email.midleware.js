import express from "express";
import { ExpressValidator, body, validationResult } from "express-validator";
import email_model from "../models/emaiModel.js";

export const email_validator = [
  body("email")
    .isEmail()
    .withMessage("Need valid email address")
    .notEmpty()
    .withMessage("Email field required"),
  body("name").notEmpty().withMessage("Name field required"),
  body("subject").notEmpty().withMessage("Subject field required"),
  body("message").notEmpty().withMessage("Message field required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ status: false, message: errors.array() });
    }
    next();
  },
];
