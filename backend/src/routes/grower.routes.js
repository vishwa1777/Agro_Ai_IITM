import { Router } from "express";
import {
    getGrowers,
    createGrower,
    updateGrower,
    deleteGrower,
} from "../controllers/grower.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protect, getGrowers);
router.post("/", protect, createGrower);
router.put("/:id", protect, updateGrower);
router.delete("/:id", protect, deleteGrower);
export default router;
