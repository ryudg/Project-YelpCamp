// reviews 라우터 js

const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Creatae Review
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review); // Cannot read properties of null (reading 'reviews') 라우터로 파일 옮긴 후 발생하는 error
    // app.js app.use 라우트 지정에 id를 포함했는데 접두사로 사용하는 경로에 id가 있다.
    // 하지만 리뷰 라우트의 id에 디폴트로 접근하지 않음, 즉 라우터가 분리된 매개변수를 갖고있음
    // mergePrams()를 사용해 지정하기 `const router = express.Router({ mergeParams: true });`
    // 그러면 app.js의 매개변수와 함께 review.js파일의 매개변수가 병합됨
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
// Delete Review
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    // $pull - 배열에 있는 모든 인스턴스 중에 특정 조건에 만족하는 값 지우기
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
