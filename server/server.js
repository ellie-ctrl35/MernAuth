const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("./models/User");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://tickle:tickle123@cluster0.irxj5yg.mongodb.net/employee"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

const verifyUser = ( req,res,next )=>{
    const token = req.cookie.token;
    if(!token){
        return res.json("Token is missing")
    }else{
        jwt.verify( token, "thespecialsecretkey",(err,decoded)=>{
            if(err){
                return res.json("Error with token")
            }else{
                if(decoded.role === "admin"){
                    next()
                }else{
                    return res.json("not admin")
                }
            }
        } )
    }
}

app.get("/dashboard",verifyUser,(req,res)=>{
    res.json("Success")
})

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({ name, email, password: hash })
        .then((user) => res.json("Success"))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, response) => {
        if (response) {
          const token = jwt.sign(
            { email: user.email, role: user.role },
            "thespecialsecretkey",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          res.json({ Status: "Success", role: user.role });
        } else {
          return res.json("The password is incorrect");
        }
      });
    } else {
      return res.json("No record found");
    }
  });
});

app.listen(3001, () => {
  console.log("running");
});
