const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173"

app.use(express.json())
app.use(cookieParser())
const allowedOrigins = new Set([
    frontendOrigin,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://resume-analyzer-krrc.vercel.app",
])

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (curl, server-to-server) with no Origin header
        if (!origin) return callback(null, true)

        const isLocalhostVite =
            /^http:\/\/localhost:\d+$/.test(origin) ||
            /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)

        if (allowedOrigins.has(origin) || isLocalhostVite) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app