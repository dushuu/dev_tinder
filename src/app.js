const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter");
const requestRouter = require("./routes/requestRouter");
const profileRouter = require("./routes/profileRouter");

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter)

connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server is on at 3000");
    });
  })
  .catch((err) => {
    console.error("not conected", err);
  });
