const express = require("express");
const router = express.Router();
const orders = require("../controllers/orders");

router.post("/create", orders.createOrder);
router.post("/verify", orders.verify);

module.exports = router;
