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
const applySecurityMiddleware = require("./ErrorHandle/security.js"); // Assuming this is your helmet config

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware (these do NOT depend on DB connection, so they can be here)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Apply security middleware (this does not depend on DB connection)
applySecurityMiddleware(app);

// MongoDB Atlas connection string from .env
const dbUrl = process.env.ATLASDB_URL; // <<< IMPORTANT: Make sure this is ATLASDB_URL as per your .env

// Connect to MongoDB using async/await
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to DB");

    // >>>>>>> ALL CODE BELOW THIS LINE (THAT DEPENDS ON DB OR SESSIONS) MUST BE INSIDE THIS .THEN() BLOCK <<<<<<<

    // Configure session store using MongoDB
    // NOW mongoose.connection.getClient() will be available
    const store = MongoStore.create({
      clientPromise: mongoose.connection.getClient(),
      crypto: {
        secret: process.env.SECRET, // Use process.env.SECRET from your .env
      },
      touchAfter: 24 * 3600,
    });

    // Handle session store errors
    store.on("error", (err) => {
      console.log("Error in mongo session", err);
    });

    // Session configuration
    const sessionOptions = {
      store,
      secret: process.env.SECRET || "mysecretcode",
      resave: false,
      saveUninitialized: true,
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
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
      const { statuscode = 500, message = "Something went wrong!" } = err; // Default to 500 for server errors
      res.render("listings/error.ejs", { message, statuscode }); // Pass statuscode to error template
    });

    // Start the server
    const port = process.env.PORT || 8080; // Use process.env.PORT for Render
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}!`);
    });
  }) // End of .then() block
  .catch((err) => {
    console.log("Error while connection to DB", err);
    process.exit(1); // Exit if DB connection fails, as app cannot function
  });
