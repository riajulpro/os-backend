"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
// import morgan from "morgan";
const db_1 = __importDefault(require("./config/db"));
const error_1 = __importDefault(require("./middlewares/error"));
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
// Apply CORS middleware
app.use((0, cors_1.default)({
    origin: "*",
}));
// app.use(morgan("dev"));
// Connect to Database
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const server = http_1.default.createServer(app);
app.use("/api/v1/", index_1.default);
// Middleware for Errors
app.use(error_1.default);
//handle not found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
    });
    next();
});
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`App is running on port: ${port}. Run with http://localhost:${port}`);
});
