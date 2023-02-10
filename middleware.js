const { campgroundSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log("REQ", req.user);
  // 인증된 사용자가 아닐 경우, 즉 로그인 상태를 확인하는 미들웨어
  if (!req.isAuthenticated()) {
    // 인증된 사용자가 아니라면 요청한 url을 저장하고 /loging페이지로 리다이렉트함
    // 그 후 로그인 폼을 제출하면(로그인에 성공하면) /loging페이지로 리다이렉트하는것이 아닌 저장한 url로 리다이렉트
    // 그러기 위해서, 여러 요청 간의 일관성을 위해 세선을 저장. 즉, 상태성을 부여
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!!!");
    return res.redirect("/login");
  }
  next();
};
// passport 세션으로부터 정보를 담은 req.user 사용
// 결과
// {
//   _id: new ObjectId("63e4eddc8a1f210c9a4be2a6"),
//   email: 'tim@naver.com',
//   username: 'tim',
//   __v: 0
// }

// routes/reviews.js 리뷰 유효성 미들웨어
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// routes/campgrounds.js 유저 인증 미들웨어
// Joi Middlewawr 정의
module.exports.validateCampground = (req, res, next) => {
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

// user 인증 미들웨어
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

// rivew author 인증 미들웨어
// user 인증 미들웨어
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
