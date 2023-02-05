const Joi = require("joi");
module.exports.campgroundSchema = Joi.object({
  // campground = Key, input의 name 값이 campground 반드시 키 아래에 값을이 있어야함
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
}); // 스키마 정의 후 스키마에 데이터 전달하기

module.exports.reviewSchema = Joi.object({
  revie: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
