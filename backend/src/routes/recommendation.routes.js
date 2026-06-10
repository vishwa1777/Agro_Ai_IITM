import express from "express";

import auth from "../middleware/auth.js";

import {
  getRecommendations
} from "../controllers/recommendation.controller.js";

const router =
  express.Router();

router.get(
  "/",
  auth,
  getRecommendations
);

export default router;