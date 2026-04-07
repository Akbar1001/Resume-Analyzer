# Free Backend Deployment Options

## Comparison

| Service | Free Tier | Always On? | Startup Time | Best For |
|---------|-----------|-----------|--------------|----------|
| **Render** | ✅ Yes (Web Service) | ❌ Spins down | 30-60s | Easy setup, hobby projects |
| **Fly.io** | ✅ Yes (3 shared-cpu-1x 256MB VMs) | ✅ Yes! | 2-5s | Always-on, reliable |
| **Google Cloud Run** | ✅ Limited free | ❌ Serverless | 1-5s | Usage-based, very cheap |
| **Koyeb** | ✅ Yes | ✅ Yes! | 2-5s | Similar to Fly.io |
| **Railway** | ⚠️ $5 credit | Depends | 2-5s | Very easy but not truly free |
| **Heroku** | ❌ No (killed free tier) | N/A | N/A | No longer recommended |

**RECOMMENDATION**: Use **Fly.io** for true free + always-on performance

---

## ⭐ Option 1: Fly.io (BEST - Truly FREE & Always On)

### Why Fly.io?
✅ FREE tier includes 3 shared-cpu-1x 256MB VMs  
✅ Application stays **always on** (doesn't spin down)  
✅ Good performance for hobby projects  
✅ Automatic HTTPS  
✅ Simple deployment  

### Step-by-Step Setup

**1. Create Fly.io Account**
```bash
# Go to https://fly.io
# Sign up with GitHub (easiest)
# Verify email
```

**2. Install Fly CLI**
```bash
# Windows (installers available)
# Or use: choco install flyctl

# OR download from https://fly.io/docs/hands-on/install-flyctl/
```

**3. Install Fly CLI via npm (Alternative)**
```bash
npm install -g @fly/cli
```

**4. Login to Fly.io**
```bash
fly auth login
# Opens browser, complete authentication
```

**5. Deploy Backend**
```bash
cd d:\Resume Analyzer

# Create fly.toml configuration
fly launch

# When prompted:
# - App name: resume-analyzer (or your choice)
# - Region: Choose closest to you (e.g., sjc for US West)
# - Postgres database? No
# - Skip Redis? Skip
```

**6. Add Environment Variables**
```bash
fly secrets set MONGO_URI="mongodb+srv://your_username:your_password@your_cluster.mongodb.net/RA"
fly secrets set JWT_SECRET="your_jwt_secret_key_here"
fly secrets set GOOGLE_GENAI_API_KEY="your_google_gemini_api_key_here"
fly secrets set NODE_ENV="production"
```

**⚠️ IMPORTANT SECURITY NOTE:**
Never share your actual credentials. Always use placeholder values in documentation.
Set your real credentials only in the hosting platform's secure console.

**7. Deploy**
```bash
fly deploy
```

**8. Get Your URL**
```bash
fly info
# Your app will be at: https://resume-analyzer.fly.dev
```

**9. Update Frontend**
- Go to Vercel dashboard
- Settings → Environment Variables
- Update `VITE_API_URL=https://resume-analyzer.fly.dev`
- Redeploy

---

## 🟣 Option 2: Render (Easiest but Spins Down)

### Why Render?
✅ FREE tier available  
✅ Super easy to deploy  
✅ Simple dashboard  
❌ Goes to sleep after 15 mins inactivity  

### Quick Setup

**1. Go to Render**
```
https://render.com
```

**2. Sign Up**
- Use GitHub account (easiest)
- Authorize Render

**3. Create Web Service**
- Click "+ New" → "Web Service"
- Select "Deploy from GitHub"
- Select `Resume-Analyzer` repo
- Configure:
  - **Name**: resume-analyzer
  - **Root Directory**: (leave empty)
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Free Plan**: Select it

**4. Add Environment Variables**
- Environment tab
- Add each variable:
  ```
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=...
  GOOGLE_GENAI_API_KEY=...
  NODE_ENV=production
  ```

**5. Deploy**
- Click "Deploy Web Service"
- Wait ~2-3 minutes
- Get URL: `https://resume-analyzer.onrender.com`

**6. Update Frontend**
- Vercel → Environment Variables
- `VITE_API_URL=https://resume-analyzer.onrender.com`

---

## ☁️ Option 3: Google Cloud Run (Pay-As-You-Go)

### Why Cloud Run?
✅ FREE tier generous (2 million requests/month)  
✅ Only pay per request  
✅ Good for low traffic  
❌ Cold starts (5-10 seconds)  

### Quick Setup

**1. Install Google Cloud CLI**
```bash
# Download from: https://cloud.google.com/sdk/docs/install
```

**2. Authenticate**
```bash
gcloud auth login
gcloud config set project your-project-id
```

**3. Build Image**
```bash
gcloud builds submit --tag gcr.io/your-project-id/resume-analyzer
```

**4. Deploy**
```bash
gcloud run deploy resume-analyzer `
  --image gcr.io/your-project-id/resume-analyzer `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --set-env-vars MONGO_URI=mongodb+srv://...,JWT_SECRET=...,GOOGLE_GENAI_API_KEY=...
```

**5. Get URL**
- Check Cloud Run console
- Copy service URL

---

## 🚀 RECOMMENDED: Fly.io Setup Guide (In Detail)

### Prerequisites
- GitHub account ✅
- Backend code on GitHub ✅
- Environment variables ready ✅

### Step 1: Install Fly CLI

**Windows Users:**
```powershell
# Go to https://fly.io/docs/hands-on/install-flyctl/
# Download installer and run it
# OR use this if installed:
choco install flyctl

# Verify installation
fly version
```

### Step 2: Configure Your App

In your project root (`d:\Resume Analyzer`), create or update `fly.toml`:

```toml
app = "resume-analyzer"
primary_region = "sjc"

[build]
  builder = "heroku"

[[services]]
  protocol = "tcp"
  internal_port = 3000
  processes = ["app"]

  [services.http_checks]
    enabled = true
    uri = "/api/auth/get-me"
    interval = 10000
    timeout = 5000
```

### Step 3: Create Dockerfile

Create file: `Dockerfile` in project root

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

### Step 4: Deploy

```bash
cd d:\Resume Analyzer

# Login
fly auth login

# Launch (first time only)
fly launch
# Choose region: sjc (US West) or nearest to you
# Skip Postgres and Redis

# Set secrets
fly secrets set MONGO_URI="mongodb+srv://your_username:your_password@your_cluster.mongodb.net/RA"
fly secrets set JWT_SECRET="your_jwt_secret_key_here"  
fly secrets set GOOGLE_GENAI_API_KEY="your_google_gemini_api_key_here"
fly secrets set NODE_ENV="production"

# ⚠️ IMPORTANT: Use your actual API keys in the commands above, not these placeholders!

# Deploy
fly deploy

# Check status
fly status
fly logs
```

### Step 5: Get URL

```bash
fly info
# Look for: https://resume-analyzer.fly.dev
```

### Step 6: Update Frontend

**In Vercel:**
1. Settings → Environment Variables
2. Update: `VITE_API_URL=https://resume-analyzer.fly.dev`
3. Redeploy

---

## Comparison Summary for Your Use Case

| Factor | Fly.io | Render | Cloud Run |
|--------|--------|--------|-----------|
| **Cost** | FREE | FREE | ~FREE* |
| **Uptime** | 99.9% | 99.9% | 99.9% |
| **Start-up** | 2-5s | 30-60s | 5-10s |
| **Always On** | ✅ YES | ❌ Spins down | ⚠️ Cold starts |
| **Ease** | Medium | Very Easy | Hard |
| **Best For** | Production | Hobby projects | Usage-based |

**My Recommendation: Use Fly.io** ✅

---

## Final Checklist

- [ ] Clone repo to local machine
- [ ] Install Fly CLI
- [ ] Create Dockerfile
- [ ] Create fly.toml
- [ ] Run `fly launch`
- [ ] Set secrets with `fly secrets set`
- [ ] Run `fly deploy`
- [ ] Test backend URL
- [ ] Update Vercel `VITE_API_URL`
- [ ] Test full application

---

## Troubleshooting

**Deployment fails?**
```bash
# Check logs
fly logs

# Restart
fly restart

# Redeploy
fly deploy --force
```

**Port issues?**
- Ensure `PORT=3000` is set
- Check `server.js` listens on process.env.PORT || 3000

**Environment variables not working?**
```bash
# Verify secrets set
fly secrets list

# Check app sees them
fly logs
```

**Need to scale up later?**
```bash
# Fly.io free tier is sufficient for hobby projects
# For production, upgrade to paid tier (~$30/month)
```

---

**Ready? Start with Fly.io! It's the best free option that stays always-on.** ✈️
