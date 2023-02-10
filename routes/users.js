const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register)); // 새로운 사용자 생성(사용자 모델 인스턴스 생성)

router
  .route("/login")
  .get(users.renderLogin) // login
  // 로그인 전략, local(facebook,google 여러개 설정 가능)
  // passport.authenticate 두번째 인자의 객체에 지정할 수 있는 옵션
  // failureFlash(플래시 메시지 띄우기), failureRedirect(login 실패시 리다이렉트)
  .post(
    passport.authenticate("local", {
      // authenticate는 미들웨어 역할을 하는데 사용자 계정을 등록하기 전까지는 인증할게 없다.
      // 그래서 passport의 req.login을 사용함
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    users.login
  );

// logout
router.get("/logout", users.logout);

module.exports = router;
