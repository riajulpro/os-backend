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
exports.recoverPassword = exports.forgotPassword = exports.resetPassword = exports.loginController = exports.createStaffController = exports.genereteAccessToken = exports.createCustomerController = exports.authSateController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const customer_model_1 = __importDefault(require("../models/customer.model"));
const owner_model_1 = __importDefault(require("../models/owner.model"));
const staff_model_1 = __importDefault(require("../models/staff.model"));
const jwtToken_1 = require("../utils/jwtToken");
const sendMessage_1 = __importDefault(require("../utils/sendMessage"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.authSateController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.json({ success: true, message: "User state get", data: user });
}));
exports.createCustomerController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const isExistCustomer = yield auth_model_1.default.findOne({ email: body.email });
    if (isExistCustomer) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "A account already exist in this email",
        });
    }
    const auth = yield auth_model_1.default.create(Object.assign(Object.assign({}, body), { role: "customer" }));
    const customer = customer_model_1.default.create(Object.assign(Object.assign({}, body), { auth: auth._id }));
    const token = (0, jwtToken_1.createAcessToken)({
        email: auth.email,
        authId: auth._id,
        role: auth.role,
    }, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)({
        email: auth.email,
        authId: auth._id,
        role: auth.role,
    });
    res.json({
        data: customer,
        message: "Customer created successfully",
        success: true,
        accessToken: token,
        refreshToken,
    });
}));
exports.genereteAccessToken = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = req.header("Authorization");
    if (!getToken)
        return res.status(400).json({ msg: "Invalid Authentication." });
    const refreshToken = getToken.split(" ")[1];
    console.log({ refreshToken });
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
        const user = decoded.user;
        const accessTOkenPayload = {
            email: user.email,
            authId: user.authId,
            role: user.role,
        };
        const isExistUser = yield auth_model_1.default.findById(user.authId);
        if (!isExistUser) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                data: null,
                message: "User not found",
                statusCode: 404,
            });
        }
        const newAccessToken = (0, jwtToken_1.createAcessToken)(accessTOkenPayload, "1h");
        (0, sendResponse_1.default)(res, {
            success: true,
            message: "Successfully retrive access token",
            data: { accessToken: newAccessToken },
        });
    }
    catch (error) {
        console.error("Error decoding or verifying refresh token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
}));
exports.createStaffController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const auth = yield auth_model_1.default.create(Object.assign(Object.assign({}, body), { role: "staff" }));
    const customer = staff_model_1.default.create(Object.assign(Object.assign({}, body), { auth: auth._id }));
    const token = (0, jwtToken_1.createAcessToken)({
        email: auth.email,
        _id: auth._id,
        role: auth.role,
    }, "1h");
    res.json({
        data: customer,
        message: "staff created successfully",
        success: true,
        accessToken: token,
    });
}));
exports.loginController = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isExistUser = yield auth_model_1.default.findOne({ email });
    if (!isExistUser) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "No account found on this email",
            statusCode: 404,
        });
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, isExistUser.password);
    if (!isPasswordMatched) {
        return (0, sendResponse_1.default)(res, {
            message: "password didn't matched",
            success: false,
            data: null,
        });
    }
    let user = undefined;
    const role = isExistUser.role;
    if (role === "customer") {
        user = yield customer_model_1.default.findOne({ email });
    }
    if (role === "owner") {
        user = yield owner_model_1.default.findOne({ email });
    }
    if (role === "staff") {
        user = yield staff_model_1.default.findOne({ email });
    }
    const token = (0, jwtToken_1.createAcessToken)({
        email: isExistUser.email,
        authId: isExistUser._id,
        role: isExistUser.role,
    }, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)({
        email: isExistUser.email,
        authId: isExistUser._id,
        role: isExistUser.role,
    });
    const userOBj = (user === null || user === void 0 ? void 0 : user.toObject()) || {};
    res.json({
        data: Object.assign(Object.assign({}, userOBj), { role: isExistUser.role }),
        message: "Login successfull",
        success: true,
        accessToken: token,
        refreshToken,
    });
}));
exports.resetPassword = (0, catchAsyncErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, oldPassword, email } = req.body;
    const user = req.user;
    if (!password || !oldPassword || !email) {
        return res.json({
            message: "password, oldPassword and email => is required",
        });
    }
    const theUser = yield auth_model_1.default.findOne({ email });
    // check if there no user
    if (!theUser) {
        return res.json({ message: `no user find on ${email}` });
    }
    // check is the email is same or not
    if (theUser.email !== user.email) {
        return res
            .status(403)
            .json({ message: "Email didn't matched=> forbiden access" });
    }
    // varify old password
    const isOk = yield bcrypt_1.default.compare(oldPassword, theUser.password);
    if (!isOk) {
        return res.json({ message: "password didn't matched", success: false });
    }
    // create new hash password
    const newPass = yield bcrypt_1.default.hash(password, 15);
    // update the new
    const updatePassword = yield auth_model_1.default.findOneAndUpdate({ email }, {
        $set: {
            password: newPass,
        },
    });
    res.json({
        message: "password Updated",
        success: true,
        user: Object.assign(Object.assign({}, updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.toObject()), { password: "****" }),
    });
}));
// forgot-password controller
exports.forgotPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield auth_model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: "No user found with this email!" });
    }
    const tokenPayload = {
        email: user.email,
        _id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "5m",
    });
    console.log(`${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}`);
    (0, sendMessage_1.default)("legendxpro123455@gmail.com", email, "Reset your password - Fresh Blogs", `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Fresh Blogs</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`);
    res.status(200).json({
        success: true,
        message: "Check your email to recover the password",
    });
}));
// Resetting new password
exports.recoverPassword = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const token = req.header("Authorization");
    if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded)
        return res
            .status(401)
            .json({ success: false, message: "Invalid Authentication." });
    const user = yield auth_model_1.default.findOne({
        email: decoded.email,
    });
    if (!user) {
        return res.status(400).json({
            success: false,
            data: null,
            message: "User not found",
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    user.password = hashedPassword;
    const tokenPayload = {
        email: user.email,
        _id: user._id,
        role: user.role,
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    yield user.save();
    res.status(200).json({
        success: true,
        message: "Password has been successfully reset",
        accessToken,
    });
}));
