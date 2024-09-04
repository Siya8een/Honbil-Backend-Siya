const Rental = require("../models/Rental");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const rentals = await Rental.find({});
  // console.log(req.session.user_id);
  const check = req.session.user_id;
  const user = await User.findById(check);
  // console.log(user);
  res.render("Rentals/index", { rentals, user, check });
};

module.exports.renderNewForm = (req, res) => {
  res.render("Rentals/new");
};

module.exports.createRental = async (req, res, next) => {
  console.log(req.body);

  const rental = new Rental(req.body.rental);

  rental.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));

  rental.author = req.user._id;
  await rental.save();

  const user = await User.findById(req.user._id);
  user.rentals.push(rental._id);

  await user
    .save()
    .then(() => {
      console.log(rental, "done👍");

      req.flash("success", "Successfully added a new Rental!");
      res.redirect(`/Honbil/${rental._id}`);
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports.showRental = async (req, res) => {
  const rental = await Rental.findById(req.params.id).populate("author");
  if (!rental) {
    req.flash("error", "Cannot find that Rental!");
    return res.redirect("/Honbil");
  }
  res.render("Rentals/show", { rental });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const rental = await Rental.findById(id)
  .populate("author");
  if (!rental) {
    req.flash("error", "Cannot find that Rental!");
    return res.redirect("/rental");
  }
  res.render("Rentals/edit", { rental });
};

module.exports.updateRental = async (req, res) => {
  const { id } = req.params;
  console.log("hit edit", req.body);
  await Rental.findByIdAndUpdate(id, {
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    quantity: req.body.quantity,
  })
    .then((result) => {
      console.log(result);
      req.flash("success", "Successfully updated rental!");
      res.redirect(`/Honbil/${id}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.deleteRental = async (req, res) => {
  try {
    console.log("hit delete");
    const { id } = req.params;
    await Rental.findByIdAndDelete(id);

    await User.findByIdAndUpdate(req.user._id, { $pull: { rentals: id } });
    req.flash("success", "Successfully deleted Rental");
    res.redirect("/Honbil");
  } catch (e) {
    console.log("error occured", e);
  }
};
