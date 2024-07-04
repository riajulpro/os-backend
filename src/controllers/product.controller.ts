import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import QueryBuilder from "../builder/QueryBuilder";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Product from "../models/product.model";
import sendResponse from "../utils/sendResponse";

export const createProductController = catchAsyncError(
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

    const {
      name,
      photo,
      category,
      stock,
      price,
      discountPrice,
      brand,
      cell,
      service,
    } = req.body;

    try {
      const newProduct = await Product.create({
        name,
        photo,
        category,
        stock,
        price,
        discountPrice,
        brand,
        cell,
        service,
      });

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error creating product",
        data: null,
        error: error,
      });
    }
  }
);

export const getAllProductsController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryBuilder = new QueryBuilder(Product.find(), req.query)
        .search(["name", "brand"])
        .filter()
        .sort()
        .paginate()
        .fields();

      const products = await queryBuilder.modelQuery;

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error fetching products",
        data: null,
        error: error,
      });
    }
  }
);

export const getProductByIdController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id).populate("category", ["label", "value"]).populate("reviews");

      if (!product) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Product not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product fetched successfully",
        data: product,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error fetching product",
        data: null,
        error: error,
      });
    }
  }
);

export const updateProductController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedProduct) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Product not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error updating product",
        data: null,
        error: error,
      });
    }
  }
);

export const deleteProductController = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        return sendResponse(res, {
          statusCode: 404,
          success: false,
          message: "Product not found",
          data: null,
        });
      }

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: "Error deleting product",
        data: null,
        error: error,
      });
    }
  }
);
