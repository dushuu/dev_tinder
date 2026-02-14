const express = require("express");
const User = require("../models/user");

const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validation");

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});





router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    
    validateProfileData(req);


    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});


module.exports = router;
