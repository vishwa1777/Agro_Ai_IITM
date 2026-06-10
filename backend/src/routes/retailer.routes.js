import express from "express";

import auth from "../middleware/auth.js";

import authorize from "../middleware/authorize.js";

import {
  getRetailers,
  getRetailer,
  createRetailer,
  updateRetailer,
  deleteRetailer
} from "../controllers/retailer.controller.js";

const router =
  express.Router();

router.get(
  "/",
  auth,
  getRetailers
);

router.get(
  "/:id",
  auth,
  getRetailer
);

router.post(
  "/",
  auth,
  authorize(
    "manager",
    "admin"
  ),
  createRetailer
);

router.put(
  "/:id",
  auth,
  authorize(
    "manager",
    "admin"
  ),
  updateRetailer
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteRetailer
);

export default router;