"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    description: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    service: {
        type: Object || String,
        // required: true,
    },
    averageRating: {
        type: Number,
        required: false,
        default: 0,
    },
    tag: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: false,
        ref: "Tag",
    },
});
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
