const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.post("/sendConnection", userAuth, async (req, res) => {
  console.log("sending a connection request");

  const user = req.user;

  res.send(user.firstName + "sent the connection request!");
});

module.exports = profileRouter;
