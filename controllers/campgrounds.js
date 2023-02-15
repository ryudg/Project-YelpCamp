const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary")

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  // 만약 req.body.campground가 없다면
  // 비동기 함수이므로 Express가 오류를 발생시키면 catchAsync가 해당 오류를 처리하고 아래에 있는 next로 넘긴다
  // 어디에든 오류를 발생시킬 수 있는 기초설정
  // if (!req.body.campground)
  //   throw new ExpressError("Invalid Campground Data", 400);
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully Made a New Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } }) // 캠핑장에 리뷰 배열의 모든 리뷰를 채워 넣기, 단 show 페이지에만 적용. 각각의 리뷰에 작성자를 채워 넣고 또 각각의 작성자를 각각의 캠핑장에 넣음
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that Campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  // 찾은 캠핑장이 있는지 확인 후에
  if (!campground) {
    req.flash("error", "Cannot find that Campground");
    return res.redirect("/campgrounds");
  }
  // 캠핑장을 찾았다면 해당 캠핑장의 저자와 현재 로그인한 유저가 일치하는지 확인
  // if (!campground.author.equals(req.user._id)) {
  //   // 해당 캠핑장을 생성하지 않은 사용자가 요청을 보낸경우 flas message 출력
  //   req.flash("error", "You do not have permission to do that");
  //   return res.redirect(`/campgrounds/${id}`);
  // } // isAuthor middleware 사용
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body)
  // const campground = await Campground.findById(id);
  // if (!campground.author.equals(req.user._id)) {
  //   // 해당 캠핑장을 생성하지 않은 사용자가 요청을 보낸경우 flas message 출력
  //   req.flash("error", "You do not have permission to do that");
  //   return res.redirect(`/campgrounds/${id}`);
  // }
  // findByIdAndUpdate를 두 단계로 나눠서 찾은 후에 업데이트할 수 있는지 확인하기.
  // 즉 코드가 캠핑장을 생성한 author을 찾고 현재 로그인한 사용자와 일치하면 요청 보내기
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }))
  campground.images.push(...imgs);
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
  }
  await campground.save()
  req.flash("success", "Successfully Updated Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  // const campground = await Campground.findById(id);
  // if (!campground.author.equals(req.user._id)) {
  //   // 해당 캠핑장을 생성하지 않은 사용자가 요청을 보낸경우 flas message 출력
  //   req.flash("error", "You do not have permission to do that");
  //   return res.redirect(`/campgrounds/${id}`);
  // }
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted Campground");
  res.redirect("/campgrounds");
};
