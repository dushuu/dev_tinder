const mongoose = require("mongoose");
const url = "mongodb+srv://Dushal:dushal1234@learn.pkkgtas.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = connectDB

