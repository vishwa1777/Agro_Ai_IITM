import express from "express";
import auth from "../middleware/auth.js";

import {
  getVisits,
  createVisit
} from "../controllers/visit.controller.js";

const router =
  express.Router();

router.get("/", auth, getVisits);

router.post("/", auth, createVisit);

export default router;