import { Router } from "express";
import { getRevenue, getVisits, getCropRisk } from "../controllers/analytics.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/revenue", protect, getRevenue);
router.get("/visits", protect, getVisits);
router.get("/crop-risk", protect, getCropRisk);
export default router;
