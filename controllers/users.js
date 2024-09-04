const User = require("../models/user");
const nodemailer = require("nodemailer");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxtoken = process.env.MAP_BOX;
const geoCoder = mbxGeocoding({ accessToken: mapboxtoken });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_MAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  port: 465,
  host: "smtp.gmail.com",
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Lets go babbyy");
  }
});

//made to test the working of email

module.exports.test = (req, res) => {
  console.log("hit");
  const mailOptions = {
    from: process.env.GMAIL_MAIL,
    to: "21bma010@nith.ac.in",
    subject: "Welcome to HonBil.",
    html: `
Dear  your password is :-. Please use this to login again.`,
  };

  transporter
    .sendMail(mailOptions)
    .then(() => {
      //email sent and verification saved

      res.status(201).json({
        type: "success",
        message: "mail sent",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(201).json({
        type: "failure",
        message: "denial email not sent",
      });
    });
};

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password, phone } = req.body;

    const geoData = await geoCoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();

    const user = new User({
      email,
      username,
      phone,
      rentalLocation: req.body.location,
    });
    console.log(user);
    const obj = Object.assign({}, req.files);
    console.log(obj);
    const imagesObj = obj.image;
    const legalObj = obj.legal;
    const imagesUrl = imagesObj[0].path;
    const imagesPath = imagesObj[0].filename;
    const legalUrl = legalObj[0].path;
    const legalPath = legalObj[0].filename;
    // images.url = imagesUrl;
    // legal.url = legalUrl;
    // images.path = imagesPath;
    // legal.path = legalPath;
    // const images = images.url;
    // const images2 = images.path;
    // const legal = legal.url;
    // const legal2 = legal.path;
    imagesArr = [{ url: imagesUrl, filename: imagesPath }];
    legalArr = [{ url: legalUrl, filename: legalPath }];
    // user.images.path = imagesUrl;
    // user.legal.path = legalUrl;
    // user.images.url = imagesPath;
    // user.legal.url = legalPath;

    user.geometry = geoData.body.features[0].geometry;
    user.images = imagesArr.map((f) => ({ url: f.url, filename: f.filename }));
    user.legal = legalArr.map((f) => ({ url: f.url, filename: f.filename }));

    console.log(user);
    await User.register(user, password)
      .then((result) => {
        console.log(result);
        console.log("hit");
        // const mailOptions = {
        //   from: process.env.GMAIL_MAIL,
        //   to: email,
        //   subject: "Welcome to HonBil.",
        //   html: `
        // Dear ${username}.Your credentials are :- username:- <b> ${username}</b> , password is :- <b> ${password}</b>. Please use this to login again.`,
        // };

        // transporter
        //   .sendMail(mailOptions)
        //   .then((result) => {
        //     //email sent and verification saved
        //     console.log("email sent", result);

        //     // req.flash("success", "Welcome to HonBil!");
        //     res.redirect("/Thanks");
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     res.status(201).json({
        //       type: "failure",
        //       message: "denial email not sent",
        //     });
        //   });
        res.redirect("/Thanks");
      })
      .catch((err) => {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("register");
      });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};
module.exports.renderWait = (req, res) => {
  res.render("users/wait");
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back!");

  const user = await User.find({ username: req.body.username });

  req.session.user_id = user[0]._id;
  const redirectUrl = "/Honbil";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "Goodbye!");
  res.redirect("/Home");
};
