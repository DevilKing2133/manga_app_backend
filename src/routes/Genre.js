const express = require('express')
const router = express.Router()
const Genre = require('../models/Genre')

router.route("/list").get((req, res) => {
     Genre.find((err, result) => {
          if (err) return res.json(err);
          return res.json({ data: result });
     });
});

// Create Genre Route
router.route("/new").post((req, res) => {
     console.log("inside the Genre");
     const genre = new Genre({
          genre: req.body.genre,
     });
     genre
          .save()
          .then(() => {
               console.log("Genre Added");
               res.status(200).json({ msg: "Genre Successfully Added" });
          })
          .catch((err) => {
               res.status(403).json({ msg: err });
          });
});

router.route("/delete/:genre").delete((req, res) => {
     Genre.findOneAndDelete({ genre: req.params.genre }, (err, result) => {
          if (err) return res.status(500).json({ msg: err });
          const msg = {
               msg: "Genre deleted",
               genre: req.params.genre,
          };
          return res.json(msg);
     });
});

module.exports = router;