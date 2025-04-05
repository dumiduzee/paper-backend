import express from "express";
import email_model from "../models/emaiModel.js";

export const send_emails = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const initial = name[0];
    const now = new Date();
    const formattedDate =
      now.getFullYear().toString().slice(2) +
      "/" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(now.getDate()).padStart(2, "0");
    const email_box = new email_model({
      name,
      email,
      subject,
      message,
      initial,
      last_email_time: formattedDate,
    });
    await email_box.save();
    res.status(200).json({
      status: true,
      message: "Email sent successfull!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const get_emails = async (req, res) => {
  try {
    const emails = await email_model.find();
    const all_emails = emails.map((email) => {
      return {
        id: email._id,
        sender: {
          name: email.name,
          email: email.email,
          initial: email.initial,
        },
        subject: email.subject,
        preview: email.subject,
        body: `<p>Hello there${email.message},</p>`,
        date: email.last_email_time,
      };
    });
    res.status(200).json({
      all_emails,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const delete_email = async (req, res) => {
  try {
    const { id } = req.params;
    await email_model.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "email deleted",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
};

export const get_count = async (req, res) => {
  try {
    const count = await email_model.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
