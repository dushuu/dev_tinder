const express = require("express");
const User = require("../models/user");

const router = express.Router();
const { userAuth } = require("../middlewares/auth");

router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = router;
