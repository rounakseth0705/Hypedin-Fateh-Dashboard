import express from "express";
import "dotenv/config.js";
import cors from "cors";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { connectToDB } from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
// import { connectToRedis } from "./config/redis.js";

import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import ambassadorRouter from "./routes/ambassadorRoutes.js";
import cookieParser from "cookie-parser";
import inboxMessagesRouter from "./routes/inboxMessagesRoutes.js";


const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET","POST"],
        credentials: true
    }
});

// const isRedisConnected: boolean = await connectToRedis();

app.use(cors({
    origin: [process.env.FRONTEND_URL as string],
    methods: ["GET","POST","PUT","PATCH","DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'", process.env.FRONTEND_URL as string, "wss:"]
        }
    }
}));

app.use(express.json());

app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: (req) => ipKeyGenerator(req.ip ?? "")
});

app.use(limiter);

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/ambassador", ambassadorRouter);
app.use("/api/inboxMessages", inboxMessagesRouter);

app.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    console.log("OAUTH REQUEST HIT");

    console.log("Authorization code", code);

    res.send("Google OAuth authorization successfull!");
})

const initialize = async () => {
    try {
        const PORT = process.env.PORT;

        if (!PORT) {
            throw new Error("PORT not found");
        } else {
            server.listen(PORT,() => console.log(`Server is listening on PORT ${PORT}`));
        }

        await connectToDB(process.env.MONGO_URI as string);
        
        // if (!isRedisConnected) {
        //     await connectToRedis();
        // }
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log("Unknown Error:", error);
        }
        process.exit(1);
    }
}

initialize();