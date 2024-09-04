const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  amount: {
    type: Number,
    required: [true, "Total order price needs to be specified"],
  },
  order: [
    {
      name: {
        type: String,
        required: [true, "Product name is required"],
      },
      quantity: {
        type: Number,
        required: [true, "quantity of ordered products needs to be added "],
      },
    },
  ],
  isSuccess: {
    type: Boolean,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "siteUser",
  },
  paymentId: String,
});

module.exports = mongoose.model("Order", orderSchema);
