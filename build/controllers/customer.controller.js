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
exports.updateCustomerDetails = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const customer_model_1 = __importDefault(require("../models/customer.model"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.updateCustomerDetails = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = req.user;
    if (!user)
        return res.status(204).json({});
    console.log({ user });
    const isExistCustomer = yield customer_model_1.default.findOne({ email: user.email });
    if (!isExistCustomer) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            message: "customer does't exist",
            data: null,
        });
    }
    const result = yield customer_model_1.default.findByIdAndUpdate(isExistCustomer._id, body, {
        new: true,
        runValidators: true,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User details update successfull",
        data: result,
    });
}));
