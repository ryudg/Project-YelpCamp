if (process.env.NODE_ENV !== "production") {
  // 환경변수, 개발 혹은 프로덕션 환경
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
// const Joi = require("joi");
// const { campgroundSchema, reviewSchema } = require("./schema.js");
// const catchAsync = require("./utils/catchAsync");
// const Campground = require("./models/campground");
// const Review = require("./models/review");
const passport = require("passport");
const LocalStarategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");

// 라우터 불러오기
const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  name: "session", // 세션의 기본값 이름 변경
  secret: "secretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // 세션을 통해 설정된 쿠키는 http를 통해서만 엑세스할 수 있다.
    secure: true, // HTTP 프로토콜이 아닌 HTTPS 프로토콜을 통해서만 쿠키에 접근할 수 있도록 설정
    // 브라우저가 HTTPS 프로토콜을 사용하여 서버에 요청할 때만 쿠키가 전송되도록 하여, 보안을 강화할 수 있다.
    // 즉, secure: true는 중요한 정보가 포함된 쿠키를 안전하게 보호하기 위해 HTTPS 프로토콜을 사용해야 할 경우, 쿠키의 보안을 강화하기 위해 설정하는 옵션
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7일 후
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash()); // req.flash에 키-값 쌍을 전달해 플래시 생성
app.use(passport.initialize());
app.use(passport.session()); // 영구 로그인 세션, session()은 passport.session()전에 사용해야함
passport.use(new LocalStarategy(User.authenticate())); // passport가 LocalStarategy를 사용, LocalStarategy에 대해 인증 메서드는 사용자 모델에 위치하게됨(authenticate)
passport.serializeUser(User.serializeUser()); // passport에게 사용자를 어떻게 직렬화 하는지 알려줌, 직렬화는 어떻게 데이터를 얻고 세선세어 사용자를 저장하는지를 참조함
passport.deserializeUser(User.deserializeUser()); // 즉, 세선에 정보를 어떻게 저장하고 가져오는지를 결정하는 메서드이다.

app.use(mongoSanitize());

app.use((req, res, next) => {
  // console.log(req.session);
  // 해당 미들웨어를 거친 곳 전역에서 사용 가능한 변수만들기
  // 즉, currentUser, success... 은 모든 템플릿에서 사용할 수 있다.
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// 회원가입(가짜 데이터 넣기)
// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "son@gmail.com", username: "Son" });
//   // 암호를 전달하지 않음, register메서드를 사용(passport-local-mongoose 플러그인의 helper로 제공됨)
//   // 주어진 암호로 새로운 사용자 인스턴스를 등록, 사용자 이름의 중복 여부 확인하는 메서드
//   // User.register(user,password)는 전체 사용자 모델 인스턴스와 암호를 취하고 암호를 해시하고 저장함
//   const newUser = await User.register(user, "goals");
//   res.send(newUser);
// });

// const newUser = await User.register(user, "goals");의 결과
// {
// "email": "son@gmail.com",
// "_id": "63e4dc7cf7e0e43f70f66460",
// "username": "Son",
// "salt": "bef89f5ae2eb93b542e0848a8042e829678e9cb3ec7e29d15fe9a3b3fb3cd7dc",
// "hash": "0b4c43ad75dbd2a8493bfd5ca66a7c4a0d47918e8ff052e16911dddd7fd0b36e0.......",
// "__v": 0
// }

// 사용하고자하는 라우터 지정
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

// home
app.get("/", (req, res) => {
  res.render("home");
});

// // makecampground
// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({
//     title: "My Backyard",
//     description: "cheap camping!",
//   });
//   await camp.save();
//   res.send(camp);
// });

// 404 Error 알수 없는 url 요청할 경우 가장 쉽게 처리하는 방법은 마지막에 app.all("*",(req,res,next))
// 상단의 모든 코드에 요청이 닿지 않는 경우에만 실행됨
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
  // new ExpressError를 next로 전달하므로 Error handler가 실핼되면 ExpressError가 그 오류가 됨
});

// Default Error handler
app.use((err, req, res, next) => {
  // app.all에서 불러올 상태 코드와 메세지를 가져오기
  const { statusCode = 500 } = err; // statusCode default value = 500, message default value = "Something went wrong"
  if (!err.message) err.message = "Oh No, ERROR!!!!!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Server Opened 3000 Port");
});
