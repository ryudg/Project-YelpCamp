const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});
// 새로운 사용자 생성
// 사용자 모델 인스턴스 생성
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registerUser = await User.register(user, password);
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});
// 로그인 전략, local(facebook,google 여러개 설정 가능)
// passport.authenticate 두번째 인자의 객체에 지정할 수 있는 옵션
// failureFlash(플래시 메시지 띄우기), failureRedirect(login 실패시 리다이렉트)
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!!!");
    res.redirect("/campgrounds");
  }
);

module.exports = router;
