const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");
const adminSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username cannot  be empty"],
  },
  password: {
    type: String,
    required: [true, "Password cannot  be empty"],
  },
});
// adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);
