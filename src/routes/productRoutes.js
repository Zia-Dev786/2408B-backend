const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductByCategory
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const validate = require("../middleware/validate");
const upload=require('../middleware/imageUpload')

const {
  productSchema,
} = require("../validators/productValidator");


router.get("/", getProducts);
router.get("/searchProduct", searchProducts);

router.get("/:id", getProduct);
router.get("/category/:id", getProductByCategory);


router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single('image'),
  // validate(productSchema),
  createProduct
);


router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(productSchema),
  updateProduct
);


router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);


module.exports = router;