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
exports.deleteProductController = exports.updateProductController = exports.getProductByIdController = exports.getAllProductsController = exports.createProductController = void 0;
const express_validator_1 = require("express-validator");
const QueryBuilder_1 = __importDefault(require("../builder/QueryBuilder"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const product_model_1 = __importDefault(require("../models/product.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.createProductController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { name, photo, category, stock, price, discountPrice, brand, service, description, } = req.body;
    console.log("aaaaaa", req.body);
    try {
        const newProduct = yield product_model_1.default.create({
            name,
            photo,
            category,
            stock,
            price,
            discountPrice,
            brand,
            description,
            service,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Product created successfully",
            data: newProduct,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error creating product",
            data: null,
            error: error,
        });
    }
}));
exports.getAllProductsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baseQueryBuilder = new QueryBuilder_1.default(product_model_1.default.find(), req.query)
            .search(["name", "brand"])
            .filter();
        const totalDocuments = yield baseQueryBuilder.modelQuery.countDocuments();
        // console.log("aaa total", totalDocuments);
        const queryBuilder = new QueryBuilder_1.default(product_model_1.default.find(), req.query)
            .search(["name", "brand"])
            .filter()
            .sort()
            .paginate()
            .fields();
        const products = yield queryBuilder.modelQuery
            .populate("category")
            .populate("brand")
            .populate("tag");
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Products fetched successfully ff",
            data: products,
            total: totalDocuments,
        });
    }
    catch (error) {
        console.log("Error fetching products:", error);
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching products",
            data: null,
            error: error,
        });
    }
}));
exports.getProductByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const product = yield product_model_1.default.findById(id).populate("category", [
            "label",
            "value",
        ]);
        if (!product) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Product not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching product",
            data: null,
            error: error,
        });
    }
}));
exports.updateProductController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Product not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error updating product",
            data: null,
            error: error,
        });
    }
}));
exports.deleteProductController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProduct = yield product_model_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Product not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error deleting product",
            data: null,
            error: error,
        });
    }
}));
