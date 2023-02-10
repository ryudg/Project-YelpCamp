// campgrounds 라우터 js

const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
// const ExpressError = require("../utils/ExpressError");
// const { campgroundSchema } = require("../schema.js");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// campgrounds
router.get("/", catchAsync(campgrounds.index));

// CREATE
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
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
  catchAsync(campgrounds.createCampground)
);
// mongoose에서 이곳으로 발생된 오류가 있다면 캐스트 오류를 통해 확인하고
// 오류가 발생하면 catchAsync가 검출하고 next로 전달한다.

// READ campgrounds:id
router.get("/:id", catchAsync(campgrounds.showCampground));

// UPDATE
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);
// UPDATE PUT
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가
  catchAsync(campgrounds.updateCampground)
);

// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
