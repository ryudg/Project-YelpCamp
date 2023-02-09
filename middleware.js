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
