const mongoose = require("mongoose");
const Listing = require("../Models/Listing");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/AirBnb");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was introduced");
};

initDB();
