const express = require("express");

const app = express();



app.use("/test",(req,res)=>{
    res.send("hello from server!")
})

app.use("/hello",(req,res)=>{
    res.send("hellooooo")
})

app.use("/",(req,res)=>{
    res.send("dashboard")
})

app.listen(3000, ()=>{
    console.log("server is on at 3000")
});
