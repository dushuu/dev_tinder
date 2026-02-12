const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData, validateLogin } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = validateLogin(req);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
  const isPasswordIsvalid = await user.validatePassword(password)
    if (isPasswordIsvalid) {
      //create a JWT Token we create it from userSchema
      //Add the token to cookie and send te reponse back to the user
      //for expire the token we pass this way 1h , 1d ,7d or date
      const token = await user.getJWT()
      // for httpsonly it wokrs on httpsonly so cookie only works for https reques 
      res.cookie("token", token,{
        expires: new Date(Date.now() + 8 * 3600000)
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error saving the user: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

app.post("/sendConnection", userAuth , async (req,res)=>{
  console.log("sending a connection request")

  const user = req.user

  res.send(user.firstName + "sent the connection request!")
})


connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server is on at 3000");
    });
  })
  .catch((err) => {
    console.error("not conected", err);
  });

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted sussessfullly");
  } catch (err) {
    res.status(400).send("Some thing went wrong");
  }
});
