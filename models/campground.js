const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dcibff1dd/image/upload/w_100/v1676296685/YelpCamp/oiy3ionn8pj8mz6ey7g0.jpg

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
// 썸네일 이미지를 만들기 위한 주소 생성
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

// 기본값으로 Mongoose는 문서를 json으로 변활할 때 virtuals를 포함하지 않음
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

// mapbox cluster click popup
CampgroundSchema.virtual("properties.popMarkup").get(function () {
  return `
  <strong><a href="campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>
  `;
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
