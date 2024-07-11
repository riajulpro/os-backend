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
exports.deleteTagController = exports.updateTagController = exports.getTagByIdController = exports.getAllTagsController = exports.createTagController = void 0;
const express_validator_1 = require("express-validator");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const tag_model_1 = __importDefault(require("../models/tag.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.createTagController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map((error) => error.msg)[0];
        return (0, sendResponse_1.default)(res, {
            statusCode: 422,
            success: false,
            message: firstError,
            data: null,
        });
    }
    const { label, value, image } = req.body;
    try {
        const newTag = yield tag_model_1.default.create({ label, value, image });
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Tag created successfully",
            data: newTag,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error creating tag",
            data: null,
            error: error,
        });
    }
}));
exports.getAllTagsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield tag_model_1.default.find();
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Tags fetched successfully",
            data: tags,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching tags",
            data: null,
            error: error,
        });
    }
}));
exports.getTagByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tag = yield tag_model_1.default.findById(id);
        if (!tag) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Tag not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Tag fetched successfully",
            data: tag,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching tag",
            data: null,
            error: error,
        });
    }
}));
exports.updateTagController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedTag = yield tag_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedTag) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Tag not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Tag updated successfully",
            data: updatedTag,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error updating tag",
            data: null,
            error: error,
        });
    }
}));
exports.deleteTagController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTag = yield tag_model_1.default.findByIdAndDelete(id);
        if (!deletedTag) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Tag not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Tag deleted successfully",
            data: deletedTag,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error deleting tag",
            data: null,
            error: error,
        });
    }
}));
