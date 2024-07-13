import { Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import BillingInfo from "../models/billing.model";
import Customer from "../models/customer.model";

export const getBillingInfo = catchAsyncError(
  async (req: Request, res: Response) => {
    const billingInfo = await BillingInfo.findOne({ user: req.params.id });

    if (!billingInfo) {
      res.status(404);
      throw new Error("Billing information not found");
    }

    res.status(200).json({
      success: true,
      message: "Billing Infomation retrieved!",
      data: billingInfo,
    });
  }
);

export const createBillingInfo = catchAsyncError(
  async (req: Request, res: Response) => {
    const { user, address, city, contact, postalCode, country } = req.body;
    const isExistUser = await Customer.findOne({ _id: user });

    if (!isExistUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    const billingExists = await BillingInfo.findOne({ user: user });
    if (billingExists) {
      return res
        .status(400)
        .json({ message: "Billing information already exists!" });
    }

    const billingInfo = new BillingInfo({
      user,
      address,
      city,
      contact,
      postalCode,
      country,
    });

    const createdBillingInfo = await billingInfo.save();
    res.status(201).json({
      success: true,
      message: "Billing Infomation created!",
      data: createdBillingInfo,
    });
  }
);

export const updateBillingInfo = catchAsyncError(
  async (req: Request, res: Response) => {
    const { user, address, city, contact, postalCode, country } = req.body;

    const billingInfo = await BillingInfo.findOne({ user: user });
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

    const updatedBillingInfo = await billingInfo.save();
    res.status(201).json({
      success: true,
      message: "Billing Infomation updated!",
      data: updatedBillingInfo,
    });
  }
);
