const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Dushal",
    lastName: "Arora",
    emailId: "test@exampe.com",
    password: "test",
    gender: "male",
  };
  const user = new User(userObj);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user" + err.message);
  }
});

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
