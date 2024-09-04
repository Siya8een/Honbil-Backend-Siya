const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const RentalSchema = new Schema({
  title: String,
  images: [{ url: String, filename: String }],
  price: Number,
  description: String,
  location: String,
  quantity: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Rental", RentalSchema);
