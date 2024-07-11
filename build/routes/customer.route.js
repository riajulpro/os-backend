"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.put("/update", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("customer"), customer_controller_1.updateCustomerDetails);
const customerRoute = router;
exports.default = customerRoute;
