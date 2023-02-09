// campgrounds 라우터 js

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
// const ExpressError = require("../utils/ExpressError");
// const { campgroundSchema } = require("../schema.js");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// campgrounds
router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

// CREATE
router.get("/new", isLoggedIn, (req, res) => {
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
  isLoggedIn,
  validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가
  catchAsync(async (req, res, next) => {
    // 만약 req.body.campground가 없다면
    // 비동기 함수이므로 Express가 오류를 발생시키면 catchAsync가 해당 오류를 처리하고 아래에 있는 next로 넘긴다
    // 어디에든 오류를 발생시킬 수 있는 기초설정
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);

    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully Made a New Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// mongoose에서 이곳으로 발생된 오류가 있다면 캐스트 오류를 통해 확인하고
// 오류가 발생하면 catchAsync가 검출하고 next로 전달한다.

// READ campgrounds:id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

// UPDATE
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // 찾은 캠핑장이 있는지 확인 후에
    if (!campground) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }
    // 캠핑장을 찾았다면 해당 캠핑장의 저자와 현재 로그인한 유저가 일치하는지 확인
    // if (!campground.author.equals(req.user._id)) {
    //   // 해당 캠핑장을 생성하지 않은 사용자가 요청을 보낸경우 flas message 출력
    //   req.flash("error", "You do not have permission to do that");
    //   return res.redirect(`/campgrounds/${id}`);
    // } // isAuthor middleware 사용
    res.render("campgrounds/edit", { campground });
  })
);
// UPDATE PUT
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    // if (!campground.author.equals(req.user._id)) {
    //   // 해당 캠핑장을 생성하지 않은 사용자가 요청을 보낸경우 flas message 출력
    //   req.flash("error", "You do not have permission to do that");
    //   return res.redirect(`/campgrounds/${id}`);
    // }
    // findByIdAndUpdate를 두 단계로 나눠서 찾은 후에 업데이트할 수 있는지 확인하기.
    // 즉 코드가 캠핑장을 생성한 author을 찾고 현재 로그인한 사용자와 일치하면 요청 보내기
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully Updated Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    // if (!campground.author.equals(req.user._id)) {
    //   // 해당 캠핑장을 생성하지 않은 사용자가 요청을 보낸경우 flas message 출력
    //   req.flash("error", "You do not have permission to do that");
    //   return res.redirect(`/campgrounds/${id}`);
    // }
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
