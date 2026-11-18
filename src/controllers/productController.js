const Product = require("../model/productModel");
let uploadToCloudinary=require('../config/cloudinaryupload')

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error.message,
    });
  }
};


const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
};


const getProductByCategory = async (req, res) => {
  try {
    const product = await Product.find({category:req.params.id,isActive:true});
    console.log(product)
    
    if (!product ) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
};



const createProduct = async (req, res) => {
  try {
    const {
      title,
      desc,
      price,
      category,
      brand,
      stock,
    } = req.body;
    let image=req.file
    console.log(req.body)
    if(!image){
      return res.status(400).json({message:"image is required"})

    }
    let imageurl=await uploadToCloudinary(image.buffer,"products")
    console.log(imageurl.secure_url)

    if (!title || !desc || price === undefined||!image  || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, image and category are required",
      });
    }

    const product = await Product.create({
      title,
      desc,
      price,
  image:imageurl.secure_url,
      category,
      brand,
      stock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};


const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      title,
      desc,
      price,
      image,
      category,
      brand,
      stock,
      isActive,
    } = req.body;

    product.title = title ?? product.title;
    product.desc = desc ?? product.desc;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;
    product.stock = stock ?? product.stock;
    product.isActive = isActive ?? product.isActive;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete
    product.isActive = false;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};



// const searchProducts = async (req, res) => {
//   try {
//     const {
//       search = "",
//       category,
//       minPrice,
//       maxPrice,
//       sort = "default",
//       page = 1,
//       limit = 12,
//     } = req.query;

//     // Validate pagination
//     const currentPage = Math.max(1, parseInt(page, 10) || 1);
//     const pageSize = Math.min(
//       100,
//       Math.max(1, parseInt(limit, 10) || 12)
//     );

//     // Validate price filters
//     const minimum =
//       minPrice !== undefined && minPrice !== ""
//         ? Number(minPrice)
//         : undefined;

//     const maximum =
//       maxPrice !== undefined && maxPrice !== ""
//         ? Number(maxPrice)
//         : undefined;

//     if (
//       (minimum !== undefined &&
//         (!Number.isFinite(minimum) || minimum < 0)) ||
//       (maximum !== undefined &&
//         (!Number.isFinite(maximum) || maximum < 0))
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Prices must be valid non-negative numbers",
//       });
//     }

//     if (
//       minimum !== undefined &&
//       maximum !== undefined &&
//       minimum > maximum
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Minimum price cannot exceed maximum price",
//       });
//     }

//     // Build the MongoDB match conditions
//     const matchStage = {
//       isActive: true,
//     };

//     if (search.trim()) {
//       // Escape regex metacharacters to treat input as literal text
//       const escapedSearch = search
//         .trim()
//         .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//       matchStage.name = {
//         $regex: escapedSearch,
//         $options: "i",
//       };
//     }

//     if (category && category.trim() && category !== "all") {
//       matchStage.category = category.trim();
//     }

//     if (minimum !== undefined || maximum !== undefined) {
//       matchStage.price = {};

//       if (minimum !== undefined) {
//         matchStage.price.$gte = minimum;
//       }

//       if (maximum !== undefined) {
//         matchStage.price.$lte = maximum;
//       }
//     }

//     // Allow only predefined sort options
//     const sortOptions = {
//       default: { createdAt: -1, _id: -1 },
//       "price-low": { price: 1, _id: 1 },
//       "price-high": { price: -1, _id: -1 },
//       "name-asc": { name: 1, _id: 1 },
//       "name-desc": { name: -1, _id: -1 },
//     };

//     if (!sortOptions[sort]) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid sort option",
//       });
//     }

//     const skip = (currentPage - 1) * pageSize;

//     // Aggregation pipeline
//     const pipeline = [
//       {
//         $match: matchStage,
//       },
//       {
//         $facet: {
//           products: [
//             {
//               $sort: sortOptions[sort],
//             },
//             {
//               $skip: skip,
//             },
//             {
//               $limit: pageSize,
//             },
//           ],

//           totalCount: [
//             {
//               $count: "count",
//             },
//           ],

//           categories: [
//             {
//               $group: {
//                 _id: "$category",
//               },
//             },
//             {
//               $sort: {
//                 _id: 1,
//               },
//             },
//           ],
//         },
//       },
//       {
//         $project: {
//           products: 1,
//           total: {
//             $ifNull: [
//               {
//                 $arrayElemAt: ["$totalCount.count", 0],
//               },
//               0,
//             ],
//           },
//           categories: {
//             $map: {
//               input: "$categories",
//               as: "category",
//               in: "$$category._id",
//             },
//           },
//         },
//       },
//     ];

//     const [result] = await Product.aggregate(pipeline);

//     const total = result?.total || 0;

//     return res.status(200).json({
//       success: true,
//       count: result?.products.length || 0,
//       total,
//       page: currentPage,
//       limit: pageSize,
//       totalPages: Math.ceil(total / pageSize),
//       categories: result?.categories || [],
//       products: result?.products || [],
//     });
//   } catch (error) {
//     console.error("getProducts error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to get products",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : undefined,
//     });
//   }
// };
const searchProducts = async (req, res) => {
  try {
    const {
      search = "",
      category,
      minPrice,
      maxPrice,
      sort = "default",
    } = req.query;

    // Match active products
    const match = { isActive: true };

    // Search title: match any search word
    if (search.trim()) {
      const words = search.trim().split(/\s+/);

      match.$or = words.map((word) => ({
        title: {
          $regex: word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          $options: "i",
        },
      }));
    }

    // Category filter
    if (category && category !== "all") {
      match.category = category;
    }

    // Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      match.price = {};

      if (minPrice !== undefined && minPrice !== "") {
        match.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined && maxPrice !== "") {
        match.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    const sortOptions = {
      default: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
      "name-asc": { title: 1 },
      "name-desc": { title: -1 },
    };

    if (!sortOptions[sort]) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort option",
      });
    }

    // Aggregation pipeline
    const products = await Product.aggregate([
      { $match: match },
      { $sort: sortOptions[sort] },
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: error.message,
    });
  }
};


module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductByCategory
};
    

