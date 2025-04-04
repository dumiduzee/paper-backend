import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import bodyParser from "body-parser";
import get_paper_router from "./routes/get.papers.js";
import { connect_db } from "./db/db.js";
import email_router from "./routes/emai.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Connection
connect_db(process.env.MONGO_URI);

// Serve Static Files
app.use("/uploads", express.static("public/uploads"));

// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("views"));

// Serve HTML File
app.get("/", (req, res) => {
  res.render("index");
});

// API Routes

app.use("/upload", uploadRoutes);
app.use("/api/v1/papers", get_paper_router);
app.use("/api/v1/contact", email_router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
