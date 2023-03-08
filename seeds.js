const mongoose = require("mongoose");
const Item = require("./models/item");
mongoose.set("strictQuery", false);

// mongoose boiler
main().catch((err) => {
  console.log("OH NO MONGO seed ERROR!!!");
  console.log(err);
});

async function main() {
  await mongoose
    .connect("mongodb://127.0.0.1:27017/groceryApp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongo seed Connection OPEN!!!");
    });
}

const seedItems = [
  { listItem: "Boocha" },
  { listItem: "eggs" },
  { listItem: "bloobs" },
  { listItem: "strawbs" },
  { listItem: "chicken" },
  { listItem: "spinach" },
];

Item.insertMany(seedItems)
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
