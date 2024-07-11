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
exports.getGenerateYearlyEarnings = exports.getCustomerBasedSellsController = exports.deleteSellController = exports.updateSellController = exports.getSellByIdController = exports.trackCustomerOrder = exports.getAllSellsController = exports.createSellController = void 0;
const express_validator_1 = require("express-validator");
const QueryBuilder_1 = __importDefault(require("../builder/QueryBuilder"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const customer_model_1 = __importDefault(require("../models/customer.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const sell_model_1 = __importDefault(require("../models/sell.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.createSellController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { sellData, totalAmount, paymentMethod, paymentStatus, customer, date, status, } = req.body;
    try {
        const customerExists = yield customer_model_1.default.findById(customer);
        if (!customerExists) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Customer not found",
                data: null,
            });
        }
        for (const item of sellData) {
            const { productId, quantity } = item;
            const product = yield product_model_1.default.findById(productId);
            if (!product) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 404,
                    success: false,
                    message: "Product not found",
                    data: null,
                });
            }
            const quantityNumber = parseInt(quantity, 10);
            if (isNaN(quantityNumber) || quantityNumber <= 0) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Invalid quantity",
                    data: null,
                });
            }
            if (product.stock < quantityNumber) {
                return (0, sendResponse_1.default)(res, {
                    statusCode: 400,
                    success: false,
                    message: "Insufficient stock",
                    data: null,
                });
            }
            product.stock -= quantityNumber;
            yield product.save();
        }
        const newSell = yield sell_model_1.default.create({
            sellData,
            totalAmount,
            paymentMethod,
            paymentStatus,
            customer,
            date,
            status,
        });
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Order created successfully",
            data: newSell,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error creating sell",
            data: null,
            error: error,
        });
    }
}));
exports.getAllSellsController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryBuilder = new QueryBuilder_1.default(sell_model_1.default.find(), req.query)
            .filter()
            .sort()
            .paginate()
            .fields();
        const sells = yield queryBuilder.modelQuery
            .populate("customer")
            .populate("sellData.productId");
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Sells fetched successfully",
            data: sells,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching sells",
            data: null,
            error: error,
        });
    }
}));
exports.trackCustomerOrder = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const user = req.user;
    if (!user)
        return res.status(204).send({});
    const isExistOrder = yield sell_model_1.default.findById(orderId)
        .populate("customer")
        .populate("productId");
    if (!isExistOrder) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "Order not found",
            data: null,
        });
    }
    const orderObject = isExistOrder.toObject();
    if (orderObject.customer.email !== user.email) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "Order email didn't matched",
            data: null,
            statusCode: 403,
        });
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Order track retraive successfully",
        data: orderObject,
    });
}));
exports.getSellByIdController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sell = yield sell_model_1.default.findById(id)
            .populate("sellData.productId")
            .populate("customer");
        if (!sell) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Sell not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Sell fetched successfully",
            data: sell,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error fetching sell",
            data: null,
            error: error,
        });
    }
}));
exports.updateSellController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedSell = yield sell_model_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate("sellData.productId")
            .populate("customer");
        if (!updatedSell) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Sell not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Sell updated successfully",
            data: updatedSell,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error updating sell",
            data: null,
            error: error,
        });
    }
}));
exports.deleteSellController = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedSell = yield sell_model_1.default.findByIdAndDelete(id)
            .populate("sellData.productId")
            .populate("customer");
        if (!deletedSell) {
            return (0, sendResponse_1.default)(res, {
                statusCode: 404,
                success: false,
                message: "Sell not found",
                data: null,
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Sell deleted successfully",
            data: deletedSell,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 500,
            success: false,
            message: "Error deleting sell",
            data: null,
            error: error,
        });
    }
}));
exports.getCustomerBasedSellsController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = req.user;
    console.log("fasdfasd");
    if (!userAuth)
        return res.status(204).send({});
    const isCustomerExist = yield customer_model_1.default.findOne({ email: userAuth.email });
    if (!isCustomerExist) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            message: "Customer not found",
            success: false,
            statusCode: 404,
        });
    }
    const filterQuery = { customer: isCustomerExist._id };
    const query = sell_model_1.default.find(filterQuery)
        .populate("customer")
        .populate("sellData.productId");
    const resultQuery = new QueryBuilder_1.default(query, req.query).paginate();
    const result = yield resultQuery.modelQuery;
    res.json({
        success: true,
        data: result || [],
        message: "Successfully retrieved sells data",
    });
}));
exports.getGenerateYearlyEarnings = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const yearlyEarnings = yield sell_model_1.default.aggregate([
            {
                $addFields: {
                    date: { $toDate: "$date" },
                },
            },
            {
                $unwind: "$sellData",
            },
            {
                $match: {
                    status: "Delivered",
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        productId: "$sellData.productId",
                    },
                    totalRevenue: { $sum: { $toInt: "$sellData.quantity" } },
                    totalNetIncome: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.year",
                    months: {
                        $push: {
                            month: "$_id.month",
                            revenue: "$totalRevenue",
                            netIncome: "$totalNetIncome",
                        },
                    },
                    totalRevenue: { $sum: "$totalRevenue" },
                    totalNetIncome: { $sum: "$totalNetIncome" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        const formattedData = yearlyEarnings.map((item) => ({
            year: item._id,
            totalRevenue: item.totalRevenue,
            totalNetIncome: item.totalNetIncome,
            months: item.months.map((month) => ({
                month: getMonthName(month.month),
                revenue: month.revenue,
                netIncome: month.netIncome,
            })),
        }));
        res.json({
            success: true,
            message: "Yearly earnings fetched successfully",
            data: formattedData,
        });
    }
    catch (err) {
        console.error("Error generating yearly earnings:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching sell",
            data: null,
            error: err,
        });
    }
}));
const getMonthName = (monthNum) => {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months[monthNum - 1];
};
