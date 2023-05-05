var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  req.posts.find((err, docs) => {
    if (err === null) {
      res.json(docs);
    } else {
      res.send({ errMsg: err });
    }
  });
});
// find by ID,
router.get("/:id", (req, res, next) => {
  req.posts.findById(req.params.id, function (err, doc) {
    if (err === null) {
      res.json(doc);
    } else {
      res.send({ errMsg: err });
    }
  });
});

module.exports = router;
