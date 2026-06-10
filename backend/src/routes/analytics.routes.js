import express from "express";

import auth from "../middleware/auth.js";

import {
  getRevenue,
  getVisits,
  getCropRisk
} from "../controllers/analytics.controller.js";

const router =
  express.Router();

router.get(
  "/revenue",
  auth,
  getRevenue
);

router.get(
  "/visits",
  auth,
  getVisits
);

router.get(
  "/crop-risk",
  auth,
  getCropRisk
);

export default router;