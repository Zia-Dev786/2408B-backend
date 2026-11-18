const Joi = require("joi");

// Register
const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required(),

  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required(),

  contact: Joi.string()
    .trim()
    .min(10)
    .max(20)
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
});


// Login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required(),

  password: Joi.string()
    .required(),
});


module.exports = {
  registerSchema,
  loginSchema,
};

