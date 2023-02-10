// reviews 라우터 js

const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
// const ExpressError = require("../utils/ExpressError");
// const { reviewSchema } = require("../schema.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// Creatae Review
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
