const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

const {
  getAllOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router.use(authMiddleware);
router.use(adminMiddleware);

// Users
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Orders
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrder);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;