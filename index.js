if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Admin = require("./models/admin");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users");
const RentalRoutes = require("./routes/rentals");
const reviewRoutes = require("./routes/reviews");
const adminRoutes = require("./routes/admin");
const userApiRoutes = require("./routes/api.user.router");
const orderRoutes = require("./routes/orders");

const port = process.env.PORT || 8080;

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
// passport.use(new LocalStrategy("admin-local", Admin.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());

app.use((req, res, next) => {
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/admin", adminRoutes);
app.use("/Honbil", RentalRoutes);
app.use("/", userRoutes);
app.use("/api/v1", userApiRoutes);

app.use("/Honbil/:id/reviews", reviewRoutes);
app.use("/orders", orderRoutes);
app.get("/home", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(res.render("errorAll"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

mongoose
  .connect(MONGODB_URI)
  .then(async (result) => {
    console.log("Database Connected!!");
    app.listen(port, () => {
      console.log("lets goo");
    });
  })
  .catch((err) => {
    console.log(err);
  });
