const express = require('express');
const router = express.Router();
const path = require('path');
const Manga = require('./../models/Manga');
const middleware = require("./../middleware/Middleware");
const multer = require("multer");

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, "./uploads");
     },
     filename: (req, file, cb) => {
          cb(null, req.params.id + ".jpg");
     },
});

const fileFilter = (req, file, cb) => {
     if (file.mimetype == "image/jpg" || file.mimetype == "image/png") {
          cb(null, true);
     } else {
          cb(null, false);
     }
};

const upload = multer({
     storage: storage,
     limits: {
          fileSize: 1024 * 1024 * 6,
     },
     // fileFilter: fileFilter
});

router.route("/add/image/:id")
     .patch(upload.single("image"), (req, res) => {
          Manga.findOneAndUpdate({ _id: req.params.id },
               {
                    $set: {
                         image: req.file.path,
                    },
               },
               { new: true },
               (err, result) => {
                    if (err) return res.status(500).send(err);
                    const response = {
                         message: "image added successfully",
                         data: result,
                    };
                    return res.status(200).send(response);
               }
          );
     });

router.route("/list/").get((req, res) => {
     Manga.find((err, result) => {
          if (err) return res.json(err);
          return res.json({ data: result });
     });
});

router.route("/list/: email").post(middleware.checkToken, (req, res) => {
     Manga.find({ email: req.decoded.email }, (err, result) => {
          if (err) return res.json(err);
          return res.json({ data: result });
     });
});

router.route("/getOtherManga").get(middleware.checkToken, (req, res) => {
     Manga.find({ username: { $ne: req.body.username } }, (err, result) => {
          if (err) return res.json(err);
          return res.json({ data: result });
     });
});

router.route("/add").post(middleware.checkToken, (req, res) => {

     Manga.deleteOne({ id: req.body.id });

     const newManga = new Manga({
          id: req.body.id,
          email: req.decoded.email,
          title: req.body.title,
          img: req.body.img,
          synopsis: req.body.synopsis,
          alt: req.body.alt,
          status: req.body.status,
          genres: req.body.genres,
          authors: req.body.authors,
     });
     newManga.save().then((result) => {
          res.json({ data: result["_id"] });
     }).catch((err) => {
          console.log(err), res.json({ err: err });
     });
});

router.route("/delete/:id").delete(middleware.checkToken, (req, res) => {
     Manga.findOneAndDelete(
          {
               $and: [{ email: req.decoded.email }, { id: req.params.id }],
          },
          (err, result) => {
               if (err) return res.json(err);
               else if (result) {
                    console.log(result);
                    return res.json("Manga Deleted!");
               }
               return res.json("Manga not Deleted!");
          }
     );
});

module.exports = router;