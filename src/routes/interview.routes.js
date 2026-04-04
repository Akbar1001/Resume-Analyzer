const express=require("express");
const authmiddleware=require("../middleware/auth.middleware")
const interviewController=require("../controllers/interview.controller")


const interviewRouter=express.Router();

/**
 * @route - POST/api/interview
 * @description - generates new interview report on the basis of user self description, resume pdf and job description
 * @access - Private
 */
interviewRouter.post("/",authmiddleware.authUser,interviewController.generateInterviewReportController)


module.exports=interviewRouter;