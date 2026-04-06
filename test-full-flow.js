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
    try {
        console.log("=== TESTING INTERVIEWS REPORT GENERATION ===\n");
        
        // Register
        console.log("1. Registering user...");
        const email = `test_${Date.now()}@test.com`;
        const registerRes = await api.post('/api/auth/register', {
            email,
            password: 'Test@12345'
        });
        console.log("✓ Registration successful");
        console.log("  User ID:", registerRes.data.data.user._id);
        console.log("  Token:", registerRes.data.data.token ? "✓" : "✗");
        
        // Login
        console.log("\n2. Logging in...");
        const loginRes = await api.post('/api/auth/login', {
            email,
            password: 'Test@12345'
        });
        console.log("✓ Login successful");
        const token = loginRes.data.data.token;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log("  Token:", token ? "✓" : "✗");
        
        // Generate report
        console.log("\n3. Generating interview report...");
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
            const reportRes = await api.post('/api/interview/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log("✓ Report generation successful!");
            console.log("  Report ID:", reportRes.data.interviewReport._id);
            console.log("  Match Score:", reportRes.data.interviewReport.matchScore);
            console.log("  Job Title:", reportRes.data.interviewReport.title);
            console.log("  Technical Questions:", reportRes.data.interviewReport.technicalQuestions?.length || 0);
            console.log("  Behavioral Questions:", reportRes.data.interviewReport.behavioralQuestions?.length || 0);
            console.log("  Skill Gaps:", reportRes.data.interviewReport.skillGaps?.length || 0);
            console.log("  Preparation Days:", reportRes.data.interviewReport.preparationPlan?.length || 0);
            
        } catch (reportError) {
            console.log("✗ Report generation failed");
            console.log("  Status:", reportError.response?.status);
            console.log("  Error:", reportError.response?.data?.message || reportError.message);
            console.log("  Full response:", JSON.stringify(reportError.response?.data, null, 2).substring(0, 500));
        }
        
    } catch (error) {
        console.error("Test failed:", error.message);
        console.error("Response:", error.response?.data);
    }
}

testInterviewGeneration();
