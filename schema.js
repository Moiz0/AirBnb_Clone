const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi
        .object({
          url: joi.string().required(),
          filename: joi.string().required(),
        })
        .required()
        .allow(null),

      location: joi.string().required(),
      country: joi.string().required(),
    })
    .required(),
});

module.exports.ReviewSchema = joi.object({
  reviews: joi.object({
    Rating: joi.string().required().min(1).max(5),
    Comment: joi.string().required(),
  }).required,
});
