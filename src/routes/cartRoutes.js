
const express = require("express");
const router = express.Router();
const authmiddleware=require('../middleware/authMiddleware')

const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeProduct,
  getCart,
  removeCart,
} = require("../controllers/cartController");

router.post("/add",authmiddleware, addToCart);

router.patch("/increment",authmiddleware, incrementQuantity);
router.patch("/decrement",authmiddleware, decrementQuantity);

router.delete("/remove-product",authmiddleware, removeProduct);
// user
router.get("/get-usercart",authmiddleware, getCart);

router.delete("/delete-cart",authmiddleware, removeCart);

module.exports = router;
