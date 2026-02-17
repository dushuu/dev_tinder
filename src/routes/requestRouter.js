const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");

profileRouter.post("/request/send", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.body;
    if (!toUserId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    const toUser = await User.findById(toUserId);

    if (!toUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const allowedStatus = ["ignore", "interested"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    // prevent sending to yourself
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        message:
          "You can not send connection to your self but self love is good :)",
      });
    }

    // check existing request
    let existingRequest = await ConnectionRequest.findOne({
      fromUserId,
      toUserId,
    });

    if (!existingRequest) {
      const newRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await newRequest.save();

      return res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,

        data,
      });
    }

    if (existingRequest.status === status) {
      return res.status(400).json({
        message: `Already marked as ${status}`,
      });
    }

    existingRequest.status = status;
    await existingRequest.save();

    return res.json({
      message:
      req.user.firstName + " is " + status + " in " + toUser.firstName,
      data: existingRequest,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
