const pdfparse=require("pdf-parse");
const generateInterviewReport=require("../services/ai.service");
const interviewReportModel=require("../models/InterviewReport.Model")

async function generateInterviewReportController(req,res){
    
    const resumeContent= await (new pdfparse.PDFParse(Uint8Array.from (req.file.buffer))).getText();
    const {selfDescription, jobDescription} =req.body;

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume:resumeContent.text,
        selfDescription,
        jobDespriction,
        ...interViewReportByAi
    })

    res.status(200).json({
        message:"Interview Report created Successfully",
        interviewReport
    })
}

module.exports={generateInterviewReportController}