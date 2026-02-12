const {adminAuth,userAuth} = require("./middlewares/auth")


app.use("/admin",adminAuth)

// app.get("/user",(req,res)=>{
//     res.send({firstname:'dushal',lastname:'arora'})
// })

// app.post("/user",(req,res)=>{
//     res.send("data saved in db!")
// })

// app.delete("/user",(req,res)=>{
//     res.send('delete done')
// })

// app.get("/test",(req,res)=>{
//     res.send("hello from server!")
// })

// app.post('/test',(req,res)=>{
//     if(req === "123"){
//         res.send('you are geting it')
//     }else res.send('learning')
// })

// app.use("/hello",(req,res)=>{
//     res.send("hellooooo")
// })

// app.use("/",(req,res)=>{
//     res.send("dashboard")
// })

// app.get("/user/:userId/:name", (req, res)=>{
//     console.log(req.params)
//     res.send({first:'dushal'})
// })

// app.use(
//   "/user",
//   (req, res, next) => {
//     // this fnction is known as route handler
//     // res.send("Route handler")

//     console.log("handling multiple response handler");
//     next();
//     // res.send('1st working')
//   },

//   (req, res, next) => {
//     console.log(
//       "multiple response handler for that we use another argumnet which is next"
//     );
//     // res.send("working");
//     next();
//   },

//   (req, res) => {
//     console.log(
//       "multiple response handler for that we use another argumnet which is next2"
//     );
//     res.send("working2");
//   }
// );
// app.use("/", (req, res, next) => {
//   console.log(
//     "with use of next we would go in next and this route will be act as a entry route but not handle the all route"
//   );
//   next();
// });

// app.get("/user", (req, res, next) => {
//   console.log("handling the route user!!");
//   next();
// });

app.get("/user", userAuth, (req, res) => {
  console.log("user route handler");
  res.send("2nd route hanlder");
});

app.get(
  "/test",
  (req, res, next) => {
    console.log("new testing");
    next();
  },
  (req, res, next) => {
    console.log(
      "these kind o pattern are called middle ware so what happen when the request comes these middle ware one by one until the request did not get res.send"
    );

    next();
  },

  (req, res) => {
    res.send("3r respone coming threw middle ware");
  }
);

//the next can be use as parent route to give a check below is exapmle

// app.get("/admin/getAlldata",(req,res)=>{
//     //logic of checking if request us autozied

//     // const token = "xreq.body?.token";
//     const token = "xyz"
//     const isAdminAuthorized = token === "xyz"

//     //we will not gonna do that for every route we will create middleware
//     if(isAdminAuthorized){

//         res.send("all data sent")

//     }else {
//         res.status(401).send("unauthozie user")
//     }

// })

//this route will handle all admin entry point to handle admin authorization


app.get("/admin/getAlldata", (req, res) => {
  res.send("all data sent");
});



app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.find({ emailId: email });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("some thing went wrong");
  }
});



app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Some thing went wrong");
  }
});




app.patch("/user/:userId", async (req, res) => {
  const updateData = req.body;
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  // if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return res.status(400).json({ message: "Invalid userId" });
  // }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No data provided to update" });
  }

  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  const isUpdateAllowed = Object.keys(updateData).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  if (!isUpdateAllowed) {
    return res.status(400).json({ message: "Update is not allowed" });
  }

  if (updateData.gender) {
    updateData.gender = updateData.gender.toLowerCase();
  }

  try {
    if (updateData?.skills.length > 10) {
      throw new Error("Skills can not be more then 10");
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("PATCH /user error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});