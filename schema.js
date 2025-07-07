// STEP 1: Import Joi for data validation
const joi = require("joi");

// ============================================
// 1. Joi Schema for Listing Validation
// ============================================
module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(), // Title must be a non-empty string
      description: joi.string().required(), // Description must be a non-empty string
      price: joi.number().required().min(0), // Price must be a number >= 0

      // Image object must include both URL and filename
      image: joi
        .object({
          url: joi.string().required(),     // Image URL must be a string
          filename: joi.string().required() // Image filename must be a string
        })
        .required()       // The whole image object is required
        .allow(null),     // But can also accept `null` (for optional uploads or cloud images)

      location: joi.string().required(), // Location field is required
      country: joi.string().required(),  // Country field is required
    })
    .required(), // The listing object itself is required
});

// ============================================
// 2. Joi Schema for Review Validation
// ============================================
module.exports.ReviewSchema = joi.object({
  review: joi
    .object({
      Rating: joi.string().required().min(1).max(5), // Rating must be a string (e.g. "1", "2", ... "5")
      Comment: joi.string().required(),             // Comment must be a non-empty string
    })
    .required(), // The reviews object must be present
});
