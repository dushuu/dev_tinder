const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

profileRouter.post("/request/send", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.body;

    const allowedStatus = ["ignore", "interested"];

    if (!toUserId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    // prevent sending to yourself
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
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
          status === "interested"
            ? "Connection request sent"
            : "User ignored",
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
        status === "interested"
          ? "Connection request sent"
          : "User ignored successfully",
      data: existingRequest,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});


module.exports = profileRouter;
