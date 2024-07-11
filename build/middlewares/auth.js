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
exports.authorizeRoles = exports.isAuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const errorhandler_1 = __importDefault(require("../utils/errorhandler"));
const isAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const getToken = req.header("Authorization");
        if (!getToken)
            return res.status(400).json({ message: "Invalid Authentication." });
        const token = getToken.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Token not provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        // console.log("desss", decoded);
        if (!decoded)
            return res.status(401).json({ message: "Invalid Authentication." });
        const user = yield auth_model_1.default.findOne({
            _id: (_a = decoded === null || decoded === void 0 ? void 0 : decoded.user) === null || _a === void 0 ? void 0 : _a.authId,
        }).select("-password");
        if (!user)
            return res.status(400).json({ message: "User does not exist." });
        // console.log("user =======", user);
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: err.message });
    }
});
exports.isAuthenticatedUser = isAuthenticatedUser;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            return next(new errorhandler_1.default(`User type: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resouce `, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
