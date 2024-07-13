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
exports.updateBillingInfo = exports.createBillingInfo = exports.getBillingInfo = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const billing_model_1 = __importDefault(require("../models/billing.model"));
const customer_model_1 = __importDefault(require("../models/customer.model"));
exports.getBillingInfo = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const billingInfo = yield billing_model_1.default.findOne({ user: req.params.id });
    if (!billingInfo) {
        res.status(404);
        throw new Error("Billing information not found");
    }
    res.status(200).json({
        success: true,
        message: "Billing Infomation retrieved!",
        data: billingInfo,
    });
}));
exports.createBillingInfo = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, address, city, contact, postalCode, country } = req.body;
    const isExistUser = yield customer_model_1.default.findOne({ _id: user });
    if (!isExistUser) {
        return res.status(404).json({
            success: false,
            message: "User not found!",
        });
    }
    const billingExists = yield billing_model_1.default.findOne({ user: user });
    if (billingExists) {
        return res
            .status(400)
            .json({ message: "Billing information already exists!" });
    }
    const billingInfo = new billing_model_1.default({
        user,
        address,
        city,
        contact,
        postalCode,
        country,
    });
    const createdBillingInfo = yield billingInfo.save();
    res.status(201).json({
        success: true,
        message: "Billing Infomation created!",
        data: createdBillingInfo,
    });
}));
exports.updateBillingInfo = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, address, city, contact, postalCode, country } = req.body;
    const billingInfo = yield billing_model_1.default.findOne({ user: user });
    if (!billingInfo) {
        return res.status(404).json({
            message: "Billing not found",
            success: false,
        });
    }
    billingInfo.address = address || billingInfo.address;
    billingInfo.city = city || billingInfo.city;
    billingInfo.contact = contact || billingInfo.contact;
    billingInfo.postalCode = postalCode || billingInfo.postalCode;
    billingInfo.country = country || billingInfo.country;
    const updatedBillingInfo = yield billingInfo.save();
    res.status(201).json({
        success: true,
        message: "Billing Infomation updated!",
        data: updatedBillingInfo,
    });
}));
