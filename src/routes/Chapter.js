const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const multer = require('multer');

//set storage
const storage = multer.diskStorage({
     destination: (req,file,cb) => {
          cb(null, './uploads');
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + req.params.id + ".jpg");
     }
});

// const fileFilter = (req, file, cb) => {
//      if (file.mimetype == "image/jpg" || file.mimetype == "image/png") {
//           cb(null, true);
//      } else {
//           cb(null, false);
//      }
// };

const upload = multer({
     storage: storage,
     // fileFilter: fileFilter
     limits: {
          fileSize: 1024 * 1024 * 6,
     },
});

router
     .route("/add/img/:id")
     .patch(upload.single("img"), (req, res) => {
          Chapter.findOneAndUpdate(
               { _id: req.params.id },
               {
                    $set: {
                         img: req.file.path,
                    },
               },
               { new: true },
               (err, result) => {
                    if (err) return res.json(err);
                    return res.json(result);
               }
          );
     });

router.route("/list").get((req, res) => {
     Chapter.find((err, result) => {
          if (err) return res.json(err);
          return res.json({ data: result });
     });
});

// Create Chapter Route
router.route("/new").post((req, res) => {
     console.log("inside the Chapter");
     const chapter = new Chapter({
          idx: req.body.idx,
          id: req.body.id,
          chapterTitle: req.body.chapterTitle,
          image: req.body.image,
     });
     chapter
          .save()
          .then(() => {
               console.log("Chapter Added");
               res.status(200).json({ msg: "Chapter Successfully Added" });
          })
          .catch((err) => {
               res.status(403).json({ msg: err });
          });
});

router.route("/delete/:idx").delete((req, res) => {
     Genre.findOneAndDelete({ idx: req.params.idx }, (err) => {
          if (err) return res.status(500).json({ msg: err });
          const msg = {
               msg: "Chapter deleted",
               chapterTitle: req.params.chapterTitle,
          };
          return res.json(msg);
     });
});

module.exports = router;