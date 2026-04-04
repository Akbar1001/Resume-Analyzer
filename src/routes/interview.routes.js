const express=require("express");
const authmiddleware=require("../middleware/auth.middleware")
const interviewController=require("../controllers/interview.controller")
const upload=require("../middleware/file.middleware")

const interviewRouter=express.Router();

/**
 * @route - POST/api/interview
 * @description - generates new interview report on the basis of user self description, resume pdf and job description
 * @access - Private
 */
interviewRouter.post("/",authmiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController)


module.exports=interviewRouter;