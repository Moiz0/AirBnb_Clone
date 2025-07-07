const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../ErrorHandle/wrapAsync.js");
const ReviewController = require("../controllers/reviews.js");
const {
  validateReview,
  isLoggedin,
  isReviewAuthor,
} = require("../middleware.js");


//Reviews Post Route
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(ReviewController.PostRoute)
);

//Delete Review ID
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(ReviewController.DeleteRoute)
);

module.exports = router;
