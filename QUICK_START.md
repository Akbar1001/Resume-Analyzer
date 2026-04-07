# Quick Start: Free Backend on Fly.io (5 Minutes)

## ⚡ Quick Deployment Steps

### 1️⃣ Install Fly CLI (2 mins)

**Windows:**
```powershell
# Option A: Download installer
# Go to https://fly.io/docs/hands-on/install-flyctl/

# Option B: Use Chocolatey
choco install flyctl

# Option C: Use npm
npm install -g @fly/cli

# Verify
fly version
```

**Mac:**
```bash
brew install flyctl
```

**Linux:**
```bash
curl https://fly.io/install.sh | sh
```

### 2️⃣ Authenticate (1 min)

```bash
fly auth login
# Opens browser, complete OAuth
```

### 3️⃣ Deploy Backend (2 mins)

```bash
cd d:\Resume Analyzer

# Deploy (first time)
fly deploy

# Set environment variables
fly secrets set MONGO_URI="mongodb+srv://akbarcode20_db_user:reeftVyRaO8GuBis@ra-cluster.pxfbbyr.mongodb.net/RA"
fly secrets set JWT_SECRET="131e369148e8cbede40662f12edc62dd2cc756863e8aa6f03ae1c22e969100cc"
fly secrets set GOOGLE_GENAI_API_KEY="AIzaSyC7kyH7J08mXVJGjiPxXiTCmX5qmTz2kug"
fly secrets set NODE_ENV="production"

# Redeploy with secrets
fly deploy
```

### 4️⃣ Get Your URL

```bash
fly info
# Copy URL: https://resume-analyzer.fly.dev
```

### 5️⃣ Update Vercel Frontend

1. Go to **Vercel Dashboard** → Your Project
2. **Settings** → **Environment Variables**
3. Update `VITE_API_URL=https://resume-analyzer.fly.dev`
4. Click **Redeploy**

---

## ✅ Done! Your Stack is Now Live

- ✅ Frontend: `https://yourapp.vercel.app`
- ✅ Backend: `https://resume-analyzer.fly.dev`
- ✅ Database: MongoDB Atlas
- ✅ AI: Google Gemini

**Total Cost: $0/month** 🎉

---

## 📋 Common Commands

```bash
# View logs
fly logs

# Check status
fly status

# Restart app
fly restart

# Redeploy latest code from GitHub
fly deploy

# View secrets
fly secrets list

# Update a secret
fly secrets set KEY="value"

# SSH into app
fly ssh console

# Monitor performance
fly metrics
```

---

## 🆘 Troubleshooting

**App won't start?**
```bash
fly logs  # Check error messages
```

**Port error?**
- Ensure `server.js` has: `const PORT = process.env.PORT || 3000;`

**Database connection fails?**
- Verify `MONGO_URI` is correct: `fly secrets list`
- Check MongoDB Atlas allows Fly.io IP (set to 0.0.0.0/0 in IP whitelist)

**Environment variables not loading?**
```bash
fly secrets list
fly ssh console
# Inside: echo $MONGO_URI
```

---

## 🚀 Next Steps

1. **Monitor your deployment**
   - Go to https://fly.io dashboard
   - Click your app → Monitoring

2. **Set up automatic updates**
   - Deploy happens automatically when you push to GitHub (if using GitHub Actions)

3. **Add custom domain (optional)**
   - Fly.io → Settings → Custom Domain
   - Point DNS to Fly.io nameservers

4. **Scale up later**
   - Free tier: 3 shared-cpu 256MB VMs
   - Paid tier: More resources, more VMs

---

**Your app is live! Share it with friends 🌍**
