const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  // res.send()

  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error saving the user" + err.message);
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
  try{
    const users = await User.find({});
    res.send(users)

  }catch (err){
    res.status(400).send("Some thing went wrong")
  }
});

//delete user

app.delete("/user",async (req,res)=>{
  const userId = req.body.userId;

  try{
    const user  = await User.findByIdAndDelete(userId)
    res.send("user deleted sussessfullly")
  }catch (err){
    res.status(400).send("Some thing went wrong")
  }
})

//update user 

app.patch("/user", async (req, res) => {
  const { userId, ...updateData } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
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
