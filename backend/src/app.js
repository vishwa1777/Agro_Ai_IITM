import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import errorHandler from "./middleware/errorHandler.js";

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

app.use(errorHandler);

export default app;