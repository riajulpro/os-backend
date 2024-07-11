"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_us_controller_1 = require("../controllers/contact.us.controller");
const router = (0, express_1.Router)();
router.post("/send", contact_us_controller_1.createContactMessage);
const contactRoute = router;
exports.default = contactRoute;
