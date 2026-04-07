# Security Guide - Environment Variables & Secrets Management

## Overview
This document explains how to properly manage sensitive information (API keys, database credentials, JWT secrets) in the Resume Analyzer project.

---

## ⚠️ CRITICAL SECURITY RULES

### 1. NEVER commit `.env` files to Git
- `.env` contains sensitive credentials
- Once pushed to GitHub, credentials are compromised
- Use `.env.example` as a template instead

### 2. NEVER hardcode secrets in source code
- Never paste API keys directly in code files
- Always use environment variables via `process.env` or `import.meta.env`

### 3. NEVER share credentials in documentation
- Use placeholders like `your_api_key_here` in docs
- Share actual credentials only through secure channels
- Keep `.env` file locally only

---

## File Structure

### What Gets Committed to Git ✅
```
.env.example              # Template with placeholder values
.gitignore                # Rules for what to ignore
DEPLOYMENT.md             # Deployment guide with placeholders
FREE_DEPLOYMENT.md        # Free hosting guide with placeholders
```

### What NEVER Gets Committed ❌
```
.env                      # Local environment file with real credentials
.env.local                # Local overrides
.env.*.local              # Environment-specific variants
*.pem                     # Security certificates
*.key                     # Private keys
```

---

## Setup Instructions for Developers

### Step 1: Clone the Repository
```bash
git clone https://github.com/Akbar1001/Resume-Analyzer.git
cd Resume-Analyzer
```

### Step 2: Create Backend `.env` File
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual credentials
# Don't share this file with anyone!
```

### Step 3: Create Frontend `.env` File
```bash
# Copy the example file
cp Frontend/.env.example Frontend/.env

# Frontend typically only needs backend URL
```

### Step 4: Fill in Your Credentials

**Backend `.env`:**
```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/RA
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:3000
```

---

## How to Get Your Credentials

### 1. MongoDB URI
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create or select your cluster
3. Click "Connect" → "Drivers"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

### 2. JWT Secret
Generate a random string:
```bash
# On Mac/Linux
openssl rand -hex 32

# On Windows PowerShell
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create new API key"
3. Copy the key
4. Paste into `.env` as `GOOGLE_GENAI_API_KEY`

---

## Environment Variables Reference

### Backend Variables
| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGO_URI` | MongoDB database connection | `mongodb+srv://user:pass@cluster.mongodb.net/RA` |
| `JWT_SECRET` | Secret key for JWT tokens | Random 32-byte hex string |
| `GOOGLE_GENAI_API_KEY` | Google's Gemini API key | `AIzaSy...` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `3000` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` |

### Frontend Variables
| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

---

## Checking Your Setup

### Verify .env is Ignored
```bash
# Should show that .env is git-ignored
git status

# Output should NOT show .env file
```

### Verify No Secrets in Code
```bash
# Check for accidentally committed credentials
git log --all --full-history -- .env

# If output shows history, credentials are compromised!
# Generate new API keys immediately
```

### Test Environment Variables
```bash
# Backend
node -e "console.log('API Key:', process.env.GOOGLE_GENAI_API_KEY ? '✓ Set' : '✗ Missing')"

# Frontend (Vite)
npm run dev # Check console for confirmation
```

---

## Handling Compromised Credentials

### If You Accidentally Commit Credentials:

1. **Immediately rotate the credentials**
   ```bash
   # Google API: Generate new key from Google AI Studio
   # MongoDB: Change password in MongoDB Atlas
   # JWT: Generate new secret
   ```

2. **Remove from Git history** (for GitHub repositories)
   ```bash
   # Use git-filter-repo (recommended)
   pip install git-filter-repo
   git filter-repo --path .env --invert-paths
   git push -f
   ```

3. **Notify team members** to update their local `.env` files

4. **Update deployment platforms** with new credentials

---

## Deployment Security

### Railway/Render/Heroku/Fly.io

Never paste credentials into documentation. Instead:

1. Use platform's secure configuration panel
2. Set variables through CLI:
   ```bash
   # Example: Railway
   railway variables set MONGO_URI="your_actual_uri"
   railway variables set JWT_SECRET="your_actual_secret"
   railway variables set GOOGLE_GENAI_API_KEY="your_actual_key"
   ```

3. Verify no credentials in deployment logs

---

## Best Practices Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Never commit `.env` to Git
- [ ] Use `.env.example` as template only
- [ ] All API keys come from environment variables
- [ ] No hardcoded secrets in source files
- [ ] `.env.example` has only placeholder values
- [ ] Documentation uses `your_key_here` style placeholders
- [ ] Team members have own local `.env` files
- [ ] Production uses platform's secure config, not `.env` file
- [ ] Credentials are rotated periodically
- [ ] No credentials in logs or error messages

---

## Troubleshooting

### Error: "GOOGLE_GENAI_API_KEY is not set"
Solution: Make sure `.env` file exists with the key:
```bash
cp .env.example .env
# Then edit .env and add your actual key
```

### Error: "MONGO_URI connection failed"
Solution: Check that MongoDB URI is correct:
```bash
# Verify format: mongodb+srv://username:password@cluster.mongodb.net/database
# Check username/password don't have special characters that need URL encoding
```

### Error: "JWT_SECRET missing"
Solution: Generate and add to `.env`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and paste into .env as JWT_SECRET value
```

---

## Additional Resources

- [12-Factor App - Config](https://12factor.net/config)
- [OWASP - Secrets Management](https://owasp.org/www-community/Sensitive_Data_Exposure)
- [Environment Variables Best Practices](https://stackoverflow.com/questions/35891631/what-is-the-best-practices-to-set-environment-variables)

---

## Questions?

If you find any hardcoded secrets in the codebase, please:
1. Create a GitHub issue
2. Do NOT include the secret in the issue
3. Use masked values like `AIzaSy...`

Thank you for maintaining security! 🔒
