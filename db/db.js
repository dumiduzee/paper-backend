import express from "express";
import mongoose from "mongoose";

export const connect_db = async (db_uri) => {
  try {
    await mongoose.connect(db_uri);
    console.log("database connected🎉");
  } catch (error) {
    console.log(error);
  }
};
