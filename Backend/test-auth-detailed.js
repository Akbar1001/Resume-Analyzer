const API_BASE = 'http://localhost:3000';

async function detailedTest() {
    console.log('\n🧪 Detailed Authentication & Report Generation Testing\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        // Register
        const testEmail = `test${Date.now()}@example.com`;
        const registerRes = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `user${Date.now()}`,
                email: testEmail,
                password: 'TestPassword123'
            }),
            credentials: 'include'
        });
        
        const registerData = await registerRes.json();
        console.log('✅ Registration: User registered');
        console.log(`   Email: ${testEmail}\n`);

        // Login
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: 'TestPassword123'
            }),
            credentials: 'include'
        });
        
        const loginData = await loginRes.json();
        const token = loginData.data?.token || loginData.token;
        console.log('✅ Login: User authenticated successfully');
        console.log(`   Token obtained: ${token ? 'Yes' : 'No'}\n`);

        // Test report generation with detailed error reporting
        console.log('🔍 Testing Report Generation with Authentication...\n');
        
        const formData = new FormData();
        formData.append('jobDescription', `Senior Frontend Engineer
        - 5+ years React experience
        - TypeScript proficiency
        - Redux/Zustand experience
        - Jest testing
        - Web performance optimization`);
        formData.append('selfDescription', `Software developer with 6 years experience
        - React and JavaScript
        - Basic TypeScript knowledge
        - Redux background
        - Unit testing experience
        - Web performance interested`);
        
        const reportRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            credentials: 'include'
        });
        
        const reportData = await reportRes.json();
        
        console.log(`Response Status: ${reportRes.status}`);
        console.log(`Response OK: ${reportRes.ok}\n`);
        
        console.log('Response Data:');
        console.log(JSON.stringify(reportData, null, 2).substring(0, 800));
        
        if (reportRes.ok) {
            console.log('\n✅ Report Generated Successfully!');
            console.log(`   Report ID: ${reportData.interviewReport?._id}`);
            console.log(`   User ID: ${reportData.interviewReport?.user}`);
            console.log(`   Job Title: ${reportData.interviewReport?.title}`);
        } else {
            console.log('\n⚠️  Report Generation Failed');
            console.log(`   Error: ${reportData.message || 'Unknown error'}`);
        }

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

detailedTest();
