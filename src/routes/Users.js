const express = require('express');
const User = require('./../models/Users');
const config = require("../config");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
let middleware = require("./../middleware/Middleware");
const router = express.Router();

router.route("/list").get((req, res) => {
     User.find((err, result) => {
          if (err) return res.json(err);
          return res.json({ data: result });
     });
});

router.route("/:email").get(middleware.checkToken, (req, res) => {
     User.findOne({ email: req.params.email }, (err, result) => {
          if (err) return res.status(500).json({ msg: err });
          return res.json({
               data: result,
               email: req.params.email,
          });
     });
});

router.route("/checkemail/:email").get((req, res) => {
     User.findOne({ email: req.params.email }, (err, result) => {
          if (err) return res.status(500).json({ msg: err });
          if (result !== null) {
               return res.json({
                    Status: true,
               });
          } else
               return res.json({
                    Status: false,
               });
     });
});

router.route("/login").post((req, res) => {
     User.findOne({ email: req.body.email }, (err, result) => {
          if (err) return res.status(500).json({ msg: err });
          if (result === null) {
               return res.status(403).json("Email incorrect");
          }
          const validPassword = bcrypt.compare(req.body.password, result.password);

          if (validPassword) {
               // here we implement the JWT token functionality
               let token = jwt.sign({ email: req.body.email }, config.key, {});

               res.json({
                    token: token,
                    msg: "success",
               });
          } else {
               res.status(403).json("Invalid Credentials, Check Login Details");
          }
     });
});

router.route("/register").post((req, res) => {
     console.log("inside the register");
     const salt = bcrypt.genSaltSync(10);
     const hashPassword = bcrypt.hashSync(req.body.password,salt);
     const user = new User({
          email: req.body.email,
          password: hashPassword,
          username: req.body.username,
     });
     user
          .save()
          .then(() => {
               console.log("user registered");
               res.status(200).json({ msg: "User Successfully Registered" });
          })
          .catch((err) => {
               res.status(403).json({ msg: err });
          });
});

router.route("/update/:email").patch(middleware.checkToken, (req, res) => {
     console.log(req.params.email);
     User.findOneAndUpdate(
          { email: req.params.email },
          { $set: { password: req.body.password } },
          (err, result) => {
               if (err) return res.status(500).json({ msg: err });
               const msg = {
                    msg: "password successfully updated",
                    email: req.params.email,
               };
               return res.json(msg);
          }
     );
});

router.route("/delete/:email").delete(middleware.checkToken, (req, res) => {
     User.findOneAndDelete({ email: req.params.email }, (err, result) => {
          if (err) return res.status(500).json({ msg: err });
          const msg = {
               msg: "User deleted",
               email: req.params.email,
          };
          return res.json(msg);
     });
});

module.exports = router;