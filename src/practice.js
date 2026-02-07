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

