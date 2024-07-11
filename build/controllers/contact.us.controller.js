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
exports.createContactMessage = void 0;
const catchAsyncErrors_1 = __importDefault(require("../middlewares/catchAsyncErrors"));
const sendMessage_1 = __importDefault(require("../utils/sendMessage"));
exports.createContactMessage = (0, catchAsyncErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const email = body.email;
    const template = `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
  <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #333333;">New Contact Us Message</h2>
  
  <div class="details" style="margin-bottom: 10px;">
      <strong>Name:</strong> ${body.fullName}<br>
      <strong>Email:</strong> ${body.email}<br>
      <strong>Subject:</strong> ${body.subject}<br>
  </div>
  
  <div class="message" style="margin-top: 20px;">
      <strong>Message:</strong><br>
      ${body.message}
  </div>
  
  <div class="footer" style="margin-top: 20px; color: #666666;">
      Please respond promptly to address the query or concern.
  </div>
</div>`;
    const adminEmail = process.env.MAIL;
    (0, sendMessage_1.default)(adminEmail, adminEmail, `Reach mail from ${email}`, template);
    res.json({
        message: "Successfully contact send",
        success: true,
        data: null,
    });
}));
