"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const billing_controller_1 = require("../controllers/billing.controller");
const router = express_1.default.Router();
router.post("/", auth_1.isAuthenticatedUser, billing_controller_1.createBillingInfo);
router.get("/:id", auth_1.isAuthenticatedUser, billing_controller_1.getBillingInfo);
router.patch("/:id", auth_1.isAuthenticatedUser, billing_controller_1.updateBillingInfo);
exports.default = router;
