import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middleware/errorHandler.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import retailerRoutes from "./routes/retailer.routes.js";
import growerRoutes from "./routes/grower.routes.js";
import productRoutes from "./routes/product.routes.js";
import visitRoutes from "./routes/visit.routes.js";
import taskRoutes from "./routes/task.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";

const app = express();

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
    cors({
        origin: process.env.CLIENT_URL ?? "*",
        credentials: true,
    })
);
app.use(morgan("dev"));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Async error wrapper helper ───────────────────────────────────────────────
// Wrap every route handler so uncaught promise rejections go to errorHandler
const asyncWrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ success: true, message: "AgroAI API Running" });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/retailers", retailerRoutes);
app.use("/api/growers", growerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);

// ─── 404 fallthrough ─────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
