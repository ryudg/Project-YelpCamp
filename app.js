const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schema.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

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

// Joi Middlewawr 정의
const validateCampground = (req, res, next) => {
  // 기본 스키마 정의, Mongoose 스키마가 아니고 Mongoose로 저장하기도 전에 데이터 유효성 검사를 함
  // const campgroundSchema = Joi.object({
  //   // campground = Key, input의 name 값이 campground 반드시 키 아래에 값을이 있어야함
  //   campground: Joi.object({
  //     title: Joi.string().required(),
  //     price: Joi.number().required().min(0),
  //     image: Joi.string().required(),
  //     location: Joi.string().required(),
  //     description: Joi.string().required(),
  //   }).required(),
  // }); // 스키마 정의 후 스키마에 데이터 전달하기

  // schemas.js로 분리

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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

// campgrounds
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// CREATE
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
// CREATE POST
// app.post("/campgrounds", async (req, res, next) => {
//   try {
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
//   } catch (e) {
//     // error가 있다면 해당 오류로 next를 호출하고 밑의 기본 오류 핸들러를 실행시켜 오류 메시지가 나온다
//     next(e);
//   }
// });

// CREATE 라우트가 :id 라우트보다 밑에 있으면 new경로를 id처리하기 떄문에 위에 있어야함
// 더이상 try...catch를 할 필요가 없이 catchAsync함수를 사용
app.post(
  "/campgrounds",
  validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가
  catchAsync(async (req, res, next) => {
    // 만약 req.body.campground가 없다면
    // 비동기 함수이므로 Express가 오류를 발생시키면 catchAsync가 해당 오류를 처리하고 아래에 있는 next로 넘긴다
    // 어디에든 오류를 발생시킬 수 있는 기초설정
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// mongoose에서 이곳으로 발생된 오류가 있다면 캐스트 오류를 통해 확인하고
// 오류가 발생하면 catchAsync가 검출하고 next로 전달한다.

// READ campgrounds:id
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground });
  })
);

// UPDATE
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// UPDATE PUT
app.put(
  "/campgrounds/:id",
  validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// DELETE
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// Creatae Review
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// Delete Review
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    // $pull - 배열에 있는 모든 인스턴스 중에 특정 조건에 만족하는 값 지우기
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

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
