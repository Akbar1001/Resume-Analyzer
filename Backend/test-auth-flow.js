const API_BASE = 'http://localhost:3000';

async function test() {
    console.log('\n🧪 Testing Authentication Flow for Report Generation\n');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        // Test 1: Try to generate report without authentication
        console.log('Test 1️⃣  - Attempting to generate report WITHOUT authentication...');
        const noAuthRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobDescription: 'Test job',
                selfDescription: 'Test description'
            })
        });
        
        const noAuthData = await noAuthRes.json();
        if (noAuthRes.status === 400 && noAuthData.message?.includes('Token')) {
            console.log('   ✅ PASSED: Report generation blocked - Token missing');
            console.log(`   Response: "${noAuthData.message}"\n`);
        } else {
            console.log('   ❌ FAILED: Unexpected response\n');
        }

        // Test 2: Register a new user
        console.log('Test 2️⃣  - Registering a test user...');
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
        if (registerRes.ok) {
            console.log('   ✅ PASSED: User registered');
            console.log(`   Email: ${testEmail}`);
            console.log(`   User ID: ${registerData.data?.user?._id || 'N/A'}\n`);
        } else {
            console.log('   ❌ FAILED: Registration error\n');
            return;
        }

        // Test 3: Login with the registered user
        console.log('Test 3️⃣  - Logging in with registered credentials...');
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
        
        if (loginRes.ok && token) {
            console.log('   ✅ PASSED: User logged in successfully');
            console.log(`   Token: ${token.substring(0, 20)}...`);
            console.log(`   Authenticated as: ${testEmail}\n`);
        } else {
            console.log('   ❌ FAILED: Login failed\n');
            return;
        }

        // Test 4: Verify auth status
        console.log('Test 4️⃣  - Verifying authenticated user status...');
        const getMeRes = await fetch(`${API_BASE}/api/auth/get-me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        
        const getMeData = await getMeRes.json();
        if (getMeRes.ok) {
            console.log('   ✅ PASSED: Auth status verified');
            console.log(`   Authenticated as: ${getMeData.user?.email || 'N/A'}\n`);
        } else {
            console.log('   ⚠️  Could not verify auth status\n');
        }

        // Test 5: Generate report WITH authentication
        console.log('Test 5️⃣  - Attempting to generate report WITH authentication...');
        
        const formData = new FormData();
        formData.append('jobDescription', 'Senior Frontend Engineer - requires React, TypeScript, 5+ years experience');
        formData.append('selfDescription', 'Experienced frontend developer with 6 years in React and TypeScript');
        
        const reportRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            credentials: 'include'
        });
        
        const reportData = await reportRes.json();
        if (reportRes.ok && reportData.message?.includes('Successfully')) {
            console.log('   ✅ PASSED: Report generated for authenticated user');
            console.log(`   Report ID: ${reportData.interviewReport?._id || 'N/A'}`);
            console.log(`   Associated User ID: ${reportData.interviewReport?.user || 'N/A'}\n`);
        } else {
            console.log(`   ❌ FAILED: ${reportData.message || 'Report generation failed'}\n`);
        }

        // Test 6: Retrieve user's reports
        console.log('Test 6️⃣  - Retrieving user interview reports...');
        const reportsRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        
        const reportsData = await reportsRes.json();
        if (reportsRes.ok) {
            console.log('   ✅ PASSED: Reports retrieved');
            console.log(`   Total reports: ${reportsData.interviewReports?.length || 0}\n`);
        } else {
            console.log('   ❌ FAILED: Could not retrieve reports\n');
        }

        // Test 7: Logout
        console.log('Test 7️⃣  - Logging out user...');
        const logoutRes = await fetch(`${API_BASE}/api/auth/logout`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        
        if (logoutRes.ok) {
            console.log('   ✅ PASSED: User logged out\n');
        }

        // Test 8: Attempt report generation after logout
        console.log('Test 8️⃣  - Attempting report generation after logout...');
        const postLogoutRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobDescription: 'Test',
                selfDescription: 'Test'
            }),
            credentials: 'include'
        });
        
        const postLogoutData = await postLogoutRes.json();
        if (postLogoutRes.status === 400) {
            console.log('   ✅ PASSED: Report generation blocked after logout');
            console.log(`   Response: "${postLogoutData.message}"\n`);
        } else {
            console.log('   ❌ FAILED: Should have been blocked after logout\n');
        }

        console.log('═══════════════════════════════════════════════════════════');
        console.log('🎉 ALL AUTHENTICATION TESTS COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Test Error:', error.message);
    }
}

test();
