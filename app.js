const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
// const Joi = require("joi");
// const { campgroundSchema, reviewSchema } = require("./schema.js");
// const catchAsync = require("./utils/catchAsync");
// const Campground = require("./models/campground");
// const Review = require("./models/review");

// 라우터 불러오기
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// 사용하고자하는 라우터 지정
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

// home
app.get("/", (req, res) => {
  res.render("home");
});

// // makecampground
// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({
//     title: "My Backyard",
//     description: "cheap camping!",
//   });
//   await camp.save();
//   res.send(camp);
// });

// 404 Error 알수 없는 url 요청할 경우 가장 쉽게 처리하는 방법은 마지막에 app.all("*",(req,res,next))
// 상단의 모든 코드에 요청이 닿지 않는 경우에만 실행됨
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
  // new ExpressError를 next로 전달하므로 Error handler가 실핼되면 ExpressError가 그 오류가 됨
});

// Default Error handler
app.use((err, req, res, next) => {
  // app.all에서 불러올 상태 코드와 메세지를 가져오기
  const { statusCode = 500 } = err; // statusCode default value = 500, message default value = "Something went wrong"
  if (!err.message) err.message = "Oh No, ERROR!!!!!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server Opened 3000 Port");
});
