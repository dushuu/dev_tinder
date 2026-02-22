const express = require("express");
const router = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = "firstName lastName emailId age gender about skills";


router.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const requests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    //the populate function is gonna work only when we link the connection schema with user schema using ref then it bulid the relation and
    //and after it the populate can send get the data of user
    res.json({
      message: "Pending connection requests",
      data: requests,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

router.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId, status: "accepted" },
        { fromUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId; // if I sent request
      } else {
        return row.fromUserId; // if I received request
      }
    });

    res.json({
      count: data.length,
      data,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    let page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;

    page = Math.max(page, 1);
    limit = Math.min(Math.max(limit, 1), 50);

    const skip = (page - 1) * limit;

    // Hide self + anyone already involved in a request with logged-in user.
    const existingConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set([loggedInUserId.toString()]);

    existingConnections.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select("firstName lastName age gender about skills photoUrl")
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      count: feedUsers.length,
      data: feedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
