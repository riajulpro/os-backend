import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import QueryBuilder from "../builder/QueryBuilder";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Customer from "../models/customer.model";
import Product from "../models/product.model";
import Sell from "../models/sell.model";
import sendResponse from "../utils/sendResponse";

export const createSellController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const firstError = errors.array().map((error) => error.msg)[0];
      return sendResponse(res, {
        statusCode: 422,
        success: false,
        message: firstError,
        data: null,
      });
    }

    const { sellData, totalAmount, paymentMethod, paymentStatus, customer } =
      req.body;

    try {
      const customerExists = await Customer.findById(customer);

      if (!customerExists) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Customer not found",
          data: null,
        });
      }

      for (const item of sellData) {
        const { id, quantity } = item;

        const product = await Product.findById(id);

        if (!product) {
          return sendResponse(res, {
            statusCode: 404,
            success: false,
            message: "Product not found",
            data: null,
          });
        }

        const quantityNumber = parseInt(quantity, 10);
        if (isNaN(quantityNumber) || quantityNumber <= 0) {
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Invalid quantity",
            data: null,
          });
        }

        if (product.stock < quantityNumber) {
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Insufficient stock",
            data: null,
          });
        }

        product.stock -= quantityNumber;
        await product.save();
      }

      console.log(sellData);

      const sells = sellData.map((sell: any) => ({
        productId: sell.id,
        quantity: parseInt(sell.quantity),
      }));

      const newSell = await Sell.create({
        sellData: sells,
        totalAmount,
        paymentMethod,
        paymentStatus,
        customer,
        date: new Date(),
      });

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Order created successfully",
        data: newSell,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error creating sell",
        data: null,
        error: error,
      });
    }
  }
);

export const getAllSellsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryBuilder = new QueryBuilder(Sell.find(), req.query)
        .filter()
        .sort()
        .paginate()
        .fields();

      const sells = await queryBuilder.modelQuery
        .populate("customer")
        .populate("sellData.productId");

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Sells fetched successfully",
        data: sells,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error fetching sells",
        data: null,
        error: error,
      });
    }
  }
);

export const trackCustomerOrder = catchAsyncError(async (req, res) => {
  const { orderId } = req.params;
  const user = req.user;
  if (!user) return res.status(204).send({});

  const isExistOrder = await Sell.findById(orderId)
    .populate("customer")
    .populate("sellData.productId");
  if (!isExistOrder) {
    return sendResponse(res, {
      success: false,
      message: "Order not found",
      data: null,
    });
  }

  const orderObject: Record<string, any> = isExistOrder.toObject();
  if (orderObject.customer.email !== user.email) {
    return sendResponse(res, {
      success: false,
      message: "Order email didn't matched",
      data: null,
      statusCode: 403,
    });
  }

  sendResponse(res, {
    success: true,
    message: "Order track retraive successfully",
    data: orderObject,
  });
});

export const getSellByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const sell = await Sell.findById(id)
        .populate("sellData.productId")
        .populate("customer");

      if (!sell) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Sell not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Sell fetched successfully",
        data: sell,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error fetching sell",
        data: null,
        error: error,
      });
    }
  }
);

export const updateSellController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedSell = await Sell.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
        .populate("sellData.productId")
        .populate("customer");

      if (!updatedSell) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Sell not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Sell updated successfully",
        data: updatedSell,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error updating sell",
        data: null,
        error: error,
      });
    }
  }
);

export const deleteSellController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const deletedSell = await Sell.findByIdAndDelete(id)
        .populate("sellData.productId")
        .populate("customer");

      if (!deletedSell) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Sell not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Sell deleted successfully",
        data: deletedSell,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error deleting sell",
        data: null,
        error: error,
      });
    }
  }
);

export const getCustomerBasedSellsController = catchAsyncError(
  async (req, res) => {
    const userAuth = req.user;
    console.log("fasdfasd");
    if (!userAuth) return res.status(204).send({});

    const isCustomerExist = await Customer.findOne({ email: userAuth.email });
    if (!isCustomerExist) {
      return sendResponse(res, {
        data: null,
        message: "Customer not found",
        success: false,
        statusCode: 404,
      });
    }

    const filterQuery = { customer: isCustomerExist._id };
    const query = Sell.find(filterQuery)
      .populate("customer")
      .populate("sellData.productId");
    const resultQuery = new QueryBuilder(query, req.query).paginate();
    const result = await resultQuery.modelQuery;
    res.json({
      success: true,
      data: result || [],
      message: "Successfully retrieved sells data",
    });
  }
);

export const getGenerateYearlyEarnings = catchAsyncError(async (req, res) => {
  try {
    const yearlyEarnings = await Sell.aggregate([
      {
        $addFields: {
          date: { $toDate: "$date" },
        },
      },
      {
        $unwind: "$sellData",
      },
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            productId: "$sellData.productId",
          },
          totalRevenue: { $sum: { $toInt: "$sellData.quantity" } },
          totalNetIncome: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          months: {
            $push: {
              month: "$_id.month",
              revenue: "$totalRevenue",
              netIncome: "$totalNetIncome",
            },
          },
          totalRevenue: { $sum: "$totalRevenue" },
          totalNetIncome: { $sum: "$totalNetIncome" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedData = yearlyEarnings.map((item) => ({
      year: item._id,
      totalRevenue: item.totalRevenue,
      totalNetIncome: item.totalNetIncome,
      months: item.months.map(
        (month: { month: number; revenue: any; netIncome: any }) => ({
          month: getMonthName(month.month),
          revenue: month.revenue,
          netIncome: month.netIncome,
        })
      ),
    }));

    res.json({
      success: true,
      message: "Yearly earnings fetched successfully",
      data: formattedData,
    });
  } catch (err) {
    console.error("Error generating yearly earnings:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching sell",
      data: null,
      error: err,
    });
  }
});

const getMonthName = (monthNum: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[monthNum - 1];
};
