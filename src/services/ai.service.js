const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const geminiModel = "models/gemini-2.5-flash"


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    try {
        console.log("AI Service: Starting interview report generation");
        console.log("Resume length:", resume?.length || 0);
        console.log("Job Description length:", jobDescription?.length || 0);
        console.log("Self Description length:", selfDescription?.length || 0);

        const prompt = `You are an expert interview coach. Generate a comprehensive interview report for a candidate in valid JSON format with these exact fields and structure:

{
  "matchScore": <number 0-100>,
  "title": "<job title>",
  "technicalQuestions": [
    {
      "question": "<question text>",
      "intention": "<why this question is asked>",
      "answer": "<how to answer>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<question text>",
      "intention": "<why this question is asked>",
      "answer": "<how to answer>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "low|medium|high"
    }
  ],
  "preparationPlan": [
    {
      "day": <number>,
      "focus": "<focus area>",
      "tasks": ["<task1>", "<task2>"]
    }
  ]
}

Candidate Details:
Resume: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}
Job Description: ${jobDescription}

Generate 3-5 technical questions, 2-3 behavioral questions, 3-5 relevant skill gaps, and a 5-day preparation plan. Respond ONLY with valid JSON, no other text.`;

        console.log("AI Service: Sending request to Gemini API");
        
        const response = await ai.models.generateContent({
            model: geminiModel,
            contents: prompt
        })

        console.log("AI Service: Response received from Gemini API");
        console.log("Raw response:", response.text);
        
        // Strip markdown code block formatting if present
        let responseText = response.text.trim();
        if (responseText.startsWith('```')) {
            // Remove markdown code block wrapper: ```json ... ```
            responseText = responseText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```$/, '');
        }
        
        // Parse the response - it should be JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            // Try to extract JSON from the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("Could not extract valid JSON from API response");
            }
        }
        
        console.log("AI Service: Response parsed successfully");
        
        // Validate required fields
        const requiredFields = ['matchScore', 'title', 'technicalQuestions', 'behavioralQuestions', 'skillGaps', 'preparationPlan'];
        for (const field of requiredFields) {
            if (!result[field]) {
                console.warn(`Warning: Missing field "${field}" in AI response`);
                // Set default values for missing fields
                if (field === 'matchScore') result[field] = 0;
                if (field === 'title') result[field] = 'Interview Report';
                if (field === 'technicalQuestions') result[field] = [];
                if (field === 'behavioralQuestions') result[field] = [];
                if (field === 'skillGaps') result[field] = [];
                if (field === 'preparationPlan') result[field] = [];
            }
        }
        
        console.log("AI Service: Returning formatted response");
        return result

    } catch(error) {
        console.error("AI Service Error:", error);
        console.error("Error details:", error.message || error);
        throw error;
    }
}



async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    // Strip markdown code block formatting if present
    let responseText = response.text.trim();
    if (responseText.startsWith('```')) {
        // Remove markdown code block wrapper: ```json ... ```
        responseText = responseText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```$/, '');
    }

    const jsonContent = JSON.parse(responseText)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }