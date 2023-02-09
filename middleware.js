module.exports.isLoggedIn = (req, res, next) => {
  console.log("REQ", req.user);
  // 인증된 사용자가 아닐 경우, 즉 로그인 상태를 확인하는 미들웨어
  if (!req.isAuthenticated()) {
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
