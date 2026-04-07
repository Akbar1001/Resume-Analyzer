# Resume Analyzer - AI-Powered Interview Preparation

A full-stack application that uses Google Gemini AI to analyze job descriptions and create personalized interview preparation strategies.

**Live Demo**: Coming Soon! (Deploy with Vercel + Railway)

## Features

✨ **AI-Powered Analysis**
- Analyze job descriptions against your profile
- Get match score and skill gap analysis
- Generate technical and behavioral interview questions
- Create personalized 5-day preparation plan

🔐 **Secure Authentication**
- User registration and login with JWT
- Secure token management
- Password hashing with bcrypt

📄 **Resume Upload**
- Parse PDF resumes
- Extract relevant experience
- AI-powered resume tailoring

🎨 **Modern UI**
- React 19 + Vite
- Responsive design with SCSS
- Real-time form validation
- Loading states and error handling

## Tech Stack

### Frontend
- React 19 + Vite
- React Router v7
- Axios for API calls
- SCSS for styling
- ESLint for code quality

### Backend
- Node.js + Express
- MongoDB Atlas
- JWT authentication
- Multer for file uploads
- Google Gemini AI (2.5-Flash model)
- Puppeteer for PDF generation

### Database
- MongoDB Atlas (Cloud)
- Collections: Users, Interview Reports, Token Blacklist

## Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB URI (use MongoDB Atlas free tier)
- Google Gemini API key (free at https://ai.google.dev)

### 1. Clone Repository
```bash
git clone https://github.com/Akbar1001/Resume-Analyzer.git
cd Resume-Analyzer
```

### 2. Backend Setup
```bash
# Install dependencies
npm install


# Start server (runs on port 3000)
npm start
```

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start dev server (runs on port 5173+)
npm run dev

# Build for production
npm run build
```

### 4. Open Application
Visit: http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout and blacklist token
- `GET /api/auth/get-me` - Get current user info

### Interview Reports
- `POST /api/interview/` - Generate interview report (requires PDF/self-description)
- `GET /api/interview/` - Get all user's reports
- `GET /api/interview/report/:interviewId` - Get specific report
- `POST /api/interview/resume/pdf/:interviewReportId` - Generate resume PDF


```
Resume-Analyzer/
├── Frontend/                 # React/Vite application
│   ├── src/
│   │   ├── features/        # Auth, Interview features
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── src/                     # Express backend
│   ├── controllers/         # Business logic
│   ├── routes/             # API endpoints
│   ├── models/             # MongoDB schemas
│   ├── middleware/         # Auth, file upload
│   ├── services/           # AI, PDF generation
│   └── app.js
├── package.json
├── server.js               # Entry point
└── README.md
```

## Usage Flow

1. **Register/Login** → Create user account
2. **Home Page** → Fill job description + upload resume or self-description
3. **Generate** → AI analyzes and creates interview strategy
4. **View Report** → See questions, skill gaps, preparation plan
5. **Prepare** → Follow personalized preparation schedule

## Interview Report Contents

Each generated report includes:

- **Match Score** (0-100): How well your profile matches the job
- **5+ Technical Questions** with explanations and answer strategies
- **2-3 Behavioral Questions** tailored to the role
- **Skill Gaps** with severity levels (low/medium/high)
- **5-Day Preparation Plan** with daily tasks

## Error Handling

- Form validation with helpful error messages
- Auth error feedback (invalid credentials, token expired)
- AI service error recovery with fallbacks
- PDF parsing errors with alternative methods

## Legal & Privacy

- User passwords are hashed with bcrypt 
- No passwords stored in plain text
- MongoDB Atlas provides data encryption
- Google Gemini API handles text analysis
- Users can delete their accounts and data

## License

MIT License - feel free to use this project

## Stats

- 📊 **Frontend**: React 19, 5K+ lines
- 🖥️ **Backend**: Express.js, 2K+ lines  
- 🤖 **AI Integration**: Google Gemini 2.5-Flash
- ⚡ **Response Time**: <5 seconds for report generation
- 🔒 **Security**: JWT, bcrypt, CORS

