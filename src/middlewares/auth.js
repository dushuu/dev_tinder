const Jwt = require("jsonwebtoken");
const UserModal = require("../models/user");

// const adminAuth = (req, res, next) => {
//   //there is another funtion app.all
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   if (isAdminAuthorized) {
//     console.log("admin is get cheked");
//     next();
//   } else res.status(401).send("Unauthorized request");
// };

const userAuth = async (req, res, next) => {
  //read the token from req cookies
  // validate the token
  //find the user
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token is not valid");
    }
    const decodeObj = await Jwt.verify(token, "DEV@Tinder@0610");
    const { _id } = decodeObj;

    const user = await UserModal.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  userAuth,
};
