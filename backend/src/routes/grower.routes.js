import express from "express";
import auth from "../middleware/auth.js";
import authorize from "../middleware/authorize.js";

import {
  getGrowers,
  createGrower,
  updateGrower,
  deleteGrower
} from "../controllers/grower.controller.js";

const router =
  express.Router();

router.get("/", auth, getGrowers);

router.post(
  "/",
  auth,
  authorize(
    "manager",
    "admin"
  ),
  createGrower
);

router.put(
  "/:id",
  auth,
  authorize(
    "manager",
    "admin"
  ),
  updateGrower
);

router.delete(
  "/:id",
  auth,
  authorize("admin"),
  deleteGrower
);

export default router;