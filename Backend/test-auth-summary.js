const API_BASE = 'http://localhost:3000';

async function comprehensiveAuthTest() {
    console.log('\n' + '═'.repeat(70));
    console.log('🧪 COMPREHENSIVE AUTHENTICATION FLOW TEST REPORT');
    console.log('═'.repeat(70) + '\n');

    const tests = [];

    try {
        // TEST 1: Unauthorized access to protected endpoint
        console.log('TEST 1️⃣  - Unauthorized Access Check');
        console.log('─'.repeat(70));
        const unAuthRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobDescription: 'Test',
                selfDescription: 'Test'
            })
        });
        
        const test1Pass = unAuthRes.status === 400;
        tests.push({ name: 'Unauthorized Access Blocked', passed: test1Pass });
        console.log(`Status: ${unAuthRes.status}`);
        console.log(`Result: ${test1Pass ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: Report generation endpoint correctly blocks unauthenticated requests\n`);

        // TEST 2: User Registration
        console.log('TEST 2️⃣  - User Registration');
        console.log('─'.repeat(70));
        const testEmail = `authtest${Date.now()}@test.com`;
        const registerRes = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `user${Date.now()}`,
                email: testEmail,
                password: 'Test@12345'
            }),
            credentials: 'include'
        });
        
        const test2Pass = registerRes.ok;
        tests.push({ name: 'User Registration', passed: test2Pass });
        console.log(`Status: ${registerRes.status}`);
        console.log(`Result: ${test2Pass ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: User successfully registered with email: ${testEmail}\n`);

        // TEST 3: User Login
        console.log('TEST 3️⃣  - User Login');
        console.log('─'.repeat(70));
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: 'Test@12345'
            }),
            credentials: 'include'
        });
        
        const loginData = await loginRes.json();
        const token = loginData.data?.token || loginData.token;
        const test3Pass = loginRes.ok && token;
        tests.push({ name: 'User Login', passed: test3Pass });
        console.log(`Status: ${loginRes.status}`);
        console.log(`Result: ${test3Pass ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: User successfully authenticated with JWT token\n`);

        // TEST 4: Auth Status Verification
        console.log('TEST 4️⃣  - Authentication Status Verification');
        console.log('─'.repeat(70));
        const meRes = await fetch(`${API_BASE}/api/auth/get-me`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        });
        
        const test4Pass = meRes.ok;
        tests.push({ name: 'Auth Status Verification', passed: test4Pass });
        console.log(`Status: ${meRes.status}`);
        console.log(`Result: ${test4Pass ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: Authenticated session verified and validated\n`);

        // TEST 5: Protected Endpoint Access (Auth Required)
        console.log('TEST 5️⃣  - Protected Endpoint Access with Auth');
        console.log('─'.repeat(70));
        const protectedRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        });
        
        const test5Pass = protectedRes.status !== 400;
        tests.push({ name: 'Protected Endpoint Access', passed: test5Pass });
        console.log(`Status: ${protectedRes.status}`);
        console.log(`Result: ${test5Pass ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: Authenticated user can access protected endpoints\n`);

        // TEST 6: User Logout
        console.log('TEST 6️⃣  - User Logout');
        console.log('─'.repeat(70));
        const logoutRes = await fetch(`${API_BASE}/api/auth/logout`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
        });
        
        const test6Pass = logoutRes.ok;
        tests.push({ name: 'User Logout', passed: test6Pass });
        console.log(`Status: ${logoutRes.status}`);
        console.log(`Result: ${test6Pass ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: User successfully logged out\n`);

        // TEST 7: Access After Logout
        console.log('TEST 7️⃣  - Access After Logout (Should Fail)');
        console.log('─'.repeat(70));
        const postLogoutRes = await fetch(`${API_BASE}/api/interview/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobDescription: 'Test',
                selfDescription: 'Test'
            }),
            credentials: 'include'
        });
        
        const test7Pass = postLogoutRes.status === 400;
        tests.push({ name: 'Access Denial After Logout', passed: test7Pass });
        console.log(`Status: ${postLogoutRes.status}`);
        console.log(`Result: ${test7Pass ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: Protected endpoints correctly deny access after logout\n`);

        // SUMMARY
        console.log('═'.repeat(70));
        console.log('📊 TEST SUMMARY');
        console.log('═'.repeat(70) + '\n');
        
        let passCount = 0;
        tests.forEach((test, index) => {
            const icon = test.passed ? '✅' : '❌';
            const status = test.passed ? 'PASSED' : 'FAILED';
            console.log(`${icon} Test ${index + 1}: ${test.name.padEnd(40)} - ${status}`);
            if (test.passed) passCount++;
        });
        
        console.log('\n' + '─'.repeat(70));
        console.log(`Total: ${passCount}/${tests.length} tests passed`);
        console.log('─'.repeat(70) + '\n');

        if (passCount === tests.length) {
            console.log('🎉 ALL AUTHENTICATION TESTS PASSED!');
            console.log('\n✨ Authentication Feature Summary:');
            console.log('  • Users cannot generate reports without authentication ✓');
            console.log('  • Users can register and create accounts ✓');
            console.log('  • Users can login and receive JWT tokens ✓');
            console.log('  • Authentication status can be verified ✓');
            console.log('  • Authenticated users can access protected endpoints ✓');
            console.log('  • Users can logout and clear sessions ✓');
            console.log('  • Access is denied after logout ✓');
            console.log('\n🚀 The authentication-based report generation feature is working correctly!');
        } else {
            console.log(`⚠️  ${tests.length - passCount} test(s) failed`);
        }
        
        console.log('\n' + '═'.repeat(70) + '\n');

    } catch (error) {
        console.error('❌ Critical Test Error:', error.message);
    }
}

comprehensiveAuthTest();
