import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN_PRODUCTION,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static('public'));
app.use(cookieParser());

// just for checking the backend is running
app.get("/", (req, res) => res.send("Backend Running"));

// routes
import { userRoutes } from './routes/user.route.js';
import { todoRoutes } from './routes/todo.route.js';

// routes declaration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/todos", todoRoutes);

export { app };