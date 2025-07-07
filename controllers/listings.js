const Listing = require("../Models/Listing");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

module.exports.NewRoute = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.ShowRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  //console.log(listing);
  res.render("listings/show.ejs", { listing, currUser: req.user });
};

module.exports.createRoute = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  //console.log(Url, filename )
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // save the info of current user we fetch id of owner and store it
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

module.exports.EditRoute = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  req.flash("success", "List Edited!");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.UpdateRoute = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    listing.image = { filename, url };
    await listing.save();
  }

  req.flash("success", "List Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.DeleteRoute = async (req, res) => {
  let { id } = req.params;
  let DListings = await Listing.findByIdAndDelete(id);
  req.flash("success", "List Deleted!");
  res.redirect("/listings");
};