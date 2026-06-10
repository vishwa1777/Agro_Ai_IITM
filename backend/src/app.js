import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middleware/errorHandler.js";
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

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AgroAI API Running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/retailers", retailerRoutes);
app.use("/api/growers", growerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use(errorHandler);

export default app;