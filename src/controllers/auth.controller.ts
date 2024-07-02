import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import catchAsyncError from "../middlewares/catchAsyncErrors";
import Authentication from "../models/auth.model";
import Customer from "../models/customer.model";
import Owner from "../models/owner.model";
import Staff from "../models/staff.model";
import { createAcessToken } from "../utils/jwtToken";
import sendMessage from "../utils/sendMessage";
import sendResponse from "../utils/sendResponse";

export const createCustomerController = catchAsyncError(async (req, res) => {
  const { body } = req;
  const auth = await Authentication.create(body);
  const customer = Customer.create({ ...body, auth: auth._id });

  const token = createAcessToken(
    {
      email: auth.email,
      userId: auth._id,
      role: auth.role,
    },
    "1h"
  );
  res.json({
    data: customer,
    message: "staff created successfully",
    success: true,
    accessToken: token,
  });
});
export const createStaffController = catchAsyncError(async (req, res) => {
  const { body } = req;
  const auth = await Authentication.create({ ...body, role: "staff" });
  const customer = Staff.create({ ...body, auth: auth._id });
  const token = createAcessToken(
    {
      email: auth.email,
      userId: auth._id,
      role: auth.role,
    },
    "1h"
  );
  res.json({
    data: customer,
    message: "staff created successfully",
    success: true,
    accessToken: token,
  });
});
export const loginController = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  const isExistUser = await Authentication.findOne({ email });
  if (!isExistUser) {
    return sendResponse(res, {
      success: false,
      data: null,
      message: "No account found on this email",
      statusCode: 404,
    });
  }

  let user = undefined;
  const role = isExistUser.role;
  if (role === "customer") {
    user = await Customer.findOne({ email });
  }
  if (role === "owner") {
    user = await Owner.findOne({ email });
  }
  if (role === "staff") {
    user = await Staff.findOne({ email });
  }

  const token = createAcessToken(
    {
      email: isExistUser.email,
      userId: isExistUser._id,
      role: isExistUser.role,
    },
    "1h"
  );
  res.json({
    data: user,
    message: "staff created successfully",
    success: true,
    accessToken: token,
  });
});

export const resetPassword = catchAsyncError(async (req: any, res, next) => {
  const { password, oldPassword, email } = req.body;

  const user = req.user;

  if (!password || !oldPassword || !email) {
    return res.json({
      message: "password, oldPassword and email => is required",
    });
  }

  const theUser = await Authentication.findOne({ email });

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
  const isOk = await bcrypt.compare(oldPassword, theUser.password as string);
  if (!isOk) {
    return res.json({ message: "password didn't matched", success: false });
  }

  // create new hash password
  const newPass = await bcrypt.hash(password, 15);

  // update the new
  const updatePassword = await Authentication.findOneAndUpdate(
    { email },
    {
      $set: {
        password: newPass,
      },
    }
  );

  res.json({
    message: "password Updated",
    success: true,
    user: { ...updatePassword?.toObject(), password: "****" },
  });
});

// forgot-password controller
export const forgotPassword = catchAsyncError(async (req, res) => {
  const { email } = req.body;

  const user = await Authentication.findOne({ email });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "No user found with this email!" });
  }

  const tokenPayload = {
    email: user.email,
    _id: user._id,
  };

  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "5m",
    }
  );
  console.log(
    `${process.env.FRONTEND_BASE_URL}/recover-password?token=${token}`
  );

  sendMessage(
    "legendxpro123455@gmail.com",
    email,
    "Reset your password - Fresh Blogs",

    `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
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
  </div>`
  );

  res.status(200).json({
    success: true,
    message: "Check your email to recover the password",
  });
});

// Resetting new password
export const recoverPassword = catchAsyncError(async (req, res) => {
  const { password } = req.body;
  const token = req.header("Authorization");
  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  const decoded: any = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string
  );
  if (!decoded)
    return res
      .status(401)
      .json({ success: false, message: "Invalid Authentication." });

  const user = await Authentication.findOne({
    email: decoded.email,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  const tokenPayload = {
    email: user.email,
    userId: user._id,
    role: user.role,
  };

  const accessToken = createAcessToken(tokenPayload, "1h");

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been successfully reset",
    accessToken,
  });
});
