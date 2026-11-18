const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  registerSchema,
  loginSchema,
} = require("../validators/userValidation");


router.post(
  "/register",
  validate(registerSchema),
  registerUser
);

router.post(
  "/login",
  validate(loginSchema),
  loginUser
);
//token
router.get(
  "/profile",
  authMiddleware,
  getUserProfile
);


module.exports = router;