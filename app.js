// Load environment variables from .env in non-production environments
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
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
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviewR.js");
const UserRouter = require("./routes/user.js");
const User = require("./Models/user.js");
const applySecurityMiddleware = require("./ErrorHandle/security.js");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
applySecurityMiddleware(app);

const DB_URL = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(DB_URL);
}

main()
  .then(() => {
    const store = MongoStore.create({
      client: mongoose.connection.getClient(),
      crypto: {
        secret: process.env.SECRET,
      },
      touchAfter: 24 * 3600,
    });

    // Handle session store errors
    store.on("error", (err) => {
      console.log("Error in mongo session", err);
    });

    // Secure session configuration
    const sessionOptions = {
      store,
      secret: process.env.SECRET || "mysecretcode",
      resave: false,
      saveUninitialized: false, // Changed to false for better security
      name: "sessionId", // Change default session name
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
      },
    };

    // Use session and flash middleware
    app.use(session(sessionOptions));
    app.use(flash());

    // Trust proxy settings for Render
    if (process.env.NODE_ENV === "production") {
      app.set("trust proxy", 1);
    }

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

    app.get("/", (req, res) => {
      res.redirect("/listings");
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      const { statuscode = 500, message = "Something went wrong!" } = err; // Default to 500 for server errors
      res.render("listings/error.ejs", { message, statuscode }); // Pass statuscode to error template
    });

    // Start the server
    const port = process.env.PORT || 8080; // Use process.env.PORT for Render
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}!`);
      console.log("Connected to DB");
    });
  }) // End of .then() block
  .catch((err) => {
    console.log("Error while connection to DB", err);
    process.exit(1); // Exit if DB connection fails, as app cannot function
  });
