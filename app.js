// Load environment variables from .env in non-production environments
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const helmet = require("helmet");
// Required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

// Import routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviewR.js");
const UserRouter = require("./routes/user.js");

// Import User model for authentication
const User = require("./Models/user.js");

// Set up view engine with EJS and ejs-mate for layout support
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse incoming form data
app.use(methodOverride("_method")); // To support PUT & DELETE from forms
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Change this from [] to ["'self'"]
      connectSrc: ["'self'", "https://*.cloudinary.com"], // Corrected wildcard for cloudinary
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"], // Assuming you don't use <object> tags for plugins
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com",
        "https://images.unsplash.com", // Add if you use unsplash images directly
        // Add any other image sources here
      ],
      fontSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://fonts.gstatic.com",
      ], // Add fonts.gstatic.com if using Google Fonts
      // Consider adding 'frameSrc' if you embed iframes, otherwise default to 'none' or leave out
      // You might also need 'manifest-src' if using a web app manifest
    },
  })
);
// MongoDB Atlas connection string from .env
const dbUrl = process.env.ATLASDB_URL;

// Configure session store using MongoDB
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // Session update interval in seconds
});

// Handle session store errors
store.on("error", (err) => {
  console.log("Error in mongo session", err);
});

// Session configuration
const sessionOptions = {
  store,
  secret: "mysecretcode", // Should be stored securely in .env
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days expiry
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // Prevents client-side JS from accessing the cookie
  },
};

// Use session and flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use local strategy with the User model
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Connect to MongoDB using async/await
async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error while connection to DB", err);
  });

// Middleware to make flash messages and user available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurrentUser = req.user;
  next();
});

// Use defined routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", UserRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const { statuscode = 404, message = "Something went wrong!" } = err;
  res.render("listings/error.ejs", { message });
});

// Start the server
app.listen(8080, () => {
  console.log("Server is listening to 8080!");
});
