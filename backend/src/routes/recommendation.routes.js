import { Router } from "express";
import { getRecommendations } from "../controllers/recommendation.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protect, getRecommendations);
export default router;