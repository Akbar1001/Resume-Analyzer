const API_BASE = 'http://localhost:3000';
let authToken = '';

async function makeRequest(endpoint, method = 'GET', body = null, useAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (useAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body) {
        options.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    
    return { status: response.status, data };
}

async function makeFormDataRequest(endpoint, formData, useAuth = true) {
    const headers = {};
    
    if (useAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        body: formData,
        headers
    });
    
    const data = await response.json();
    return { status: response.status, data };
}

async function testInterviewGeneration() {
    try {
        console.log("=== TESTING INTERVIEWS REPORT GENERATION ===\n");
        
        // Register
        console.log("1. Registering user...");
        const username = `testuser_${Date.now()}`;
        const email = `${username}@test.com`;
        const registerRes = await makeRequest('/api/auth/register', 'POST', {
            username,
            email,
            password: 'Test@12345'
        }, false);
        
        if (registerRes.status !== 201) {
            console.log("✗ Registration failed:", registerRes.data.message);
            return;
        }
        console.log("✓ Registration successful");
        console.log("  User ID:", registerRes.data.data.user.id);
        
        // Get token from response
        authToken = registerRes.data.data.token || registerRes.data.token;
        console.log("  Token:", authToken ? "✓" : "✗");
        
        // Generate report
        console.log("\n2. Generating interview report...");
        const formData = new FormData();
        formData.append('jobDescription', `
            Senior React Developer
            - 5+ years of experience with React
            - Strong knowledge of TypeScript
            - Experience with state management (Redux, Zustand)
            - Familiar with testing frameworks (Jest, React Testing Library)
            - Good understanding of web performance optimization
        `);
        formData.append('selfDescription', `
            Software developer with 6 years of experience
            - Proficient in JavaScript and React
            - Basic TypeScript knowledge
            - Used Redux before
            - Have written unit tests
            - Interested in learning web performance
        `);
        
        try {
            const reportRes = await makeFormDataRequest('/api/interview/', formData);
            
            if (reportRes.status !== 200) {
                console.log("✗ Report generation failed");
                console.log("  Status:", reportRes.status);
                console.log("  Error:", reportRes.data.message);
                console.log("  Full Error:", JSON.stringify(reportRes.data, null, 2).substring(0, 300));
                return;
            }
            
            console.log("✓ Report generation successful!");
            const report = reportRes.data.interviewReport;
            console.log("  Report ID:", report._id);
            console.log("  Match Score:", report.matchScore);
            console.log("  Job Title:", report.title);
            console.log("  Technical Questions:", report.technicalQuestions?.length || 0);
            if (report.technicalQuestions?.length > 0) {
                console.log("    First Q:", report.technicalQuestions[0].question?.substring(0, 60) + "...");
            }
            console.log("  Behavioral Questions:", report.behavioralQuestions?.length || 0);
            console.log("  Skill Gaps:", report.skillGaps?.length || 0);
            console.log("  Preparation Days:", report.preparationPlan?.length || 0);
            
        } catch (reportError) {
            console.log("✗ Report generation request failed");
            console.log("  Error:", reportError.message);
        }
        
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

testInterviewGeneration();
