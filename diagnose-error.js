const fetch = require('node-fetch');

async function diagnoseError() {
    console.log('\n🔍 DIAGNOSING INTERVIEW REPORT GENERATION ERROR\n');
    console.log('═'.repeat(70) + '\n');

    // Check 1: Environment Variables
    console.log('Check 1: Environment Variables');
    console.log('─'.repeat(70));
    
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GOOGLE_GENAI_API_KEY'];
    const missingEnvVars = [];
    
    requiredEnvVars.forEach(varName => {
        const isSet = !!process.env[varName];
        const status = isSet ? '✅' : '❌';
        const value = isSet ? 
            (varName === 'GOOGLE_GENAI_API_KEY' 
                ? `${process.env[varName].substring(0, 20)}...` 
                : '[SET]') 
            : 'NOT SET';
        console.log(`${status} ${varName.padEnd(25)} ${value}`);
        
        if (!isSet && varName !== 'JWT_SECRET') {
            missingEnvVars.push(varName);
        }
    });
    
    if (missingEnvVars.length > 0) {
        console.log(`\n⚠️  ERROR: Missing environment variables: ${missingEnvVars.join(', ')}`);
        console.log('   Solution: Check your .env file and ensure all variables are set\n');
        return;
    }
    console.log('\n✅ All environment variables are set\n');

    // Check 2: API Key Format
    console.log('Check 2: Google API Key Format');
    console.log('─'.repeat(70));
    
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    const isValidFormat = apiKey && apiKey.startsWith('AIza');
    
    if (isValidFormat) {
        console.log(`✅ API Key format is valid (starts with 'AIza')`);
        console.log(`   Full format: ${apiKey.substring(0, 30)}...\n`);
    } else {
        console.log(`❌ API Key format is INVALID`);
        console.log(`   Expected format: AIzaSy...\n`);
        console.log('   Solution: Check your .env file for correct API key format\n');
        return;
    }

    // Check 3: Package Installation
    console.log('Check 3: Required Packages');
    console.log('─'.repeat(70));
    
    try {
        const GoogleGenAI = require('@google/genai');
        console.log(`✅ @google/genai package is installed\n`);
    } catch (err) {
        console.log(`❌ @google/genai package is NOT installed`);
        console.log('   Solution: Run: npm install\n');
        return;
    }

    // Check 4: Database Connection
    console.log('Check 4: MongoDB Connection Check');
    console.log('─'.repeat(70));
    
    try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState === 1) {
            console.log(`✅ MongoDB is connected\n`);
        } else {
            console.log(`⚠️  MongoDB connection status: ${mongoose.connection.readyState}`);
            console.log('   (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)\n');
        }
    } catch (err) {
        console.log(`⚠️  Could not check MongoDB: ${err.message}\n`);
    }

    // Check 5: Common Issues
    console.log('Check 5: Known Issues & Solutions');
    console.log('─'.repeat(70));
    
    console.log(`\n⚠️  MOST COMMON ISSUE: API Key has been reported as leaked`);
    console.log(`   Error message: "Your API key was reported as leaked. Please use another API key."`);
    console.log(`   This happens when the API key is exposed online (like in GitHub)\n`);
    
    console.log(`📋 SOLUTIONS (in order of likelihood):\n`);
    
    console.log(`1️⃣  Generate a NEW Google Gemini API Key`);
    console.log(`   → Go to: https://makersuite.google.com/app/apikey`);
    console.log(`   → Click "Create new API key"`);
    console.log(`   → Copy the new key\n`);
    
    console.log(`2️⃣  Update your .env file`);
    console.log(`   → Edit: .env`);
    console.log(`   → Change: GOOGLE_GENAI_API_KEY=new_key_here`);
    console.log(`   → Save the file\n`);
    
    console.log(`3️⃣  Restart your backend server`);
    console.log(`   → Press Ctrl+C to stop the server`);
    console.log(`   → Run: npm run dev\n`);
    
    console.log(`4️⃣  Try generating a report again\n`);
    
    console.log(`═`.repeat(70));
    console.log(`✅ Diagnosis complete!\n`);
}

diagnoseError().catch(err => {
    console.error('Diagnostic error:', err.message);
});
