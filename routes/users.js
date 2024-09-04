const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isVerified, isMailVerified } = require("../middleware");
const users = require("../controllers/users");

const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

// router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router
  .route("/register")
  .get(users.renderRegister)
  .post(
    upload.fields([
      { name: "image", maxCount: 2 },
      { name: "legal", maxCount: 8 },
    ]),

    catchAsync(users.register)
  );

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    isVerified,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),

    users.login
  );

//route foe testing if mail is working or not ..
// router.route("/test").get(users.test);

router.route("/Thanks").get(users.renderWait);
router.route("/LoginWait").get(users.renderWait);
router.get("/logout", isLoggedIn, users.logout);

module.exports = router;
