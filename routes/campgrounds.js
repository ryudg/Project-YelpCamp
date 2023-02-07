// campgrounds 라우터 js

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schema.js");

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

// campgrounds
router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// CREATE
router.get("/new", (req, res) => {
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
router.post(
  "/",
  validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가
  catchAsync(async (req, res, next) => {
    // 만약 req.body.campground가 없다면
    // 비동기 함수이므로 Express가 오류를 발생시키면 catchAsync가 해당 오류를 처리하고 아래에 있는 next로 넘긴다
    // 어디에든 오류를 발생시킬 수 있는 기초설정
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);

    const campground = new Campground(req.body.campground);
    req.flash("success", "Successfully Made a New Campground");
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// mongoose에서 이곳으로 발생된 오류가 있다면 캐스트 오류를 통해 확인하고
// 오류가 발생하면 catchAsync가 검출하고 next로 전달한다.

// READ campgrounds:id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground });
  })
);

// UPDATE
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// UPDATE PUT
router.put(
  "/:id",
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
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
