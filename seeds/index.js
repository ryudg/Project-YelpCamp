const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connected"));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "63e4eddc8a1f210c9a4be2a6", // username: tinm, password: tim123
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae, aspernatur quae? Repellat molestiae laboriosam aspernatur officiis architecto recusandae sit ex numquam fuga est? Natus illum quo perspiciatis eaque! Cumque, iusto!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dcibff1dd/image/upload/v1676296685/YelpCamp/oiy3ionn8pj8mz6ey7g0.jpg",
          filename: "YelpCamp/oiy3ionn8pj8mz6ey7g0",
        },
        {
          url: "https://res.cloudinary.com/dcibff1dd/image/upload/v1676296686/YelpCamp/tcmccv5jkvnt06twv6iw.jpg",
          filename: "YelpCamp/tcmccv5jkvnt06twv6iw",
        },
      ],
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
