const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
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
  },
  { timestamps: true }
);

//it is good practice for attaching a user scema so every has an jwt token do write valiatepassword it makes readablety goods
//arrow funtion it breaks things because (this ) kwyword does not works with arrow function

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder@0610", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputbyUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordIsvalid = await bcrypt.compare(
    passwordInputbyUser,
    passwordHash
  );

  return isPasswordIsvalid;
};
const User = mongoose.model("user", userSchema);

module.exports = User;
