// campgrounds 라우터 js

const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
// const ExpressError = require("../utils/ExpressError");
// const { campgroundSchema } = require("../schema.js");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
// const upload = multer({ dest: "uploads/" }); local file 저장
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgrounds.index)) // campgrounds
  // .post(
  //   // CREATE 라우트가 :id 라우트보다 밑에 있으면 new경로를 id처리하기 떄문에 위에 있어야함
  //   isLoggedIn,
  //   validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가 // mongoose에서 이곳으로 발생된 오류가 있다면 캐스트 오류를 통해 확인하고
  //   catchAsync(campgrounds.createCampground) // 더이상 try...catch를 할 필요가 없이 catchAsync함수를 사용 , 오류가 발생하면 catchAsync가 검출하고 next로 전달한다.
  // );
  .post(upload.array("image"), (req, res) => console.log(req.body, req.files)); // "image"는 찾아야하는 필드,폼데이터 / 해당 미들웨어(upload.single())는 req에 file속성을 추가하고 body 나머지에도 추가

// CREATE - /:id 앞에 와야함
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

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground)) // READ campgrounds:id
  .put(
    // UPDATE PUT
    isLoggedIn,
    isAuthor,
    validateCampground, // 라우터 핸들러에 Joi 미들웨어 추가
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // DELETE

// UPDATE
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
