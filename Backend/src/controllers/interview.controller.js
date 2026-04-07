const pdfParseLib = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel=require("../models/InterviewReport.Model")

async function extractPdfText(fileBuffer) {
    // pdf-parse has different APIs across versions; support both.
    if (typeof pdfParseLib === "function") {
        const parsed = await pdfParseLib(fileBuffer);
        return parsed?.text || "";
    }

    if (pdfParseLib?.PDFParse) {
        const parser = new pdfParseLib.PDFParse(Uint8Array.from(fileBuffer));
        const parsed = await parser.getText();
        return parsed?.text || "";
    }

    throw new Error("Unsupported pdf-parse module format");
}

async function generateInterviewReportController(req,res){
    try {
        console.log("Starting interview report generation...");
        
        if (!req.file) {
            console.log("No resume file provided, using self description instead");
        } else {
            console.log("Resume file received:", req.file.originalname);
        }

        let resumeContent = "";
        if (req.file) {
            try {
                resumeContent = await extractPdfText(req.file.buffer);
            } catch (pdfError) {
                return res.status(400).json({
                    message: "Could not read resume PDF. Please upload a valid PDF file.",
                    error: pdfError.message
                });
            }
        }

        const {selfDescription, jobDescription} = req.body;
        
        console.log("Job Description length:", jobDescription?.length);
        console.log("Self Description length:", selfDescription?.length);

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        console.log("Calling AI service...");
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription
        })

        console.log("AI service response received");

        if (!req.user?.id) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDespriction: jobDescription,
            ...interViewReportByAi
        })

        console.log("Interview report saved to database");

        res.status(200).json({
            message:"Interview Report created Successfully",
            interviewReport
        })
    } catch(error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: "Error generating interview report",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })
        
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        res.status(200).json({
            message: "Interview report retrieved successfully",
            interviewReport
        })
    } catch(error) {
        res.status(500).json({
            message: "Error retrieving interview report",
            error: error.message
        })
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
        
        res.status(200).json({
            message: "All interview reports retrieved successfully",
            interviewReports
        })
    } catch(error) {
        res.status(500).json({
            message: "Error retrieving interview reports",
            error: error.message
        })
    }
}

async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })
        
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            })
        }

        const pdfBuffer = await generateResumePdf({
            resume: interviewReport.resume || "",
            selfDescription: interviewReport.selfDescription || "",
            jobDescription: interviewReport.jobDespriction
        })

        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", `attachment; filename=resume_${interviewReportId}.pdf`)
        res.status(200).send(pdfBuffer)
    } catch(error) {
        res.status(500).json({
            message: "Error generating resume PDF",
            error: error.message
        })
    }
}

module.exports={generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController}