const Joi = require("joi");
const { number } = require("joi");

module.exports.rentalSchema = Joi.object({
  rental: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),

    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().trim().alphanum().min(3).max(30).required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/),
    image: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
