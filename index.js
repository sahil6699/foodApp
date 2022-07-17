const express = require("express");

const mongoose = require("mongoose");
const app = express();

app.use(express.json()); //global middleware function

app.listen(3000, (req, res) => {
  console.log("server is up and running on port:", 3000);
});

let users = [
  {
    id: 1,
    name: "sachin",
  },
  {
    id: 2,
    name: "saurav",
  },
  {
    id: 3,
    name: "sahil",
  },
];

//mini app
const authRouter = express.Router();

//base route, router to use
app.use("/auth", authRouter);

authRouter
  .route("/signup") //path specific middle ware function
  .get(middleware1, getSignup, middleware2)
  .post(postSignup);

//middleware function
function middleware1(req, res, next) {
  console.log("middleware1 function");
  next();
}

//middleware function
function middleware2(req, res) {
  console.log("middleware2 function");
  console.log("middleware 2  ended req/ res cycle");
  res.sendFile("./public/signup.html", { root: __dirname });
}

//fuction called up on get request
function getSignup(req, res, next) {
  console.log("get signup");
  // res.sendFile("./public/signup.html", { root: __dirname });
  next();
}
//fnction called up on post request
function postSignup(req, res) {
  let obj = req.body;
  console.log("backend", obj);
  res.json({
    message: "user signed-up successfully",
    data: obj,
  });
}

const db_link =
  "mongodb+srv://sahil6699:jarvis1966@cluster0.dpta9i8.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(db_link)
  .then((db) => {
    // console.log(db);
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });
