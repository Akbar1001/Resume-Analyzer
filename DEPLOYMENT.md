# Deployment Guide - Resume Analyzer

Your application is now on GitHub and ready to deploy! Here are the best options:

## Option 1: Deploy with Vercel + Railway (Recommended for Full-Stack)

### Frontend on Vercel (Free tier available)
1. Go to https://vercel.com
2. Click "New Project" → "Import Git Repository"
3. Select `Akbar1001/Resume-Analyzer`
4. Configure:
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
6. Click Deploy

### Backend on Railway (Free tier ~$5/month)
1. Go to https://railway.app
2. Click "New Project" → "GitHub Repo"
3. Connect and select `Resume-Analyzer`
4. Deploy Settings:
   - **Root Directory**: Leave empty (root)
   - Add Environment Variables from `.env`:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     GOOGLE_GENAI_API_KEY=your_gemini_api_key
     NODE_ENV=production
     PORT=3000
     ```
5. Railway generates a public URL for your backend
6. Update Vercel's `VITE_API_URL` to the Railway backend URL

---

## Option 2: Deploy with Render (All-in-one)

### Monorepo Deployment
1. Go to https://render.com
2. Create two services:

**Frontend Service:**
- Type: Static Site
- Build Command: `cd Frontend && npm install && npm run build`
- Publish Directory: `Frontend/dist`
- Environment: `VITE_API_URL=https://your-backend-url.onrender.com`

**Backend Service:**
- Type: Web Service
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: (same as above)

---

## Option 3: Deploy with Heroku (Legacy Platform, costs money now)

### For Backend Only
```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set GOOGLE_GENAI_API_KEY=your_api_key
```

---

## Step-by-Step: Deploy Frontend to Vercel (5 mins)

```bash
# 1. Go to https://vercel.com and sign up with GitHub
# 2. Click "New Project" 
# 3. Select "Import Git Repository"
# 4. Search for "Resume-Analyzer"
# 5. Configure:

Root Directory: Frontend
Build Command: npm run build
Output Directory: dist

# 6. Add Environment Variable:
VITE_API_URL=http://localhost:3000  # Change this once backend is deployed

# 7. Click "Deploy"
# Your site will be live in ~2-3 minutes!
```

---

## Step-by-Step: Deploy Backend to Railway (5 mins)

```bash
# 1. Go to https://railway.app and sign up with GitHub
# 2. Click "New Project" → "GitHub Repo"
# 3. Select "Resume-Analyzer"
# 4. Configure variables by adding to Railway dashboard:

MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/RA
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=production

# 5. Railway auto-deploys when you push to GitHub
# 6. Your backend URL will be: https://resume-analyzer-production.up.railway.app

# IMPORTANT: Never share or commit your actual API keys to GitHub!
# Use the hosting platform's secure config panel to set these values.
```

---

## Environment Variables Needed

### Frontend (.env or Vercel dashboard)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env or hosting dashboard)
```
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/RA
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
NODE_ENV=production
PORT=3000
```

**Note:** For secure credential management:
1. Never commit your .env file to Git
2. Use `.env.example` as a template
3. Set environment variables directly in your hosting platform's dashboard
4. For local development, copy `.env.example` to `.env` and fill in your values

---

## Testing After Deployment

1. Visit your Vercel deployed frontend
2. Register a new user
3. Try to generate an interview report
4. Verify the report displays all sections

---

## Custom Domain (Optional)

### For Vercel Frontend:
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain (e.g., resumeanalyzer.com)
3. Update DNS records at your domain registrar

### For Railway Backend:
1. Railway → Settings → Custom Domain
2. Add your domain (e.g., api.resumeanalyzer.com)

---

## Monitoring & Logs

### Vercel:
- Dashboard shows deployment status
- Click deployment to see logs
- Real-time analytics available

### Railway:
- Click project → Deployments tab
- View live logs in real-time
- Metrics show CPU, memory usage

---

## GitHub Actions (Auto-Deploy on Push)

Optional: Set up automatic deployment when you push to GitHub.

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID}}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID}}
          scope: ${{ secrets.VERCEL_ORG_ID}}
```

---

## Recommendations

✅ **Best Setup:**
- **Frontend**: Vercel (free, fast, easy)
- **Backend**: Railway ($5/month, good for full-stack)
- **Database**: MongoDB Atlas (free tier, already configured)
- **Total Cost**: ~$5/month

---

## Next Steps

1. ✅ Code is on GitHub
2. ⏭️ Deploy Frontend to Vercel
3. ⏭️ Deploy Backend to Railway
4. ⏭️ Update API URL in Vercel
5. ⏭️ Test the live application

Good luck! 🚀
