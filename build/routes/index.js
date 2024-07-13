"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const category_route_1 = __importDefault(require("./category.route"));
const product_route_1 = __importDefault(require("./product.route"));
const review_route_1 = __importDefault(require("./review.route"));
const sell_route_1 = __importDefault(require("./sell.route"));
const brand_route_1 = __importDefault(require("./brand.route"));
const tag_route_1 = __importDefault(require("./tag.route"));
const fileupload_route_1 = __importDefault(require("./fileupload.route"));
const customer_route_1 = __importDefault(require("./customer.route"));
const payment_route_1 = __importDefault(require("./payment.route"));
const contactus_route_1 = __importDefault(require("./contactus.route"));
const billing_route_1 = __importDefault(require("./billing.route"));
const router = express_1.default.Router();
const moduleRoute = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/customer",
        route: customer_route_1.default,
    },
    {
        path: "/category",
        route: category_route_1.default,
    },
    {
        path: "/product",
        route: product_route_1.default,
    },
    {
        path: "/review",
        route: review_route_1.default,
    },
    {
        path: "/sell",
        route: sell_route_1.default,
    },
    {
        path: "/brand",
        route: brand_route_1.default,
    },
    {
        path: "/tag",
        route: tag_route_1.default,
    },
    {
        path: "/file",
        route: fileupload_route_1.default,
    },
    {
        path: "/payment",
        route: payment_route_1.default,
    },
    {
        path: "/contact",
        route: contactus_route_1.default,
    },
    {
        path: "/billing",
        route: billing_route_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
