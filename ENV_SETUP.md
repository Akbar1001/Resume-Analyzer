# 🔐 Environment Setup Checklist

## Quick Setup for Developers (5 minutes)

### Step 1: Copy Environment Templates
```bash
# Backend
cp .env.example .env

# Frontend
cp Frontend/.env.example Frontend/.env
```

### Step 2: Get Your Credentials

#### MongoDB Atlas
1. Visit https://www.mongodb.com/cloud/atlas
2. Create cluster if needed
3. Click "Connect" → "Drivers"
4. Copy connection string
5. Replace in `.env`:
```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/RA
```

#### Google Gemini API
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Replace in `.env`:
```
GOOGLE_GENAI_API_KEY=YOUR_API_KEY_HERE
```

#### JWT Secret
Generate with Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Replace in `.env`:
```
JWT_SECRET=YOUR_GENERATED_SECRET
```

### Step 3: Setup Backend .env
Edit `d:\Resume Analyzer\.env`:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
GOOGLE_GENAI_API_KEY=...
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Step 4: Setup Frontend .env
Edit `d:\Resume Analyzer\Frontend\.env`:
```env
VITE_API_URL=http://localhost:3000
```

### Step 5: Verify Setup
```bash
# Check .env is ignored by git
git status

# Should NOT show .env file
# Should only show .env.example files
```

---

## ⚠️ Security Reminders

✅ **DO:**
- Keep `.env` file locally only
- Use environment variables for all secrets
- Use `.env.example` as template
- Rotate credentials if compromised
- Use `.gitignore` to exclude sensitive files

❌ **DON'T:**
- Commit `.env` to Git
- Share `.env` file with others
- Paste credentials in documentation
- Hardcode secrets in source code
- Share credentials via email

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "GOOGLE_GENAI_API_KEY is not set" | Add API key to `.env` |
| "Cannot connect to MongoDB" | Check MONGO_URI format and credentials |
| "JWT verification failed" | Ensure JWT_SECRET is set in `.env` |
| ".env file not found" | Run `cp .env.example .env` |

---

## File Structure
```
Resume Analyzer/
├── .env                    # ❌ NEVER COMMIT (ignored by git)
├── .env.example            # ✅ Template for developers
├── .gitignore              # ✅ Rules for ignored files
├── SECURITY_GUIDE.md       # ✅ Full security documentation
├── Frontend/
│   ├── .env                # ❌ NEVER COMMIT
│   └── .env.example        # ✅ Template
└── src/
    └── ...
```

---

## Environment Variable Flow

### How Variables Reach Your App

**Backend:**
```
.env file
    ↓
process.env (Node.js)
    ↓
src/config/database.js (uses process.env.MONGO_URI)
src/services/ai.service.js (uses process.env.GOOGLE_GENAI_API_KEY)
src/middleware/auth.middleware.js (uses process.env.JWT_SECRET)
```

**Frontend:**
```
.env file
    ↓
import.meta.env (Vite)
    ↓
Frontend/src/features/interview/services/interview.api.js
    (uses import.meta.env.VITE_API_URL)
```

---

## GitHub Security

### Before Pushing Code

1. Check git status:
   ```bash
   git status
   ```
   Make sure `.env` files are NOT listed

2. Verify .gitignore is working:
   ```bash
   git check-ignore .env Frontend/.env
   # Should show they are ignored
   ```

3. Scan for secrets:
   ```bash
   git grep -i "api" .env.example
   # Should only show example placeholders
   ```

---

## Deployment

### For Production Deployment

❌ DON'T: Copy `.env` file to server

✅ DO: Set variables in platform dashboard:
- Railway: Variables section
- Render: Environment tab
- Heroku: Config Vars
- Fly.io: fly secrets set

Example for Fly.io:
```bash
fly secrets set MONGO_URI="your_real_uri"
fly secrets set JWT_SECRET="your_real_secret"
fly secrets set GOOGLE_GENAI_API_KEY="your_real_key"
```

---

## Questions?

Refer to [SECURITY_GUIDE.md](SECURITY_GUIDE.md) for detailed information.

Remember: **Good security practices protect your data and your users!** 🔒
