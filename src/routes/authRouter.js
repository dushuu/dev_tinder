const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData, validateLogin } = require("../utils/validation");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  // res.send()
  //validation of data

  //encrypt the password

  try {
    const { password, firstName, lastName, emailId, age, gender } =
      validateSignUpData(req);
    const passWordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passWordHash,
      age,
      gender,
    });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = validateLogin(req);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordIsvalid = await user.validatePassword(password);
    if (isPasswordIsvalid) {
      //create a JWT Token we create it from userSchema
      //Add the token to cookie and send te reponse back to the user
      //for expire the token we pass this way 1h , 1d ,7d or date
      const token = await user.getJWT();
      // for httpsonly it wokrs on httpsonly so cookie only works for https reques
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error saving the user: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout succesfully");
});
module.exports = authRouter;
