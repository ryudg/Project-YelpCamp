module.exports.isLoggedIn = (req, res, next) => {
  // 인증된 사용자가 아닐 경우, 즉 로그인 상태를 확인하는 미들웨어
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in first!!!");
    return res.redirect("/login");
  }
  next();
};
