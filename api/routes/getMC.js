var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  req.mc.find(function (err, docs) {
    if (err === null) {
      res.json(docs);
    } else {
      res.send({ errMsg: err });
    }
  });
});

module.exports = router;
