const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const session = require("express-session");

module.exports.renderDashBoard = async (req, res, next) => {
  const users = await User.find();
  //   console.log(users);

  res.render("admin/index", { users });
};
module.exports.renderLogin = (req, res, next) => {
  res.render("admin/login");
};

module.exports.approveDealer = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const user = await User.findByIdAndUpdate(id, {
    isVerified: "true",
  });

  req.flash("success", "User Approved!");
  res.redirect("/admin/home");
};

module.exports.isLoggedIn = async (req, res, next) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) {
    req.flash("error", "Cannot please check your username or password!");
    return res.redirect("/admin/login");
  } else {
    const validPassword = await bcrypt.compare(password, admin.password);
    if (validPassword) {
      req.session.admin_id = admin._id;
      console.log(req.session.admin_id);
      res.redirect("/admin/home");
    } else {
      req.flash("error", "Cannot please check your username or password!");
      return res.redirect("/admin/login");
    }
  }
};

module.exports.loginCheck = async (req, res, next) => {
  const check = req.session.admin_id;

  if (!req.session.admin_id) {
    req.flash("error", "Please Login!");
    res.redirect("/admin/login");
  } else {
    next();
  }
};

module.exports.renderAdminUserControl = (req, res, next) => {
  res.render("admin/users");
};

module.exports.renderApproved = (req, res, next) => {
  res.render("admin/approved");
};

module.exports.logout = (req, res, next) => {
  req.session.admin_id = null;
  console.log("check");
  req.flash("success", "Goodbye!");
  res.redirect("/admin/login");
};
