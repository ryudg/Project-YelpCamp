const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

// Joi라는 Node.js의 스키마 유효성 검사 모듈을 확장하여, HTML 태그와 속성을 제거하는 기능을 추가한 코드
// Joi는 객체 형태의 데이터를 검증하는 데 사용되는 모듈인데, 이 모듈의 string 타입에 대한 기본 검증 규칙에 HTML 태그와 속성 제거 기능을 추가
// sanitize-html 라이브러리를 사용하여 입력받은 문자열의 HTML 태그와 속성을 제거한 뒤, 이를 검증.
// sanitize-html 라이브러리의 sanitizeHTML 함수는 첫 번째 인자로 입력받은 문자열을, 두 번째 인자로는 허용할 HTML 태그와 속성을 설정할 수 있는 객체를 받는다.
// rules 객체 안에 escapeHTML이라는 새로운 검증 규칙을 추가.
// 이 검증 규칙은 validate 메소드를 가지고 있고, 이 메소드 안에서는 sanitize-html 라이브러리를 사용하여 입력받은 문자열에서 HTML 태그와 속성을 제거한 뒤, 이를 검증.
// 만약 제거한 결과와 입력받은 문자열이 다르다면, helpers.error 메소드를 호출하여 오류 메시지를 생성하고, 검증을 실패시킨다. 그렇지 않다면 검증을 통과한 결과를 반환한다.
// messages 객체는 위 코드에서 추가한 검증 규칙에서 사용하는 메시지를 정의하는 객체다. 이 객체는 helpers.error 메소드를 호출하여 검증을 실패시킬 때 사용된다. string.escapeHTML이라는 메시지를 정의. 이 메시지는 HTML 태그가 포함된 문자열을 검증할 때 사용된다.
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  // campground = Key, input의 name 값이 campground 반드시 키 아래에 값을이 있어야함
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
}); // 스키마 정의 후 스키마에 데이터 전달하기

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
