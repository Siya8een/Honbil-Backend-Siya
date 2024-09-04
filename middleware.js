const { rentalSchema, reviewSchema, userSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Rental = require("./models/Rental");
const Review = require("./models/review");
const User = require("./models/user");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isLoggedInAdmin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/admin/login");
  }
  next();
};

module.exports.isVerified = async (req, res, next) => {
  const { username } = req.body;
  console.log(username);
  const user = await User.find({ username: username });
  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  console.log(user);
  console.log(isEmpty(user));

  if (isEmpty(user)) {
    req.flash("error", "You must be register first");
    res.redirect("/register");
  } else if (user[0].isVerified === "false") {
    req.session.returnTo = req.originalUrl;
    req.flash("alert", "Please wait while we get your details verified!");
    res.redirect("/LoginWait");
  } else {
    console.log("hit");
    next();
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateRental = (req, res, next) => {
  console.log("hit", req);
  const { error } = rentalSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    console.log(error);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const rental = await Rental.findById(id);
  if (!rental.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/rentals/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/rentals/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
