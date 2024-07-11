"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const file_controller_1 = require("../controllers/file.controller");
const router = express_1.default.Router();
// Multer configuration for handling file uploads
const upload = (0, multer_1.default)({ dest: "uploads/" });
// POST route for uploading files
router.post("/upload", upload.single("file"), file_controller_1.uploadFile);
router.post("/replace/:publicId", upload.single("file"), file_controller_1.replaceFile);
exports.default = router;
