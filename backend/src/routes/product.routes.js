import { Router } from "express";
import { getProducts, createProduct, updateProduct } from "../controllers/product.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.get("/",    protect, getProducts);
router.post("/",   protect, createProduct);
router.put("/:id", protect, updateProduct);
export default router;