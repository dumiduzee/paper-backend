import express from "express";
import Router from "express";
import {
  get_papers,
  get_subjects,
} from "../controllers/grades.controllers/get_papers.js";

const get_paper_router = Router();
get_paper_router.get("/get-subjects/:grade", get_subjects);
get_paper_router.get("/get-papers/:grade/:subject", get_papers);
export default get_paper_router;
