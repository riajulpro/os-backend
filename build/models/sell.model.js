"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SellSchema = new mongoose_1.default.Schema({
    sellData: [
        {
            productId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        default: "unpaid",
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    customer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Customer",
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: false,
        enum: ["Pending", "On the way", "Delivered", "Cancelled"],
        default: "Pending",
    },
});
const Sell = mongoose_1.default.model("Sell", SellSchema);
exports.default = Sell;
