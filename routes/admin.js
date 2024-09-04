const express = require("express");
const router = express.Router();
const admin = require("../controllers/admin");
const passport = require("passport");
const { isLoggedInAdmin, isLoggedIn } = require("../middleware");
const nodemailer = require("nodemailer");

router.route("/home").get(admin.loginCheck, admin.renderDashBoard);

router
  .route("/home/:id")
  .get(admin.loginCheck, admin.renderApproved)
  .post(admin.approveDealer);

router.route("/login").get(admin.renderLogin).post(admin.isLoggedIn);
router.get("/users", admin.loginCheck, admin.renderAdminUserControl);
router.get("/logout", admin.logout);

module.exports = router;
