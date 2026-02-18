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


const bcrypt = require("bcrypt");

router.post("/changePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    // 1️⃣ Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password are required",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      loggedInUser.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

  
    if (oldPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be same as old password",
      });
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);


    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res.json({
      message: "Password changed successfully",
    });

  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});



module.exports = router;
