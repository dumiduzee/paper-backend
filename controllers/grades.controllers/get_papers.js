import express from "express";
import uploadModel from "../../models/uploadModel.js";

//grade1
//get subjects
export const get_subjects = async (req, res) => {
  try {
    const { grade } = req.params;
    const subjects = await uploadModel.find({ grade: grade });
    let data = Array.from(new Set(subjects.map((sub) => sub.subject)));
    res.status(200).json({
      error: false,
      subjects: data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      data: error.message,
    });
  }
};

//get papers
export const get_papers = async (req, res) => {
  try {
    const { grade, subject } = req.params;
    const papers = await uploadModel.find({ grade, subject });

    const data = papers.map((paper) => {
      return { name: paper.fileName, link: paper.filePaths[0] };
    });
    console.log(data);

    res.json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      data: error.message,
    });
  }
};
