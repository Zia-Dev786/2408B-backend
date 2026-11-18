
const Cart = require("../model/Cart");
const Product = require("../model/productModel");

// 1. ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    let userId=req.user.id
    console.log(userId)
    const {  productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Find product and get price from database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find user's cart, or create one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check whether product already exists
    const existing = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
      existing.price = product.price;
    } else {
      cart.products.push({
        productId: product._id,
        price: product.price,
        quantity,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
      count: cart.products.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 2. INCREMENT QUANTITY
exports.incrementQuantity = async (req, res) => {
  try {
     let userId=req.user.id
    const {  productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.products.find(
      (p) => p.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity += 1;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity increased",
      cart,
      count: cart.products.reduce(
        (total, p) => total + p.quantity,
        0
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 3. DECREMENT QUANTITY
exports.decrementQuantity = async (req, res) => {
  try {
     let userId=req.user.id
    const {  productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.products.find(
      (p) => p.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity -= 1;

    // Remove product if quantity becomes zero
    if (item.quantity <= 0) {
      cart.products.pull({ _id: item._id });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity decreased",
      cart,
      count: cart.products.reduce(
        (total, p) => total + p.quantity,
        0
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 4. REMOVE A SINGLE PRODUCT
exports.removeProduct = async (req, res) => {
  try {
     let userId=req.user.id
    const {  productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products.pull({
      productId: productId,
    });

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
      count: cart.products.reduce(
        (total, p) => total + p.quantity,
        0
      ),
    });
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 5. GET CART AND TOTAL ITEM COUNT
exports.getCart = async (req, res) => {
  try {
    // const { userId } = req.params;
     let userId=req.user.id

    const cart = await Cart.findOne({ userId })
      .populate("products.productId","title image _id");

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: null,
        count: 0,
        message: "Cart is empty",
      });
    }

    const count = cart.products.reduce(
      (total, item) => total + item.quantity,
      0
    );

    const totalPrice = cart.products.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return res.status(200).json({
      success: true,
      cart,
      count,
      totalPrice,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// // 5. GET CART AND TOTAL ITEM COUNT
// exports.getCart = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const cart = await Cart.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId)
//         }
//       },
//       {
//         $unwind: {
//           path: "$products",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "products.productId",
//           foreignField: "_id",
//           as: "productDetails"
//         }
//       },
//       {
//         $unwind: {
//           path: "$productDetails",
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $group: {
//           _id: "$_id",

//           userId: { $first: "$userId" },
//           createdAt: { $first: "$createdAt" },
//           __v: { $first: "$__v" },

//           products: {
//             $push: {
//               $cond: [
//                 { $ne: ["$products", null] },
//                 {
//                   productId: {
//                     $cond: [
//                       { $ne: ["$productDetails", null] },
//                       {
//                         _id: "$productDetails._id",
//                         title: "$productDetails.title",
//                         image: "$productDetails.image"
//                       },
//                       null
//                     ]
//                   },
//                   price: "$products.price",
//                   quantity: "$products.quantity",
//                   _id: "$products._id"
//                 },
//                 "$$REMOVE"
//               ]
//             }
//           },

//           count: {
//             $sum: { $ifNull: ["$products.quantity", 0] }
//           },

//           totalPrice: {
//             $sum: {
//               $multiply: [
//                 { $ifNull: ["$products.price", 0] },
//                 { $ifNull: ["$products.quantity", 0] }
//               ]
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           userId: 1,
//           products: 1,
//           createdAt: 1,
//           __v: 1,
//           count: 1,
//           totalPrice: 1
//         }
//       }
//     ]);

//     if (!cart.length) {
//       return res.status(200).json({
//         success: true,
//         cart: null,
//         count: 0,
//         totalPrice: 0,
//         message: "Cart is empty"
//       });
//     }

//     const { count, totalPrice, ...cartData } = cart[0];

//     return res.status(200).json({
//       success: true,
//       cart: cartData,
//       count,
//       totalPrice
//     });

//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// 6. REMOVE ENTIRE CART
exports.removeCart = async (req, res) => {
  try {
    // const { userId } = req.params;

     let userId=req.user.id

    const cart = await Cart.findOneAndDelete({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Entire cart removed",
      count: 0,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
