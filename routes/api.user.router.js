const express = require("express");
const apiUserController = require("../controllers/api.user.controller");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

router.get("/rentals", apiUserController.getRentals);
router.get("/rentals/:rentalId", apiUserController.getSingleRental);
router.post("/rentals/signup", apiUserController.siteUserRegister);
router.post("/rentals/login", apiUserController.siteUserLogin);
module.exports = router;
