const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.secret_key,
});

// Create an order
async function createOrder(amount, receipt) {
  try {
    const options = {
      amount: amount,
      currency: "INR",
      receipt: receipt,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw error;
  }
}

// Capture a payment
async function capturePayment(paymentId, amount) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    const response = await razorpay.payments.capture(paymentId, amount);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  capturePayment,
};
