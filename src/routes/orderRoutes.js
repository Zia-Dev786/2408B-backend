const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getMyOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  orderSchema,
} = require("../validators/orderValidator");


router.post(
  "/",
  authMiddleware,
  validate(orderSchema),
  createOrder
);

router.get(
  "/all-orders",
  authMiddleware,
  getAllOrders
);
router.get(
  "/",
  authMiddleware,
  getMyOrders
);

router.get(
  "/:id",
  authMiddleware,
  getMyOrder
);

router.put(
  "/:id",
  authMiddleware,
  updateOrderStatus
);


module.exports = router;