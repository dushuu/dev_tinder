const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");

router.post("/request/send", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { toUserId, status } = req.body;

    const allowedStatus = ["interested", "ignore"];

    
    if (!toUserId || !status) {
      return res.status(400).json({
        message: "toUserId and status are required",
      });
    }

    

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({
        message: "You cannot send connection request to yourself",
      });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {


      if (existingRequest.status === "accepted") {
        return res.status(400).json({
          message: "You are already connected",
        });
      }

    
      if (existingRequest.status === "rejected") {
        return res.status(400).json({
          message: "Cannot send connection request",
        });
      }


      if (existingRequest.status === "interested") {
        return res.status(400).json({
          message: "Connection request already pending",
        });
      }

      
      if (existingRequest.status === "ignore") {

     
        if (existingRequest.fromUserId.toString() !== fromUserId.toString()) {
          return res.status(400).json({
            message: "Cannot resend request",
          });
        }

     
        existingRequest.status = status;
        await existingRequest.save();

        return res.json({
          message: "now" + req.user.firstName + " is " + status + " in " + toUser.firstName,
          data: existingRequest,
        });
      }
    }

  
    const newRequest = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });

    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data: newRequest,
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});





router.post("/request/review", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user.id;
    const { status, requestId } = req.body;
    if (!requestId || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    const request = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedinUser,
      status: "interested",
    }).populate("fromUserId", "firstName lastName email");

    if (!request) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    request.status = status;

    const data = await request.save();

    res.json({ message: `Connection request has been ${status}`, data: data });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = router;
