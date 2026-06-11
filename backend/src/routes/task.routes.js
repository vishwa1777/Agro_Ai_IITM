import { Router } from "express";
import { getTasks, createTask, completeTask } from "../controllers/task.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/",          protect, getTasks);
router.post("/",         protect, createTask);
router.put("/:id/complete", protect, completeTask);
export default router;