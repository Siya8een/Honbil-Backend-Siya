const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  rentalLocation: { type: String },
  rentals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rental",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  images: [ImageSchema],
  legal: [ImageSchema],
  isVerified: { type: String, default: "false" },
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.virtual("properties.popUpMarkup").get(function () {
  return `
    <strong><a href="/Honbil/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`;
});

UserSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("User", UserSchema);
