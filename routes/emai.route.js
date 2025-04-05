import Router from "express";
import { email_validator } from "../middlware/email.midleware.js";

import {
  delete_email,
  get_emails,
  send_emails,
  get_count
} from "../controllers/email.controller.js";
import rateLimit from "express-rate-limit";

const email_router = Router();

// rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 100,
  validate: { xForwardedForHeader: false },
  message: "Too many hits",
});

email_router.post("/email", limiter, email_validator, send_emails);
email_router.get("/getemails", get_emails);
email_router.get("/deleteemail/:id", delete_email);
email_router.get("/getcount",get_count)
// email_router.post("/get-email");

export default email_router;
