import { Router } from "express";
import { getVisits, createVisit } from "../controllers/visit.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/",  protect, getVisits);
router.post("/", protect, createVisit);
export default router;