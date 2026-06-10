import express from "express";
import auth from "../middleware/auth.js";

import {
  getProducts,
  createProduct,
  updateProduct
} from "../controllers/product.controller.js";

const router =
  express.Router();

router.get("/", auth, getProducts);

router.post("/", auth, createProduct);

router.put(
  "/:id",
  auth,
  updateProduct
);

export default router;