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
exports.deleteBrandController = exports.updateBrandController = exports.getBrandByIdController = exports.getAllBrandsController = exports.createBrandController = void 0;
const express_validator_1 = require("express-validator");
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.createBrandController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newBrand = yield brand_model_1.default.create({ label, value, image });
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Brand created successfully",
            data: newBrand,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error creating brand",
            data: null,
            error: error,
        });
    }
}));
exports.getAllBrandsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield brand_model_1.default.find();
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Brands fetched successfully",
            data: brands
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching brands",
            data: null,
            error: error,
        });
    }
}));
exports.getBrandByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const brand = yield brand_model_1.default.findById(id);
        if (!brand) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Brand not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Brand fetched successfully",
            data: brand,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching brand",
            data: null,
            error: error,
        });
    }
}));
exports.updateBrandController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedBrand = yield brand_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedBrand) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Brand not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Brand updated successfully",
            data: updatedBrand,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error updating brand",
            data: null,
            error: error,
        });
    }
}));
exports.deleteBrandController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedBrand = yield brand_model_1.default.findByIdAndDelete(id);
        if (!deletedBrand) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Brand not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Brand deleted successfully",
            data: deletedBrand,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error deleting brand",
            data: null,
            error: error,
        });
    }
}));
