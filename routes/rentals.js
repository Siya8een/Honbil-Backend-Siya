const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const rentals = require("../controllers/Rentals");
const catchAsync = require("../utils/catchAsync");
const methodOverride = require("method-override");
const {
  isLoggedIn,
  isAuthor,
  validateRental,
  isVerified,
} = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

// router.use(express.json());
// router.use(express.urlencoded({ extended: false }));
// router.use(methodOverride("_method"));

router.use(bodyParser.urlencoded({ extended: false }));
router
  .route("/")
  .get(isLoggedIn, rentals.index)

  .post(
    isLoggedIn,
    // validateRental,
    upload.array("image"),
    catchAsync(rentals.createRental)
  );
// .post(upload.array("image"), (req, res, next) => {
//   console.log(req.body, req.files);
//   res.send("worked");
// });

// router.post("/", cpUpload, (req, res) => {
//   res.send("req.body");
// });

router.get("/new", isLoggedIn, rentals.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,

  catchAsync(rentals.renderEditForm)
);

router.route("/:id").get(catchAsync(rentals.showRental)).post(
  // validateRental,
  catchAsync(rentals.updateRental)
);

router.route("/delete/:id").post(catchAsync(rentals.deleteRental));

module.exports = router;
