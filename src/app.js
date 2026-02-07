const express = require("express");

const app = express();

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

app.use(
  "/user",
  (req, res, next) => {
    // this fnction is known as route handler
    // res.send("Route handler")

    console.log("handling multiple response handler");
    next();
    // res.send('1st working')
  },

  (req, res, next) => {
    console.log(
      "multiple response handler for that we use another argumnet which is next"
    );
    // res.send("working");
    next();
  },

  (req, res) => {
    console.log(
      "multiple response handler for that we use another argumnet which is next2"
    );
    res.send("working2");
  }
);

app.listen(3000, () => {
  console.log("server is on at 3000");
});
