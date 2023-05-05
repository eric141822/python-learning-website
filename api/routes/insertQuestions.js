var express = require("express");
const mongoose = require("mongoose");
var router = express.Router();

function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

router.post("/", async (req, res) => {
  let testcases = [];

  if (Array.isArray(req.body.input)) {
    for (let i = 0; i < req.body.input.length; i++) {
      testcases.push({
        input: req.body.input[i],
        output: req.body.output[i],
        isHidden: false,
      });
    }
  } else if (req.body.input) {
    testcases.push({
      input: req.body.input,
      output: req.body.output,
      isHidden: false,
    });
  }
  if (Array.isArray(req.body.input_hidden)) {
    for (let i = 0; i < req.body.input_hidden.length; i++) {
      testcases.push({
        input: req.body.input_hidden[i],
        output: req.body.output_hidden[i],
        isHidden: true,
      });
    }
  } else if (req.body.input_hidden) {
    testcases.push({
      input: req.body.input_hidden,
      output: req.body.output_hidden,
      isHidden: true,
    });
  }
  var item = {
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    category: [req.body.category],
    topic: req.body.topic,
    difficulty: parseInt(req.body.difficulty),
    question: req.body.question,
    link: req.body.link,
    testcases: testcases,
  };

  const data = new req.question(item);
  await data.save();

  res.redirect("http://localhost:3000/TAInput");
});

router.post("/mc", async (req, res) => {
  let choices = [];
  let char = "A";
  for (let choice of req.body.choices) {
    if (choice) {
      choices.push(char + ". " + choice);
      char = nextChar(char);
    }
  }
  var item = {
    _id: new mongoose.Types.ObjectId(),
    topic: req.body.topic,
    answer: parseInt(req.body.answer),
    description: req.body.description,
    choices: choices,
  };

  const data = new req.mc(item);
  await data.save();

  res.redirect("http://localhost:3000/TAInput");
});

router.post("/posts", async (req, res) => {
  console.log(req.body);
  var item = {
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    user: req.body.user,
    description: req.body.description,
    question_id: req.body.question_id,
    comments: [],
  };
  console.log("new item: " + item);

  const data = new req.posts(item);
  await data.save();
  res.send("Post saved");
});

router.put("/posts/:id", async (req, res) => {
  await req.posts.findByIdAndUpdate(
    req.params.id,
    {
      $push: { comments: { user: req.body.user, comment: req.body.comment } },
    },
    { safe: true, upsert: true, new: true }
  );
  res.send("updated comment");
});

module.exports = router;
