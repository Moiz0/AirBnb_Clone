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
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6863efb08f25fbe0ff31fb0d",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was introduced");
};

initDB();
