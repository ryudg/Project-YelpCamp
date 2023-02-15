const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;


// https://res.cloudinary.com/dcibff1dd/image/upload/w_100/v1676296685/YelpCamp/oiy3ionn8pj8mz6ey7g0.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String,
})
// 썸네일 이미지를 만들기 위한 주소 생성
ImageSchema.virtual("thumbnail").get(function(){
  return this.url.replace("/upload","/upload/w_200")
})
const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// findByIdAndDelete가 작동시키는 미들웨어는 findOneAndDelete
// findByIdAndDelete를 사용하면서 remove나 removeOne같은 미들웨어를 설정하면 작동하지 않음
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
