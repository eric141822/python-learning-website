var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  req.question.find(function (err, docs) {
    if (err === null) {
      res.json(docs);
    } else {
      res.send({ errMsg: err });
    }
  });
});

router.get("/:id", (req, res, next) => {
  req.question.findById(req.params.id, function (err, doc) {
    if (err === null) {
      res.json(doc);
    } else {
      res.send({ errMsg: err });
    }
  });
});

module.exports = router;
