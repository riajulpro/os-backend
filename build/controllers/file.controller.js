"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceFile = exports.uploadFile = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const express_validator_1 = require("express-validator");
const fs_1 = __importDefault(require("fs"));
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CN_Cloud_name,
    api_key: process.env.CN_Api_key,
    api_secret: process.env.CN_Api_secret,
    folder: process.env.CN_Folder,
});
const uploadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorhandler_1.default("Validation Error", 400);
        }
        // Check if file exists in request
        if (!req.file) {
            throw new errorhandler_1.default("No file uploaded", 400);
        }
        // Upload file to Cloudinary
        const result = yield cloudinary_1.default.v2.uploader.upload(req.file.path, {
            folder: process.env.CN_Folder,
        });
        // Remove file from server after uploading to Cloudinary
        fs_1.default.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        res.status(200).json({ url: result.secure_url });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadFile = uploadFile;
const replaceFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new errorhandler_1.default("Validation Error", 400);
        }
        if (!req.file) {
            throw new errorhandler_1.default("No file uploaded", 400);
        }
        const publicId = req.params.publicId;
        const folder = process.env.CN_Folder;
        // Perform deletion
        const result1 = yield cloudinary_1.default.v2.uploader.destroy(`${folder}/${publicId}`);
        // Upload file to Cloudinary
        const result2 = yield cloudinary_1.default.v2.uploader.upload(req.file.path, {
            folder: process.env.CN_Folder,
        });
        // Remove file from server after uploading to Cloudinary
        fs_1.default.unlink(req.file.path, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        res.status(200).json({ url: result2.secure_url });
    }
    catch (error) {
        next(error);
    }
});
exports.replaceFile = replaceFile;
