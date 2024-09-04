//const Rental = require("../models/Rental");
const Review = require("../models/review");
const RentalOwner = require("../models/user");

module.exports.createReview = async (req, res) => {
  await Review.find({ author: req.params.id })
    .then(async () => {
      const rental = await RentalOwner.findById(req.params.id);
      const review = new Review({
        rating: req.body.rating,
        body: req.body.body,
      });
      review.author = req.params.id;
      rental.reviews.push(review);
      await review.save();
      await rental.save();
      console.log("REVIEW", review);
      res.status(201).send({ message: "success" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await RentalOwner.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/Honbil/${id}`);
};
