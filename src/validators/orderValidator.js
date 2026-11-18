
const Joi = require("joi");

const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string()
          .hex()
          .length(24)
          .required(),

        quantity: Joi.number()
          .integer()
          .min(1)
          .required(),

        price: Joi.number()
          .min(0)
          .required(),
      })
    )
    .min(1)
    .required(),



  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required(),

  paymentMethod: Joi.string()
    .valid("COD", "Card", "Online")
    .default("COD"),
});

module.exports = {
  orderSchema,
};
