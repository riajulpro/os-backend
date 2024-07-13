import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth";
import {
  createBillingInfo,
  getBillingInfo,
  updateBillingInfo,
} from "../controllers/billing.controller";

const router = express.Router();

router.post("/", isAuthenticatedUser, createBillingInfo);
router.get("/:id", isAuthenticatedUser, getBillingInfo);
router.patch("/:id", isAuthenticatedUser, updateBillingInfo);

export default router;
