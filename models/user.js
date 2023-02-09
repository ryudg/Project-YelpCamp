const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const Schema = mongoose.Schema;

// 사용자 이름과 암호는 지정하지 않는데, 아래의, `passportLocalMongoose`에서 정의
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
// 패키지를 불러온 결과를 `UserSchema.plugin`에 전달함
// 스키마에 사용자 이름과 암호를 추가함
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
