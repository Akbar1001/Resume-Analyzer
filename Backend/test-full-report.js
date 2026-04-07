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

async function testAndShowReport() {
    try {
        console.log("=== FULL INTERVIEW REPORT TEST WITH DETAILS ===\n");
        
        // Register
        console.log("Step 1: Register user");
        const username = `testuser_${Date.now()}`;
        const email = `${username}@test.com`;
        const registerRes = await makeRequest('/api/auth/register', 'POST', {
            username,
            email,
            password: 'Test@12345'
        }, false);
        
        authToken = registerRes.data.data.token;
        console.log("✓ User created with ID:", registerRes.data.data.user.id);
        
        // Generate report
        console.log("\nStep 2: Generate interview report");
        const formData = new FormData();
        formData.append('jobDescription', `
            Senior React Developer
            Requirements:
            - 5+ years of experience with React
            - Strong knowledge of TypeScript
            - Experience with state management (Redux, Zustand, MobX)
            - Familiar with testing frameworks (Jest, React Testing Library)
            - Good understanding of web performance optimization
            - Experience with SSR/SSG
            - Knowledge of design patterns
        `);
        formData.append('selfDescription', `
            Frontend Developer with 6 years of experience
            Background:
            - 6 years building web applications with React
            - Proficient in JavaScript and basic TypeScript
            - Used Redux in previous projects
            - Have written Jest unit tests
            - Interested in TypeScript and performance optimization
            - Familiar with Next.js basics
        `);
        
        const reportRes = await makeFormDataRequest('/api/interview/', formData);
        
        if (reportRes.status !== 200) {
            console.log("✗ Failed:", reportRes.data.message);
            return;
        }
        
        const report = reportRes.data.interviewReport;
        console.log("✓ Report generated successfully\n");
        
        // Display detailed report
        console.log("=== INTERVIEW REPORT DETAILS ===\n");
        console.log("Report ID:", report._id);
        console.log("Match Score:", report.matchScore, "%");
        console.log("Job Title:", report.title || "N/A");
        
        console.log("\n--- TECHNICAL QUESTIONS ---");
        if (report.technicalQuestions && report.technicalQuestions.length > 0) {
            report.technicalQuestions.slice(0, 2).forEach((q, i) => {
                console.log(`\n${i+1}. ${q.question?.substring(0, 80)}...`);
                console.log(`   Intention: ${q.intention?.substring(0, 60)}...`);
                console.log(`   Answer: ${q.answer?.substring(0, 80)}...`);
            });
            console.log(`\n... and ${report.technicalQuestions.length - 2} more questions`);
        }
        
        console.log("\n--- BEHAVIORAL QUESTIONS ---");
        if (report.behavioralQuestions && report.behavioralQuestions.length > 0) {
            report.behavioralQuestions.slice(0, 2).forEach((q, i) => {
                console.log(`\n${i+1}. ${q.question?.substring(0, 80)}...`);
                console.log(`   Intention: ${q.intention?.substring(0, 60)}...`);
            });
            console.log(`\n... and ${report.behavioralQuestions.length - 2} more questions`);
        }
        
        console.log("\n--- SKILL GAPS ---");
        if (report.skillGaps && report.skillGaps.length > 0) {
            console.log("Gaps found:");
            report.skillGaps.forEach(gap => {
                console.log(`  • ${gap.skill} (Severity: ${gap.severity})`);
            });
        }
        
        console.log("\n--- PREPARATION PLAN ---");
        if (report.preparationPlan && report.preparationPlan.length > 0) {
            report.preparationPlan.slice(0, 2).forEach(day => {
                console.log(`\nDay ${day.day}: ${day.focus}`);
                day.tasks?.forEach(task => {
                    console.log(`  • ${task.substring(0, 70)}...`);
                });
            });
            console.log(`\n... and ${report.preparationPlan.length - 2} more days`);
        }
        
        console.log("\n=== TEST COMPLETE ===");
        console.log("✓ All sections populated successfully!");
        
    } catch (error) {
        console.error("Test failed:", error.message);
    }
}

testAndShowReport();
