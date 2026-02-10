const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return this.isNew;
    },
    min: 2,
    max: 20,
  },
  lastName: {
    type: String,
    min: 2,
    max: 20,
  },

  emailId: {
    type: String,
    required: function () {
      return this.isNew;
    },
    unique: true,
    lowercase: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email address: "+ value)

      }

    },
    index: true,
  },
  password: {
    type: String,
    required: function () {
      return this.isNew;
    },
  },
  age: {
    type: Number,
    min: 18,
    max: 50,
    required: function () {
      return this.isNew;
    },
  },
  gender: {
    type: String,
    required: function () {
      return this.isNew;
    },
    validate(value) {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender data is not valid");
      }
    },
  },
  photoUrl: {
    type: String,
    default: "https://geographyandyou.com/images/user-profile.png",
  },
  about: {
    type: String,
    default: "This is default about of user!",
  },
  skills: {
    type: [String],
  },
},{timestamps:true});

const User = mongoose.model("user", userSchema);

module.exports = User;
