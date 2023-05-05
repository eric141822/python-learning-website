var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

const mongoose = require("mongoose");
const uri =
  "mongodb+srv://fyp21005:d87AubrgFRf0GgUw@fyp.swoqx.mongodb.net/fyp?retryWrites=true&w=majority";
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("Connection error: " + err);
    } else {
      console.log("Connected to MongoDB Atlas.");
    }
  }
);

var codeSchema = new mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    title: String,
    category: [String],
    difficulty: Number,
    question: String,
    link: String,
    topic: String,
    testcases: [{ input: String, output: String, isHidden: Boolean }],
  },
  { collection: "CodeQuestions" }
);

var mcSchema = new mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    description: String,
    choices: [String],
    answer: Number,
    topic: String,
  },
  { collection: "MCQuestions" }
);

var postsSchema = new mongoose.Schema(
  {
    _id: mongoose.ObjectId,
    title: String,
    description: String,
    user: String,
    comments: [{ user: String, comment: String }],
    question_id: String,
  },
  { collection: "Posts" }
);

var question = mongoose.model("CodeQuestions", codeSchema);
var mc = mongoose.model("MCQuestions", mcSchema);
var posts = mongoose.model("Posts", postsSchema);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var getQuestionsRouter = require("./routes/getQuestions");
var insertQuestionsRouter = require("./routes/insertQuestions");
var getMCRouter = require("./routes/getMC");
var getPostsRouter = require("./routes/getPosts");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());

// allow CORS for local dev.
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.question = question;
  req.mc = mc;
  req.posts = posts;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/questions", getQuestionsRouter);
app.use("/insert", insertQuestionsRouter);
app.use("/mc", getMCRouter);
app.use("/posts", getPostsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
