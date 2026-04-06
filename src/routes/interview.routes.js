const express=require("express");
const authmiddleware=require("../middleware/auth.middleware")
const interviewController=require("../controllers/interview.controller")
const upload=require("../middleware/file.middleware")

const interviewRouter=express.Router();

// Middleware to parse resume uploads
interviewRouter.post("/",authmiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController)

// Specific routes (must come before generic GET /)
interviewRouter.get("/report/:interviewId", authmiddleware.authUser, interviewController.getInterviewReportByIdController)

interviewRouter.post("/resume/pdf/:interviewReportId", authmiddleware.authUser, interviewController.generateResumePdfController)

// Generic routes (must come after specific routes)
interviewRouter.get("/", authmiddleware.authUser, interviewController.getAllInterviewReportsController)

module.exports=interviewRouter;