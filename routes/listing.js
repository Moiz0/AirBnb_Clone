const express = require("express");
const router = express.Router();
const wrapAsync = require("../ErrorHandle/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(ListingController.index)) //Index Route
  .post(
    //Create Route
    isLoggedin,
    upload.single("listing[image]"),
    //validateListing,
    wrapAsync(ListingController.createRoute)
  );

//New Route
router.get("/new", isLoggedin, ListingController.NewRoute);

router
  .route("/:id")
  .get(wrapAsync(ListingController.ShowRoute)) //Show route
  .put(
    //Update Route
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    //validateListing,
    wrapAsync(ListingController.UpdateRoute)
  )
  .delete(isLoggedin, isOwner, wrapAsync(ListingController.DeleteRoute)); //Delete Route

//Edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(ListingController.EditRoute)
);

module.exports = router;
