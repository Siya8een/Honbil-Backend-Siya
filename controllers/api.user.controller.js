const { clearCache } = require("ejs");

const Rental = require("../models/Rental");
const { User, validate } = require("../models/siteUser");
const RentalOwner = require("../models/user");
const bcrypt = require("bcrypt");
const { response } = require("express");
const Joi = require("joi");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.getRentals = async (req, res, next) => {
  if (req.query.search) {
    console.log(req.query.search);
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const rental = await Rental.find({ name: regex });
    res.json(rental);
  } else {
    try {
      const rental = await RentalOwner.find({ isVerified: "true" })
        .populate("rentals")
        .populate("reviews")
        .exec();
      res.json(rental);
    } catch (e) {
      console.log("Error occurred: ", e);
    }
  }
};
module.exports.getSingleRental = async (req, res, next) => {
  const rentalId = req.params.rentalId;
  console.log(rentalId);
  const rental = await RentalOwner.findById(rentalId)
    .populate("rentals")
    .populate("reviews")
    .then((result) => {
      res.status(201).json({
        type: "success",
        message: "rental found",
        data: result,
      });
    })
    .catch((err) => {
      res.status(201).json({
        type: "failure",
        message: "rental not found",
      });
    });
};

module.exports.siteUserRegister = async (req, res, next) => {
  console.log(req.body);
  try {
    const { error } = validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(409)
        .send({ message: "User with the given email already exists" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports.siteUserLogin = async (req, res, next) => {
  const valid = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    return schema.valid(data);
  };

  console.log(req.body, "here check");

  try {
    // const { error } = valid(req.body);
    // console.log(error());
    // if (error) {
    //   return res.status(400).send({ message: error });
    // }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid password or Password" });
    }
    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged In successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
