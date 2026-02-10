const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData, validateLogin } = require("./utils/validation");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

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
    const isPasswordIsvalid = await bcrypt.compare(password, user.password);
    if (isPasswordIsvalid) {
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error saving the user: " + err.message);
  }
});
app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("some thing went wrong");
  }
});

//Feed api get all user
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Some thing went wrong");
  }
});

//delete user

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted sussessfullly");
  } catch (err) {
    res.status(400).send("Some thing went wrong");
  }
});

//update user

app.patch("/user/:userId", async (req, res) => {
  const updateData = req.body;
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  // if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return res.status(400).json({ message: "Invalid userId" });
  // }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No data provided to update" });
  }

  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  const isUpdateAllowed = Object.keys(updateData).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  if (!isUpdateAllowed) {
    return res.status(400).json({ message: "Update is not allowed" });
  }

  if (updateData.gender) {
    updateData.gender = updateData.gender.toLowerCase();
  }

  try {
    if (updateData?.skills.length > 10) {
      throw new Error("Skills can not be more then 10");
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("PATCH /user error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
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
