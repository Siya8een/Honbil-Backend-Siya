const Orders = require("../models/orders");
const razor = require("../payments/razorpay");
const crypto = require("crypto");

module.exports.createOrder = async (req, res) => {
  const { amount, data, user } = req.body;
  console.log(req.body);
  const orderData = data.map((item) => ({
    name: item.name,
    quantity: item.amount, // Assuming amount corresponds to quantity
  }));
  const order = new Orders({ user, amount: amount / 100, order: orderData });

  await order
    .save()
    .then((result) => {
      console.log(result);

      razor
        .createOrder(amount, result._id)
        .then((result) => {
          res.status(200).send({ message: "Order created", order: result });
        })
        .catch((err) => {
          console.log(err);
          return res.status(501).send({ message: "internal server error " });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(501).send({ message: "internal server error " });
    });
};

module.exports.verify = async (req, res) => {
  try {
    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;

    console.log(body, res, "in verify");

    let expectedSignature = crypto
      .createHmac("sha256", process.env.secret_key)
      .update(body.toString())
      .digest("hex");

    let response = { signatureIsValid: "false" };
    if (expectedSignature === req.body.response.razorpay_signature) {
      response = { signatureIsValid: "true" };
      const order = await Orders.find({ user: req.body.id });
      console.log(order);
      order.isSuccess = true;
      order.paymentId = req.body.response.razorpay_payment_id;
      await order.save();
      console.log(order);

      res.status(200).send({ message: "Order created", response });
    }

    res.status(201).send({ message: "in valid signature", order: result });
  } catch (err) {
    console.log(err, "erree");
    return res.status(501).send({ message: "internal server error", err });
  }
};
