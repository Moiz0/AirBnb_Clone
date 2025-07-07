const User = require("../Models/user");

module.exports.RenderSignUp = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.SignUpRoute = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ email, username });
    const registeredUser = await User.register(newuser, password);
    console.log(registeredUser);

    // Now we do not require to login after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to AirBnb!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.RenderLogin = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.LoginRoute = async (req, res) => {
  req.flash("success", "Welcome");
  let redirectUrL = res.locals.redirectUrl || "/listings"; //if redirect url is empty then redirect to listings
  res.redirect(redirectUrL);
};

module.exports.LogoutRoute = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged out!");
    res.redirect("/listings");
  });
};
