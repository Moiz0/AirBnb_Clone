const mongoose = require("mongoose");
const review = require("./review");
const { type } = require("os");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: { filename: String, url: String },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.review } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
