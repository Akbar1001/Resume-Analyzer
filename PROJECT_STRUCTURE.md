# Resume Analyzer - Reorganized Project Structure

**Project Structure:** Frontend + Backend (Monorepo)

## 📁 Directory Structure

```
Resume-Analyzer/
├── Frontend/                    # React frontend application
│   ├── src/
│   │   ├── features/           # Feature modules (auth, interview)
│   │   ├── styles/             # Global styles
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── .env.example            # Frontend config template
│   ├── .env                     # Frontend config (local only)
│   └── vite.config.js
│
├── Backend/                     # Express backend API
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Express middleware
│   │   ├── config/             # Configuration
│   │   └── app.js
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── .env.example            # Backend config template
│   ├── .env                     # Backend config (local only)
│   ├── test-*.js               # Backend test scripts
│   └── diagnose-error.js       # Debugging utility
│
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
└── Documentation/              # (Optional) Security and deployment docs
    ├── SECURITY_GUIDE.md
    ├── ENV_SETUP.md
    └── DEPLOYMENT.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Google Gemini API key

### 1. Backend Setup

```bash
cd Backend

# Copy example env file
cp .env.example .env

# Edit .env with your credentials
# - MONGO_URI: Your MongoDB connection string
# - GOOGLE_GENAI_API_KEY: Your Google Gemini API key
# - JWT_SECRET: A random secret (kept for backwards compatibility)

# Install dependencies
npm install

# Start backend server
npm run dev
# Backend will run on http://localhost:3000
```

### 2. Frontend Setup

```bash
cd Frontend

# Copy example env file
cp .env.example .env

# Edit .env if needed
# - VITE_API_URL=http://localhost:3000

# Install dependencies
npm install

# Start frontend dev server
npm run dev
# Frontend will run on http://localhost:5174
```

---

## 📋 Environment Files

### Backend `.Backend/.env`
```env
# MongoDB Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/RA

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Google Gemini API
GOOGLE_GENAI_API_KEY=your-api-key

# Node Environment
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend `Frontend/.env`
```env
# Backend API URL
VITE_API_URL=http://localhost:3000
```

---

## 🔧 Available Scripts

### Backend
```bash
cd Backend

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Run tests (if configured)
npm test

# Run diagnostic tool
node diagnose-error.js
```

### Frontend
```bash
cd Frontend

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

---

## 🔗 API Endpoints

Base URL: `http://localhost:3000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user
- `GET /auth/get-me` - Get current user

### Interview Reports
- `POST /interview/` - Generate interview report (requires auth)
- `GET /interview/` - Get all user's reports (requires auth)
- `GET /interview/report/:interviewId` - Get specific report (requires auth)
- `POST /interview/resume/pdf/:interviewReportId` - Generate PDF (requires auth)

---

## 🔐 Security Features

- ✅ JWT authentication on all protected routes
- ✅ Password hashing with bcryptjs
- ✅ Token blacklist for logout
- ✅ Environment variables for sensitive data
- ✅ CORS protection
- ✅ Input validation

---

## 🌐 Deployment

### Deploy Backend

**Option 1: Railway**
```bash
# Push to GitHub first
git push origin main

# Connect Railway to your GitHub repo
# Set environment variables in Railway dashboard
```

**Option 2: Fly.io**
```bash
cd Backend
fly launch
fly secrets set MONGO_URI="your-uri"
fly secrets set GOOGLE_GENAI_API_KEY="your-key"
fly deploy
```

**Option 3: Heroku** (Legacy)
```bash
cd Backend
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend

**Option 1: Vercel**
```bash
# Push to GitHub first
# Connect Vercel to your GitHub repo
# Set VITE_API_URL to your backend URL
```

**Option 2: Netlify**
```bash
cd Frontend
npm run build
npm global add netlify-cli
netlify deploy --prod --dir=dist
```

---

## 📚 Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Fetch API / Axios
- **Styling**: SCSS/CSS
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **AI API**: Google Generative AI (Gemini)
- **File Upload**: Multer
- **PDF Processing**: pdf-parse
- **Web Automation**: Puppeteer

---

## 🧪 Testing

### Backend Tests
```bash
cd Backend
node test-auth-summary.js          # Run authentication tests
node test-full-flow.js             # Run full user flow
node diagnose-error.js             # Diagnose errors
```

### Frontend Testing
Currently no automated tests configured. Can be added using:
- Vitest (recommended for Vite)
- React Testing Library
- Playwright or Cypress (E2E)

---

## 🐛 Troubleshooting

### Backend Won't Start
1. Check if MongoDB URI is correct
2. Verify Node.js version (`node --version`)
3. Check if port 3000 is available
4. Run: `node Backend/diagnose-error.js`

### Frontend Won't Load
1. Verify VITE_API_URL is set correctly
2. Check if backend is running
3. Check browser console for CORS errors
4. Clear node_modules and reinstall: `npm ci`

### Report Generation Fails
1. Verify Google API key is valid
2. Check if API key is NOT rate-limited or revoked
3. Ensure MongoDB is connected
4. Check server logs for detailed error

### Authentication Issues
1. Clear browser cookies
2. Check JWT_SECRET is set in .env
3. Verify token is being sent in headers
4. Check MongoDB user model

---

## 📖 Documentation

Additional documentation files available in this repository:

- **[SECURITY_GUIDE.md](SECURITY_GUIDE.md)** - Security best practices
- **[ENV_SETUP.md](ENV_SETUP.md)** - Environment variable setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment instructions
- **[FIX_INTERVIEW_ERROR.md](FIX_INTERVIEW_ERROR.md)** - Troubleshooting guide

---

## 🔑 Getting Your Credentials

### Google Gemini API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create new API key"
4. Copy and save the key

### MongoDB Connection String
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create or select a cluster
3. Click "Connect"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

### JWT Secret
Generate a random secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL (Mac/Linux)
openssl rand -hex 32
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

ISC License - Feel free to use this project as a template

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Read the security and deployment documentation
3. Check backend server logs
4. Run the diagnostic tool: `node Backend/diagnose-error.js`

---

## ✨ Features

- ✅ User authentication with JWT
- ✅ Resume/PDF upload and parsing
- ✅ Job description analysis
- ✅ AI-powered interview preparation
- ✅ Technical & behavioral questions
- ✅ Skill gap analysis
- ✅ Day-by-day preparation plan
- ✅ Match scoring
- ✅ Responsive design
- ✅ Secure API endpoints

---

**Last Updated:** April 7, 2026

Happy coding! 🚀
