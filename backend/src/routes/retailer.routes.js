import { Router } from "express";
import {
    getRetailers,
    getRetailer,
    createRetailer,
    updateRetailer,
    deleteRetailer,
} from "../controllers/retailer.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/", protect, getRetailers);
router.get("/:id", protect, getRetailer);
router.post("/", protect, createRetailer);
router.put("/:id", protect, updateRetailer);
router.delete("/:id", protect, deleteRetailer);
export default router;
