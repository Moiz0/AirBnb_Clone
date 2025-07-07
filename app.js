if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
(ejsMate = require("ejs-mate")), app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviewR.js");
const UserRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");
const MongoStore = require("connect-mongo");

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in mongo session", err);
});
const sessionOptions = {
  store,
  secret: "mysecretcode", // implement session
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // implement cookie
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//bmoiz977   nppu7aVgcVZul6id
//mongodb+srv://bmoiz977:<db_password>@cluster0.o3ei54n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
app.use(session(sessionOptions));
app.use(flash()); //implement it before routes

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); // Correct way to serialize user with passport-local-mongoose
passport.deserializeUser(User.deserializeUser()); // Correct way to deserialize user with passport-local-mongoose

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//create MW before routes
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.CurrentUser = req.user;
  next(); //dont forget to call next()
});

app.use("/listings", listingRouter); // routes
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", UserRouter);

app.use((err, req, res, next) => {
  const { statuscode = 404, message = "Something went wrong!" } = err;
  res.render("listings/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening to 8080!");
});
