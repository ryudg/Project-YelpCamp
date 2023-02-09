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
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registerUser = await User.register(user, password);
      // passport에서 로그인 세션을 위해 지원하는 것으로  authenticate는 req.login을 자동 호출함
      // 사용자가 계정을 등록하거나 가입할 때 사용되는 것으로 새로운 사용자가 자동으로 로그인 상태를 유지하도록 함.
      // 이 함수는 콜백이 필요하므로 기다릴수가 없다. 따라서 err을 입력해 오류 매개변수인 콜백을 만듦
      req.login(registerUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

// login
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

// logout
router.get("/logout", (req, res) => {
  // req.logout() 메서드는 로그아웃을 처리하지만 에러가 발생할 가능성이 있어 콜백 함수를 넣어 에러 처리를 추가함
  // req.logout()에서 에러가 발생하면, next(err)를 통해 에러 핸들러로 전달.
  // 즉, req.flash()와 res.redirect() 구문이 실행되지 않고, 에러가 적절히 처리될 수 있게됨
  req.logout((err) => {
    if (err) next(err);
    req.flash("success", "Good Bye!!!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
