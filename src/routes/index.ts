import express from "express";
import authRoute from "./auth.route";
import category from "./category.route";
import products from "./product.route";
import review from "./review.route";
import sell from "./sell.route";
import brand from "./brand.route";
import tag from "./tag.route";
import file from "./fileupload.route";
import customerRoute from "./customer.route";
import paymentRoutes from "./payment.route";
import contactUs from "./contactus.route";
import billingRoute from "./billing.route";

const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/customer",
    route: customerRoute,
  },
  {
    path: "/category",
    route: category,
  },
  {
    path: "/product",
    route: products,
  },
  {
    path: "/review",
    route: review,
  },
  {
    path: "/sell",
    route: sell,
  },
  {
    path: "/brand",
    route: brand,
  },
  {
    path: "/tag",
    route: tag,
  },
  {
    path: "/file",
    route: file,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
  {
    path: "/contact",
    route: contactUs,
  },
  {
    path: "/billing",
    route: billingRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
