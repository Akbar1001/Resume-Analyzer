const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || "AIzaSyC7kyH7J08mXVJGjiPxXiTCmX5qmTz2kug"
});

const geminiModel = "gemini-1.5-flash";

async function testAI() {
    try {
        console.log("Testing Gemini API with correct model...");
        
        // Try with gemini-2.5-flash
        const prompt = 'Generate JSON: {"test": "value"}';
        
        console.log("\nAttempting API call with gemini-2.5-flash...");
        const response = await ai.models.generateContent({
            model: "models/gemini-2.5-flash",
            contents: prompt
        });
        
        console.log("Success!");
        console.log("Response type:", typeof response);
        console.log("Response keys:", Object.keys(response));
        console.log("Response text:", response.text?.substring(0, 200));
        
    } catch (error) {
        console.error("Error:", error.message);
        console.error("Stack:", error.stack?.split('\n').slice(0, 5).join('\n'));
    }
}

testAI();
