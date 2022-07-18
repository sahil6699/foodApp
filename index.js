const express = require("express");

const mongoose = require("mongoose");
const app = express();

const emailValidator = require("email-validator");

app.use(express.json()); //global middleware function

app.listen(3000, (req, res) => {
  console.log("server is up and running on port:", 3000);
});

// let users = [
//   {
//     id: 1,
//     name: "sachin",
//   },
//   {
//     id: 2,
//     name: "saurav",
//   },
//   {
//     id: 3,
//     name: "sahil",
//   },
// ];

//mini app
const authRouter = express.Router();

//base route, router to use
app.use("/auth", authRouter);

authRouter
  .route("/signup") //path specific middle ware function
  .get(getSignup)
  .post(postSignup)
  .patch(updateUser)
  .delete(deleteUser);

// //middleware function
// function middleware1(req, res, next) {
//   console.log("middleware1 function");
//   next();
// }

// //middleware function
// function middleware2(req, res) {
//   console.log("middleware2 function");
//   console.log("middleware 2  ended req/ res cycle");
//   res.sendFile("./public/signup.html", { root: __dirname });
// }

//function called up on get request

async function getSignup(req, res, next) {
  // console.log("get signup");
  // res.sendFile("./public/signup.html", { root: __dirname });
  /* find is used to return all the documents which are made in the database */
  let allUsers = await userModel.find();
  // let allUsers = await userModel.findOne({ name: "hemang" });
  res.json({ message: "list of all users", data: allUsers });
  next();
}

//functions called up on post request
async function postSignup(req, res) {
  //post request is used to create a new document in the database
  let dataObj = req.body;
  //userModel.create is used to create a new document in the database
  let user = await userModel.create(dataObj);
  console.log("backend", user);
  res.json({
    message: "user signed-up successfully",
    data: user,
  });
}

async function updateUser(req, res) {
  console.log("req-body->", req.body);
  //update data in users object
  let dataToBeUpdated = req.body;
  let user = await userModel.findOneAndUpdate(
    { email: "hemang@gmail.com" },
    dataToBeUpdated
  );
  // for (key in dataToBeUpdated) {
  //   users[key] = dataToBeUpdated[key];
  // }
  res.json({
    message: "data updated succesfully",
    data: user,
  });
}

async function deleteUser(req, res) {
  //delete data from users object
  //findOneandDelete selects the document and deletes it
  let dataToBeDeleted = req.body;
  let user = await userModel.findOneAndDelete(dataToBeDeleted);
  res.json({
    message: "data has been deleted",
    data: user,
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

//schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    //if unique: true, it will throw error if duplicate email is entered, anywhere in the db
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email);
    },
  },
  password: {
    type: String,
    required: true,
    //if passoword length is less than 8 chars then it will throw error
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: function () {
      return this.confirmPassword === this.password;
    },
  },
});

//model
const userModel = mongoose.model("userModel", userSchema);

// (async function createUser() {
//   let user = {
//     name: "hemang",
//     email: "hemang@gmail.com",
//     password: "78907890",
//     confirmPassword: "78907890",
//   };

//   let data = await userModel.create(user);
//   console.log(data);
// })();

/* mongodb will also create _id and __v whenever we'll create  new object */

//hooks in mongoose
//hooks are used to perform some action before or after the creation of a new document

//currently i don't know why they are not working , i copied the same code from the pepcoding lecture
//pre hook
//before save event occurs in db
// userSchema.pre("validate", function (next) {
//   console.log("before saving in db", this);
//   next();
// });

// //post hook
// //after save event occurs in db
// userSchema.post("save", function (doc, next) {
//   console.log("after saving in db", doc);
//   next();
// });

/* here we are making confirmPassword as a virtual field
virtual field is a field which is not present in the db
virtual field is used to store the value of confirmPassword
 */
userSchema.pre("save", function () {
  this.confirmPassword = undefined;
});

/* * MongoServerError: 
E11000 duplicate key error collection:
test.usermodels index: email_1 dup key:
{ email: "sahil@gmail.com" } 

this error is caused by duplicate email
as we have used unique: true in schema
*/

/* ValidationError: userModel validation failed:
password: Path `password` (`7`) is shorter than the minimum allowed length 
(8). 

this error is caused by minLength: 8 in schema
bczo the provided password is less than 8 chars
*/
