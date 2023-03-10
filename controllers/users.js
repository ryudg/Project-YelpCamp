const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    // passport에서 로그인 세션을 위해 지원하는 것으로  authenticate는 req.login을 자동 호출함
    // 사용자가 계정을 등록하거나 가입할 때 사용되는 것으로 새로운 사용자가 자동으로 로그인 상태를 유지하도록 함.
    // 이 함수는 콜백이 필요하므로 기다릴수가 없다. 따라서 err을 입력해 오류 매개변수인 콜백을 만듦
    // 데이터베이스에 사용자 계정을 저장하고, 비밀번호는 해시처리하고(registerUser 정의할 때)
    req.login(registerUser, (err) => {
      // 사용자 정보(registerUser를 이용해서 로그인 하면)
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!!!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo; // 해당 변수를 계속 사용하지 않으므로 삭제
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
  // req.logout() 메서드는 로그아웃을 처리하지만 에러가 발생할 가능성이 있어 콜백 함수를 넣어 에러 처리를 추가함
  // req.logout()에서 에러가 발생하면, next(err)를 통해 에러 핸들러로 전달.
  // 즉, req.flash()와 res.redirect() 구문이 실행되지 않고, 에러가 적절히 처리될 수 있게됨
  req.logout((err) => {
    if (err) next(err);
    req.flash("success", "Good Bye!!!");
    res.redirect("/campgrounds");
  });
};
