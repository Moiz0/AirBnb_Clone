const Review = require("../Models/review");
const Listing = require("../Models/Listing");

module.exports.PostRoute = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.DeleteRoute = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};