const Joi = require("joi");

const productSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  desc: Joi.string()
    .trim()
    .min(10)
    .max(2000)
    .required(),

  price: Joi.number()
    .min(0)
    .required(),

  image: Joi.string()
    .uri()
    .required(),

  category: Joi.string()
    .trim()
    .required(),

  brand: Joi.string()
    .trim()
    .allow("", null),

  stock: Joi.number()
    .integer()
    .min(0)
    .required(),

  rating: Joi.number()
    .min(0)
    .max(5)
    .default(0),

  isActive: Joi.boolean()
    .default(true),
});


module.exports = {
  productSchema,
};

